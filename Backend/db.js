const mongoose=require('mongoose')
const connectDB=async()=>{
    try{
        await mongoose.connect('mongodb+srv://<paste-db-here>')
        console.log('Connected!');
    }
    catch (err){
        console.log("Unexpected Error",err);
    }
}

module.exports=connectDB
