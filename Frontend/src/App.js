import axios from "axios"
import { useEffect, useState } from "react"
import Login from "./Login"
import Main from "./Main"

function App() {
    const [login, setlogin] = useState(null)
    useEffect(() => {
      setlogin(localStorage.getItem("userLoginInfo")?JSON.parse(localStorage.getItem("userLoginInfo")):null)

    }, [])
  return (
    <div >

        {login ? <Main/> : <Login setlogin={setlogin} /> }
        

    </div>
  );
}

export default App
