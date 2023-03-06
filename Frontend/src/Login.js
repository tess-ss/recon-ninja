import axios from 'axios'
import React, { useState } from 'react'
import { changeHeaders } from './axiosConfig'

function Login({ setlogin }) {
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")

    const onSubmitHandler = (e) => {
        e.preventDefault()
        axios
            .post('/api/login', { username: username, password: password }, {

                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    // 'Authorization':`Bearer ${userInfo.token}`
                },

            }).then(res => {
                console.log(res);
                if (res?.data?.valid) {
                    localStorage.setItem("userLoginInfo", JSON.stringify({ token: res.data.token }))
                    setlogin(res.data.token);
                    changeHeaders(res.data.token)
                }
                else {
                    console.log("Not valid");
                }
            })
    }
    return (
        <div className='flex h-screen'>
            <div className='shadow-md rounded px-8 pt-6 pb-8 border-white border m-auto'>
                <form onSubmit={(e) => onSubmitHandler(e)} >
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" for="username">
                            Username
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 placeholder-gray-600 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" onChange={(e) => { setusername(e.target.value) }} value={`${username}`}></input>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-bold mb-2" for="password">
                            Password
                        </label>
                        <input onChange={(e) => { setpassword(e.target.value) }} value={`${password}`} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 placeholder-gray-600 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="*******"></input>
                    </div>
                    <div className='flex justify-center'>
                        <button type="submit" className="bg-transparent hover:bg-slate-700 text-gray-200 font-semibold hover:text-white py-2 px-4 border border-gray-300">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
