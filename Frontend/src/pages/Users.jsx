import React, { useEffect, useState } from "react"
import userServices from '../services/userServices'
import toast from "react-hot-toast"
import Table from "../components/Table"
import FormModal from "../components/ModalForm"
import Swal from "sweetalert2"
import { FiArrowLeft } from "react-icons/fi"

const User = () => {
    const [user, setUser] = useState([])
    const [search, setSearch] = useState("")
    const [isModalOpen, setModalOpen] = useState(false)
    const [isEditMode, setEditMode] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({username : "", email : "",password : "", role : ""})

    const fetchDataUser = async () => {
        setLoading(true)
        try {
            const result = await userServices.getUsers()
            setUser(result.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDataUser()
    }, [])

    const handleAdd = () => {
        setFormData({username : "", email : "", password : "", role : ""})
        setEditMode(false)
        setModalOpen(true)
    }

    const handleEdit = (row) => {
        setFormData(row)
        setEditMode(true)
        setModalOpen(true)
    }

    const handleSubmit = async () => {
        try {
            console.log("[handleSubmit] formData:", formData, "isEdit:", isEditMode);
            if (isEditMode) {
                if (!formData.id) throw new Error("Missing users id for update")
                await userServices.updateUsers(formData.id, formData)
                toast.success("Users updated")
            } else {
                await userServices.addUsers(formData)
                toast.success("Users added")
            }
                setModalOpen(false)
                fetchDataUser()
        } catch (error) {
            console.error("[handleSubmit] error:", error)
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed to save users")
            }
        }
    }

    const handleDelete = async (id) => {
        const result = await Swal.fire({
                    title: 'Are you sure?',
                    text: "This action cannot be undone!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#b91c1c',
                    cancelButtonColor: '#CBCBCB',
                    confirmButtonText: 'Yes, delete it!',
                    background: '#fff',
                })
        if (result.isConfirmed)
        try {
            const result = await userServices.deleteUsers(id)
            toast.success(result.data.message)
            fetchDataUser()
        } catch (error) {
            console.error("[handleDelete] error:", error)
            toast.error("Failed to delete users")
        }
    }

    const handleSearch = async (keyword) => {
        try {
            setSearch(keyword)
            if (keyword.trim() === "") {
                fetchDataUser()
                return
            }
            const result = await userServices.searchUsers(keyword)
            console.log("[handleSearch] response:", result)
            setUser(Array.isArray(result.data) ? result.data : [])
        } catch (error) {
            console.error("[handleSearch] error:", error)
            toast.error("Search failed");
        }
    }



    return (    
        <div>
            <div className="p-6 pt-1">
                <div className="ml-64 px-2 py-1">
                    <div 
                        onClick={() => window.history.back()} 
                        className="flex items-center text-red-800 cursor-pointer mb-2"
                    >
                        <FiArrowLeft className="mr-2" /> Back
                    </div>
                    <h1 className="text-2xl font-bold mb-5 mt-8">Users</h1>
                </div>
                {loading && <p>Loading...</p>}

                <Table
                    title="Users"
                    columns={[
                        { header: "ID", accessor: "id" },
                        { header: "Username", accessor: "username" },
                        { header: "Email", accessor: "email" },
                        { header: "Role", accessor: "role" },
                    ]}
                    data={user}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSearch={handleSearch}
                />

                <div >
                <FormModal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    title={isEditMode ? "Edit Users" : "Add Users"}
                    fields={[
                        { name: "username", label: "Username", placeholder: "Enter username" },
                        { name: "email", label: "Email", placeholder: "Enter email" },
                        { name: "password", label: "Password", placeholder: "Enter password", Style: "password"},
                        { name: "role", label: "Role", placeholder: "Enter role" },
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                />
                </div>
            </div>
        </div>
    )
}

export default User