import React, { useEffect, useState } from "react"
import Table from "../components/Table"
import FormModal from "../components/ModalForm"
import productsServices from "../services/productsServices"
import orderServices from "../services/orderServices"
import categoriesServices from "../services/categoriesServices"
import { FiArrowLeft } from "react-icons/fi"

const Product = () => {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [isModalOpen, setModalOpen] = useState(false)
  const [isEditMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ name: "", price: 0, stock: 0 });
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])

  const data = JSON.parse(localStorage.getItem("user"))
  const user = data
  const role = user.role || ""

  const fetchDataProducts = async () => {
    setLoading(true);
    try {
      const result = await productsServices.getProduct()
      console.log("[fetchDataProducts] response:", result)
      setProducts(result.data.map(p => ({
        ...p,
        category: p.Category?.name || "No category"
      })))
    } catch (error) {
      console.error("[fetchDataProducts] error:", error)
      alert("Failed fetch products — cek console/network")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const result = await categoriesServices.getCategories()
      setCategories(result.data)
    } catch (error) {
      console.error("Failed to fetch categories", error)
    }
  }

  useEffect(() => {
    fetchDataProducts()
    fetchCategories()
  }, [])

  const handleAdd = () => {
    setFormData({ name: "", price: 0, stock: 0 })
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
      if (!formData.category_id) {
        return alert("Kategori harus dipilih");
      }
      if (isEditMode) {
        if (!formData.id) throw new Error("Missing product id for update")
        await productsServices.updateProduct(formData.id, formData)
        alert("Product updated")
      } else {
        await productsServices.addProduct(formData)
        alert("Product added")
      }
      setModalOpen(false)
      fetchDataProducts()
    } catch (error) {
      console.error("[handleSubmit] error:", error)
      alert("Failed to save product")
    }
  }

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Delete this product?")) return
      await productsServices.deleteProduct(id)
      alert("Product deleted")
      fetchDataProducts()
    } catch (error) {
      console.error("[handleDelete] error:", error)
      alert("Failed to delete product")
    }
  }

  const handleSearch = async (keyword) => {
    try {
      setSearch(keyword)
      if (keyword.trim() === "") {
        fetchDataProducts()
        return
      }
      console.log("[handleSearch] calling searchProduct with:", keyword)
      const res = await productsServices.searchProduct(keyword)
      console.log("[handleSearch] response:", res)
      setProducts(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error("[handleSearch] error:", error)
      alert("Search failed — cek console");
    }
  }

  const handleOrder = async (product) => {
    try {
        const quantity = parseInt(prompt(`Enter the order quantity for ${product.name}:`), 10);
        if (!quantity || quantity <= 0) return alert("Invalid amount")

            const payload = {
                items: [
                    {
                        product_id: product.id,
                        product_price: product.price,
                        quantity,
                    }
                ]
            }

        const result = await orderServices.createOrder(payload)
        alert("Order was successfully placed")
        console.log("Orders response :", result)
    } catch (error) {
        console.error("[handleOrder], error :", error)
        alert("Failed to load order!")
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
        <h1 className="text-2xl font-bold mb-5 mt-8">Products</h1>
      </div>
      {loading && <p>Loading...</p>}

      <Table
        title="Products"
        columns={[
          { header: "ID", accessor: "id" },
          { header: "Name", accessor: "name" },
          { header: "Price", accessor: "price" },
          { header: "Stock", accessor: "stock" },
          { header: "Category", accessor: "category", 
            type: "select",
            options: categories.map(cat => ({ value: cat.id, label: cat.name }))
          }
        ]}
        data={products}
        onAdd={role !== "user" ? handleAdd : undefined}
        onEdit={role !== "user" ? handleEdit : undefined}
        onDelete={role !== "user" ? handleDelete :undefined}
        onSearch={handleSearch}
        onOrder={role === "user" ? handleOrder : undefined}
        isUser={role === "user"}
      />

      <div >
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditMode ? "Edit Product" : "Add Product"}
        fields={[
          { name: "name", label: "Product Name", placeholder: "Enter name" },
          { name: "price", label: "Price", type: "number" },
          { name: "stock", label: "Stock", type: "number" },
          {
            name: "category_id",
            label: "Category",
            type: "select",
            options: categories.map(cat => ({ value: cat.id, label: cat.name }))
          }
        ]}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
      </div>
    </div>
  );
};

export default Product;