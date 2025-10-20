import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

const DashboardLayout = () => {
    return (
        <div className="flex-1">
            <Sidebar />
                <div className="p-6">
                <Outlet />
            </div>
        </div>
    )
}

export default DashboardLayout