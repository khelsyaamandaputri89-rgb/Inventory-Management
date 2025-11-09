import { Navigate } from "react-router-dom"

const ProtectedRoute = ({children, allowedRoles}) => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    const user = userData ? JSON.parse(userData) : null
    const role = user?.role || ""

    if (!token) 
        return <Navigate to = "/login" replace />

    if(allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to = "/" replace />
    }

    return children
}

export default ProtectedRoute