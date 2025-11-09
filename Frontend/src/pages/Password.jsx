import React from "react"
import { useState } from "react"
import {useNavigate, useSearchParams} from "react-router-dom"
import authServices from "../services/authServices"
import toast from "react-hot-toast"

const Password = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const token = searchParams.get("token")

    const handleForgot = async (e) => {
        e.preventDefault()

        try {
            await authServices.forgottenPassword({email})
            toast.success("Check your email to reset your password")
        } catch (error) {
            console.error(error)
            toast.error("Email not found")
        }
    }

    const handleReset = async (e) => {
        e.preventDefault()

        try {
            await authServices.resetPassword({password, token})
            toast.success("Password reset successful, please login!")
            setTimeout(() => navigate("/login"), 2000)
        } catch (error) {
            console.error(error)
            toast.error("Tokens not valid")
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className='w-[430px] bg-white p-8 rounded-2xl shadow-lg'>
                <h2 className='text-3xl font-semibold text-center mb-10'>{token ? "Reset password" : "Forgot password"}</h2>
                {!token ?(
                    <form onSubmit={handleForgot}>
                        <input type="email" placeholder='Enter your email' className='w-full p-3 border-b-2 border-gray-300 outline-none focus:border-red-800 placeholder-gray-400' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        <button type='submit' className='w-full mt-6 p-3 bg-gradient-to-r from-red-900 via-red-800 to-red-700 text-white rounded-full text-lg font-medium hover:opacity-90 transition'>Kirim</button>
                    </form>
                ) : (
                    <form onSubmit={handleReset}>
                        <input type="password" placeholder='New password' className='w-full p-3 border-b-2 border-gray-300 outline-none focus:border-red-800 placeholder-gray-400' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        <button type='submit' className='w-full mt-6 p-3 bg-gradient-to-r from-red-900 via-red-800 to-red-700 text-white rounded-full text-lg font-medium hover:opacity-90 transition'>Reset</button>
                    </form>
                )}
        </div>
     </div>
    )
}

export default Password