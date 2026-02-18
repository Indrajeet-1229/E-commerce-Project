import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sideabar from './components/Sideabar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer, toast } from 'react-toastify';


export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency='$';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token")? localStorage.getItem("token"):'');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token])

  return (
    <div div className='bg-gray-50 min-h-screen'>
      <ToastContainer  autoClose={1000}/>
      {token === ""
        ? <Login setToken={setToken} /> :
        <>
          <Navbar  setToken={setToken}/>
          <hr />
          <div className="flex w-full">
            <Sideabar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                {/* <Route path='/' element={<Navigate  to="/add"/>} /> */}
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
              </Routes>
            </div>
          </div></>
      }

    </div>
  )
}

export default App