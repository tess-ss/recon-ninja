const express =require( "express")
const multer =require( "multer")
const bodyParser =require( "body-parser")
const connectDB =require( "./db.js")
const fs =require( "fs")
const path =require( "path")
const cors =require( "cors")
const File =require( "./Models/Files.js")
const User =require("./Models/Users.js")
const app =express()
const jwt =require("jsonwebtoken")
// const { exec } = require('child_process')
const {Queue,Worker} = require("bullmq")
const generateWebToken =require("./generateWebToken.js")
const util = require('util');
const exec = util.promisify(require('child_process').exec)
const Template=require("./Models/Template")
const { WebhookClient } = require("discord.js")

const queue = new Queue('httpx queue', {});
const nuclei = new Queue('nuclei queue',{});

const discordWebhookUrl="https://discord.com/api/webhooks/1069463832373772358/pSlDqCxewfhiyYQg16uUURhmReRg8sE7WnqzV9vXO7lTciLkp81GhdFnrVHAsr2MVMVC"

const nucleiWorker=new Worker('nuclei queue',async(job)=>{
    const { urls,template } = job.data;
    console.log("yello from nuclei worker");
    fs.writeFileSync(`temp/${job.id}`, urls);
    fs.writeFileSync(`template/${template.name}.yaml`, template.value);
    const { stdout, stderr } = await exec(`nuclei -list temp/${job.id} -t "./template/${template.name}.yaml" -silent -bulk-size 20 -c 15 -nc -o ${job.id}.json`)
    console.log(stdout,stderr);
    fs.unlinkSync(`temp/${job.id}`);
    fs.unlinkSync(`template/${template.name}.yaml`);

    const webhookClient = new WebhookClient({ url:discordWebhookUrl });
    webhookClient.send({
        content: `Scan completed \n${stdout}`,
        username: 'Nuclei Results',
        avatarURL: 'https://i.imgur.com/AfFp7pu.png',
        files: [`${job.id}.json`]
    });



})

app.use(bodyParser.json({limit: '50mb'}));
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));

const worker = new Worker('httpx queue', async (job) => {
    console.log("yello");
    const { data,filepath,originalname } = job.data;
    try {
        console.log(`cat ${filepath} | httpx -silent -json -td -title > '${filepath}.json'`);
        await exec(`cat ${filepath} | httpx -silent -json -td -title > '${filepath}.json'`)
    } catch (error) {
        console.log(error);
    }


    try{
        fs.readFile(filepath+'.json', 'utf8', function(err, readData){
            const array=[]
            // console.log(readData);
            const filter=readData.split('\n')
            const jsonString='['+filter.join(',').replace(/,(\s+)?$/, '')+']'
            JSON.parse(jsonString).map(x=>{
                array.push({
                    url:x.url || "",
                    cname:x.cname || "",
                    webserver:x.webserver || "",
                    title:x.title||""
                })
            })
            const file=new File({name:originalname,domains:array})
            file.save().then(() => console.log('File saved'));
        })
    }catch (error){
        console.log(error);
    }
    return "Worker is complete"
    
}, { concurrency: 50 });

worker.on('completed', (job, returnvalue) => {
    console.log("yello");
});

const protect=async(req,res,next)=>{
    // console.log(req.headers);
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        console.log("Token found");
    } 
    try {
        token =req.headers.authorization.split(" ")[1]
        const decoded=jwt.verify(token,"abcd1234")
        req.user=await User.findById(decoded.id).select("-password")
        
    } catch (error) {
        console.error(error)
        res.status(401)
        res.send("Token not authorized")
    }
    if(!token){
        res.status(401)
        res.send("Token not found");
    }
    next()
}

const storage=multer.diskStorage({
    destination(req,file,cb){
        cb(null,"uploads/")
    },
    filename(req,file,cb){
        cb(null,`${file.originalname}`)
    }
})
const upload=multer({storage})

connectDB() 

app.get('/', (req, res) => {
    app.use(express.static(path.join(__dirname,"/build")))
    res.sendFile(path.resolve('build/index.html'))
  })
app.post('/api/post',protect,upload.single('file'),(req,res)=>{
    
    fs.readFile(req.file.path, 'utf8', function(err, data){
        console.log(typeof data);
        queue.add(req.file.originalname,{data:data,filepath:req.file.path,originalname:req.file.originalname})
    });
    res.send(`${req.file.originalname} file uploaded successfully`)
})

app.get('/api/yaml',async(req,res)=>{
    const templates=await Template.find({});
    res.json(templates)
})

app.post('/api/yaml',async (req,res)=>{
    const template=await Template({name:req.body.name,value:""})
    template.save()
    res.send("Added new template")
})

app.post('/api/yaml/:id',async(req,res)=>{
    console.log(req.body);
    const temp=await Template.findByIdAndUpdate(req.params.id,{value:req.body.value})
    console.log(temp);
    res.send("Successfully updated")
})

app.get('/api/all',protect,async(req,res)=>{
    const page=req.query.page
    const keyword=req.query.keyword? {
        name:{
            $regex:req.query.keyword,
            $options:"i"
        }
    }:{}
    const jobs=await queue.getJobs('active')
    const count=Math.ceil((await File.countDocuments({...keyword}))/10)
    const all = await File.find({...keyword},"name").limit(10).skip(page*10)
    const data={files:all,runningJobs:jobs,count:count}
    res.json(data)
})

app.post('/api/runnuclei',protect,async(req,res)=>{
    const template=await Template.findById(req.body.templateid)
    // fs.writeFileSync(`temp/`, req.body.urls);
    // fs.writeFileSync(`template/${template.name}.yaml`, template.value);
    // await exec(`nuclei -list temp/${template.name} -t "./template/${template.name}.yaml" -silent -bulk-size 20 -c 15 -json > iamops.io.txt.json`)
    // fs.unlinkSync(`temp/${template.name}.yaml`);
    // fs.unlinkSync(`template/${template.name}.yaml`);
    const file=await File.findById(req.body.domainid)
    console.log(file.name,req.body.templateid);
    nuclei.add(file.name,{template:template,urls:req.body.urls})
    res.send("Scan has started running")
})

app.get('/api/nucleirunning/:id',protect,async(req,res)=>{
    var jobs=await nuclei.getJobs(['active','waiting'])
    console.log(jobs);
    const file=await File.findById(req.params.id)
    jobs=jobs.filter(job=> {
        return job.name==file.name
    })
    jobs=jobs.map(job=>{
        return {name:job.name,id:job.id}
    })
    res.json(jobs)
})

app.get('/api/:id',protect,(req,res)=>{
    File.findById(req.params.id, function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
            res.json(docs)
        }
    })
})

app.post('/api/login',async(req,res)=>{
    const user=await User.findOne({username:req.body.username})
    // console.log(user,req.body);
    if(req.body.password==user.password){
        res.json({'valid':true,token:generateWebToken(user._id)});
    }
    else {
        res.json({'valid':false})
    }
})

app.listen(3000, () => {
    console.log(`Server running on http://127.0.0.1:3000`)
  })
