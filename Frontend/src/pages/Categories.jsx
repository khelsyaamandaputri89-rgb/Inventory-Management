import React, { useEffect, useState } from "react"
import Table from "../components/Table"
import FormModal from "../components/ModalForm"
import categoriesServices from "../services/categoriesServices"
import { FiArrowLeft } from "react-icons/fi"
import toast from "react-hot-toast"
import Swal from "sweetalert2"

const Categories = () => {
  const [category, setCategory] = useState([])
  const [search, setSearch] = useState("")
  const [isModalOpen, setModalOpen] = useState(false)
  const [isEditMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false)

  const fetchDataCategory = async () => {
    setLoading(true);
    try {
      const result = await categoriesServices.getCategories()
      console.log("[fetchDataCategory] response:", result)
      setCategory(Array.isArray(result.data) ? result.data : [])
    } catch (error) {
      console.error("[fetchDataCategory] error:", error)
      toast.error("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDataCategory()
  }, [])

  const handleAdd = () => {
    setFormData({ name: "", description: "" })
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
        if (!formData.id) throw new Error("Missing categories id for update")
        await categoriesServices.updatecategories(formData.id, formData)
        toast.success("Categories updated")
      } else {
        await categoriesServices.addCategories(formData)
        toast.success("Categories added")
      }
      setModalOpen(false)
      fetchDataCategory()
    } catch (error) {
      console.error("[handleSubmit] error:", error)
      toast.error("Failed to save categories")
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
      const result = await categoriesServices.deleteCategories(id)
      toast.success(result.data.message)
      fetchDataCategory()
    } catch (error) {
      console.error("[handleDelete] error:", error)
      toast.error("Failed to delete categories")
    }
  }

  const handleSearch = async (keyword) => {
    try {
      setSearch(keyword)
      if (keyword.trim() === "") {
        fetchDataCategory()
        return
      }
      const result = await categoriesServices.searchCategories(keyword)
      console.log("[handleSearch] response:", result)
      setCategory(Array.isArray(result.data) ? result.data : [])
    } catch (error) {
      console.error("[handleSearch] error:", error)
      toast.error("Search failed");
    }
  }

  return (
    <div className="p-6 pt-1">
      <div className="ml-64 px-2 py-1">
        <div 
          onClick={() => window.history.back()} 
          className="flex items-center text-red-800 cursor-pointer mb-2"
          >
          <FiArrowLeft className="mr-2" /> Back
        </div>
        <h1 className="text-2xl font-bold mb-5 mt-8">Categories</h1>
      </div>
      {loading && <p>Loading...</p>}

      <Table
        title="Catgories"
        columns={[
          { header: "ID", accessor: "id" },
          { header: "Name", accessor: "name" },
          { header: "Description", accessor: "description" },
        ]}
        data={category}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
      />

      <div >
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditMode ? "Edit Categories" : "Add Categories"}
        fields={[
          { name: "name", label: "Categories Name", placeholder: "Enter name" },
          { name: "description", label: "Descrition", placeholder: "Enter description" },
        ]}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
      </div>
    </div>
  )
}

export default Categories;