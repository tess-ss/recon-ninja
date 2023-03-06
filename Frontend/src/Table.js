import React, { useEffect, useState } from 'react'
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-buttons/js/dataTables.buttons"
import "datatables.net-buttons/js/buttons.colVis"
import "datatables.net-buttons/js/buttons.flash"
import "datatables.net-buttons/js/buttons.html5"
import "datatables.net-buttons/js/buttons.print"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from'jquery'
import Modal from "./Modal"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Table({data,setdata}) {
  const [urls, seturls] = useState([])
  const [scansRunning, setscansRunning] = useState([])
  useEffect(() => {
    console.log("inside useffect");
    axios.get('/api/nucleirunning/'+data._id).then(res=>{setscansRunning(res.data);console.log(res.data);})
  }, [])
  const makeChange=async()=>{
    // await new Promise(resolve => setTimeout(resolve, 500));
    setscansRunning([...scansRunning,{name:data.name}])
    // axios.get('/api/nucleirunning/'+data._id).then(res=>{setscansRunning(res.data);console.log(res.data);})
  }
  useEffect(() => {
        $(document).ready(function(){
          console.log(Array.isArray( data.domains[0]));
          var columns=( Array.isArray(data.domains[0]) ? [{title:'Url' },]:
          [
            { data: 'url',title:'Url' },
            { data: 'cname',title:'Cname' },
            { data: 'title',title:'Title' },
            { data: 'webserver',title:'WebServer' },
        ] )
          var table=$('#example').DataTable({
            // dom: 'B<"clear">lfrtip',
            // buttons: true,
            dom: '<B><"p-2 text-gray-300"l>fr<"my-3"t>ip',
            searching:true,

            buttons: {
              buttons: [
                  { extend: 'copy', className: 'bg-transparent hover:bg-slate-700 text-gray-200 font-semibold hover:text-gray-300 py-2 px-4 border border-gray-300  mb-2 mr-3',text:"Copy text" },
                  {
                    extend: "csvHtml5",
                    className: 'bg-transparent hover:bg-slate-700 text-gray-200 font-semibold hover:text-gray-300 py-2 px-4 border border-gray-300  mb-2',
                    text:"Download urls",
                    fieldBoundary: '',
                    extension: ".txt",
                    header: false,
                    exportOptions: {
                        columns: [0]
                    }
                }
              ]
            },
            autoWidth:false,
            data: data.domains,
            columns:columns
          //   columns: [
          //     { data: 'url',title:'url' },
          //     { data: 'cname',title:'cname' },
          //     { data: 'title',title:'title' },
          //     { data: 'webserver',title:'webserver' },
          //   //   { title: 'Cname' },
          // ],
        })
        $.fn.dataTable.ext.classes.sPageButton = 'bg-transparent hover:bg-slate-700 text-gray-200 font-semibold hover:text-gray-300 py-2 px-4 border border-gray-300  mr-2 mb-2'
        $('.dataTables_filter').addClass('mb-3');
        seturls(table.column(0).data())
        table.buttons().container()
            .appendTo( $('btn btn-primary', table.table().container() ) );
    })
      
    }, [])
  return (
    <div>
      {scansRunning.map(job=>{
        toast.info(job.name+" is running!");
        return (
          <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          />

      )})}
          <button type="button" className="bg-transparent hover:bg-slate-700 text-gray-200 font-semibold hover:text-gray-300 py-2 px-4 border border-gray-300 mr-4 mb-2 " aria-label="Left Align" onClick={()=>setdata()}>
            &#8592; Home
          <span className="glyphicon glyphicon-home" aria-hidden="true"></span>
        </button>
        <Modal urls={urls} id={data._id} makeChange={makeChange}/>

        <div className="text-center text-gray-300 text-xl font-semibold">
            <h3>Subdomains</h3>
        </div>
        <div className='container text-gray-300'>
            <table id="example" className='display mt-2 table-auto text-gray-300 bg-zinc-800'>
    
            </table>
        </div>
    </div>
  )
}
