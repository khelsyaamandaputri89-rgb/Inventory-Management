import React, { useEffect, useState } from "react"
import Table from "../components/Table"
import FormModal from "../components/ModalForm"
import categoriesServices from "../services/categoriesServices"
import { FiArrowLeft } from "react-icons/fi"

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
      alert("Failed fetch categories")
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
        if (!formData.id) throw new Error("Missing product id for update")
        await categoriesServices.updatecategories(formData.id, formData)
        alert("Categories updated")
      } else {
        await categoriesServices.addCategories(formData)
        alert("Categories added")
      }
      setModalOpen(false)
      fetchDataCategory()
    } catch (error) {
      console.error("[handleSubmit] error:", error)
      alert("Failed to save categories")
    }
  }

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Delete this product?")) return
      await categoriesServices.deleteCategories(id)
      alert("Categories deleted")
      fetchDataCategory()
    } catch (error) {
      console.error("[handleDelete] error:", error)
      alert("Failed to delete categories")
    }
  }

  const handleSearch = async (keyword) => {
    try {
      setSearch(keyword)
      if (keyword.trim() === "") {
        fetchDataCategory()
        return
      }
      console.log("[handleSearch] calling searchProduct with:", keyword)
      const result = await categoriesServices.searchCategories(keyword)
      console.log("[handleSearch] response:", result)
      setCategory(Array.isArray(result.data) ? result.data : [])
    } catch (error) {
      console.error("[handleSearch] error:", error)
      alert("Search failed");
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
  );
};

export default Categories;