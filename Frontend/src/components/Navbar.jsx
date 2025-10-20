import React from "react"

const Navbar = () => {
    const data = JSON.parse(localStorage.getItem("user"))
    const user = data.user || {}
    const username = user.username || "User"
    return (
        <div className="ml-64 bg-white flex justify-between items-center px-8 py-4">
            <div>
                <h2 className="text-xl font-semibold">Welcome Back, {username}</h2>
            </div>
        </div>
    )
}

export default Navbar