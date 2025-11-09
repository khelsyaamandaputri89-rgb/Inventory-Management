import React from 'react'
import gambar1 from '../assets/login1.png'
import {Link, useNavigate} from 'react-router-dom'
import {useState} from 'react'
import authServices from '../services/authServices'
import toast from "react-hot-toast"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const result = await authServices.login({email, password})

            const user = result.data.user
            const token = result.data.token

            if (user) {
                localStorage.setItem("user", JSON.stringify(user))
                localStorage.setItem("token", token)
                console.log("login succesfully", user)
                toast.success("Login succesfully")
                setTimeout(() => navigate("/dashboard"), 100)
            } else {
                console.log("User not found in localstorage", result.user)
            }
        } catch (error) {
            setError("Failed to login, please check your email or password")
            console.error(error)
        }
    }

    return (
        <div className='min-h-screen flex w-screen relative left-1/2 right-1/2 -mx-[50vw]'>
            <div className='w-1/2 bg-white flex flex-col justify-center items-center mt-10 p-7'>
                <h2 className='text-2xl font-bold text-red-900 mb-3'>Inventory Management</h2>
                <p className='text-red-800 text-center max-w-md'>
                    Join uor platform to sterealine your inventory process
                </p>
                <img src={gambar1} className='mt-2 w-full' />
            </div>
            <div  className='w-1/2 bg-red-800 text-white flex flex-col items-center justify-center text-left'>
                <div className='w-full max-w-md'>
                    <h2 className='text-2xl font-bold mb-2'>Welcome Back!</h2>
                    <p className='text-sm mb-8'>
                        Please enter log in details bellow :
                    </p>

                    <form onSubmit={handleLogin}>
                    <label className='text-sm text-left'>Email</label>
                        <input type="email" placeholder="Enter your email" 
                        className='w-full mt-2 mb-2 p-2 rounded bg-white text-black focus:border-red-400'
                        onChange={(e) => {setEmail(e.target.value)}}/>
                    <label className='text-sm'>Password</label>
                    <div className='relative'>
                        <input type="password" placeholder="Enter your password" 
                        className='w-full mt-2 mb-4 p-2 rounded bg-white text-black focus:border-red-400'
                        onChange={(e) => {setPassword(e.target.value)}}/>  
                    </div>           

                    <div className='flex text-sm mb-6 justify-between items-center w-full'>
                        <label className='flex items-center space-x-2'>
                            <input type="checkbox" className='accent-red-500' />
                            <span> Remember me </span>
                        </label>
                        <Link to="/forgot-password" className="hover:underline text-white">
                         Forgotten password?
                        </Link>
                    </div>     

                    {error && <p className='text-red-300 text-sm mb-3'>{error}</p>} 

                    <button className='w-full py-2 bg-red-100/30 text-white rounded hover:bg-red-900'>
                        Login
                    </button> 

                    <p className="text-center text-sm mt-4 text-gray-300">
                        Don't have accoount?{" "}
                    <Link to="/signup" className="text-white font-semibold hover:underline">
                        SignUp
                    </Link>
                    </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login