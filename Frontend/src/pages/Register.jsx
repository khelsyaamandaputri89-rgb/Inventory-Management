import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import gambar2 from '../assets/login.png'
import {useState} from 'react'
import authServices from '../services/authServices'
import toast from 'react-hot-toast'

const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [agre, setAgre] = useState(false)
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            if (!agre) {
                toast.error("You must agree to the terms and conditions that have been provided")
                return
            }
            const result = await authServices.register({username, email, password})
            console.log(result.data)
            navigate("/login")
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError("Username already in use")
            } else {
                setError("Failed to sign up, please try again")
            }
        }
    }

    return (
        <div className='min-h-screen flex w-screen relative left-1/2 right-1/2 -mx-[50vw]'>
            <div className='w-1/2 bg-white flex flex-col justify-center items-center p-10'>
                <img src={gambar2} className='mt-10 w-100' />
                <h2 className='text-2xl font-bold text-red-900 mb-3 mt-10'>Very simple way you can engange</h2>
                <p className='text-red-800 text-center max-w-md'>
                   Welcome to (K-smartInventory) Inventory Management System, and manage your inventory with ease
                </p>
            </div>
            <div  className='w-1/2 bg-red-800 text-white flex flex-col items-center justify-center text-left'>
                <div className='w-full max-w-md'>
                    <h2 className='text-2xl font-bold mb-2'>Create an account</h2>

                    <form onSubmit={handleRegister}>
                    <label className='text-sm text-left'>Username</label>
                        <input type="text" placeholder="Enter your username" 
                        className='w-full mt-1 mb-4 p-2 rounded bg-white text-black'
                        onChange={(e) => {setUsername(e.target.value)}}
                        />
                    <label className='text-sm text-left'>Email</label>
                        <input type="email" placeholder="Enter your email" 
                        className='w-full mt-1 mb-4 p-2 rounded bg-white text-black'
                        onChange={(e) => {setEmail(e.target.value)}}
                        />
                    <label className='text-sm'>Password</label>
                    <div className='relative'>
                        <input type="password" placeholder="Enter your password" 
                        className='w-full mt-1 mb-4 p-2 rounded bg-white text-black'
                        onChange={(e) => {setPassword(e.target.value)}}
                        />  
                    </div>
                   
                    <div className='flex text-sm mb-6 justify-between items-center w-full'>
                        <label className='flex items-center space-x-2'>
                            <input type="checkbox" 
                            className='accent-red-500'
                            onChange={(e) => {setAgre(e.target.value)}}
                             />
                            <span> I agree</span>
                        </label>
                    </div>   

                    {error && <p className='text-red-300 text-sm mb-3'>{error}</p>}    

                    <button className='w-full py-2 bg-red-100/30 text-white rounded hover:bg-red-900'>
                        Sign up
                    </button> 

                    <p className="text-center text-sm mt-4 text-gray-300">
                        Already have an account?{" "}
                    <Link to="/login" className="text-white font-semibold hover:underline">
                        Login
                    </Link>
                    </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register