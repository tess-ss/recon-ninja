import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Files from './Files';
import Table from './Table';

function Main() {
  const [data, setdata] = useState(null)
    
    return (
    <div className="p-5">
      {data ? <Table data={data} setdata={setdata} /> : <Files setdata={setdata}/>}
    </div>
  );
}

export default Main;
