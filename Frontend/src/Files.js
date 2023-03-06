import axios from "axios";
import { useEffect, useState } from "react";

function Files({setdata}) {
  const [fileupload, setfileupload] = useState(null)
  const [message, setmessage] = useState("")
  const [files, setfiles] = useState([])
  const [page, setpage] = useState(0)
  const [count, setcount] = useState(0)
  const [worker, setworker] = useState([])
  const [change, setchange] = useState(false)
  const [search, setsearch] = useState("")
  useEffect(() => {
    axios.get(`api/all?page=${page}&keyword=${search}`).then(res=>{
      setfiles(res.data.files);
      setcount(res.data.count);
      setworker(res.data.runningJobs);
    })
  }, [page,change])
  
  const searchHandler=async(e)=>{
    setsearch(e.target.value)
    axios.get(`api/all?page=${page}&keyword=${search}`).then(res=>{
      setfiles(res.data.files);
      setcount(res.data.count);
      setworker(res.data.runningJobs);
    })
  }

  const onSubmitHandler=(e)=>{
    e.preventDefault()
    if (fileupload){
      const data = new FormData();
      data.append("file",fileupload)
      axios.post('/api/post',data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
   }).then(res=>{setmessage(res.data);setchange(!change)})
    }
  }
  const onFileUpload=(e)=>{
    setfileupload(e.target.files?.[0])
  }

  const handledomains=async(id)=>{
    axios.get(`/api/${id}`).then((res) =>{setdata(res.data)})
  }
  return (
    <>   
          <div className="my-4 ">
            <form action="/post" method="post" encType="multipart/form-data" onSubmit={(e)=>onSubmitHandler(e)} >
              <input type="file" className="text-white" onChange={(e)=>{onFileUpload(e)}} name="file" />
              <input type="submit" className="bg-transparent hover:bg-slate-700 text-gray-200 font-semibold hover:text-white py-2 px-4 border border-gray-300" /> 
            </form>
          </div>
      {message && 
     <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-2" role="alert">
     <p>{message}</p>
   </div>
} 
    <div>
      {worker.map(job=>(
        <div key={job?.id} className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md mb-2" role="alert">
        <div className="flex">
            <p>{job.name} is still running</p>
        </div>
      </div>

      ))}
    </div>
    <div className="md:flex justify-between mb-2">
      <div className="mb-3 flex gap-3 flex-wrap">
      {Array(count).fill().map((x,i)=>(
        <button key={`${i}`} onClick={()=>setpage(i)} className="bg-transparent hover:bg-slate-700 text-gray-200 font-semibold hover:text-white py-2 px-4 border border-gray-300">
              {i+1}
            </button>
        )
        )}
      </div>
      <div>
        <input onChange={searchHandler} value={search} className="bg-transparent hover:bg-zinc-800 text-gray-200 font-semibold hover:text-white py-2 px-4 border border-gray-300 placeholder-gray-400" placeholder="Search..." ></input>
      </div>
    </div>


    <div>
        {files.map(file=>(
          <button id={`${file._id}`} key={`${file._id}`} className="w-full bg-transparent hover:bg-slate-700 text-gray-200 font-semibold hover:text-white py-2 px-4 border border-gray-300  mr-2 mb-2" onClick={()=>{handledomains(file._id)}}>
              {file.name}
          </button>
        ))}
    </div>
    </>
  )
}

export default Files
