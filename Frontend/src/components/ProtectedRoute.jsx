import { all } from "axios"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({children, allowedRoles}) => {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"))
    const role = user.role || ""

    if (!token) 
        return <Navigate to = "/login" replace />

    if(allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to = "/signup" replace />
    }

    console.log("TOKEN:", token)
    console.log("ROLE:", role)
    console.log("ALLOWED:", allowedRoles)
    console.log("ACCESS?", allowedRoles.includes(role))


    return children
}

export default ProtectedRoute