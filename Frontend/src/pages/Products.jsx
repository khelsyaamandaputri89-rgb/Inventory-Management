import React, { useEffect, useState } from "react"
import Table from "../components/Table"
import FormModal from "../components/ModalForm"
import productsServices from "../services/productsServices"
import orderServices from "../services/orderServices"
import categoriesServices from "../services/categoriesServices"
import { FiArrowLeft } from "react-icons/fi"
import toast from "react-hot-toast"
import Swal from "sweetalert2"

const Product = () => {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [isModalOpen, setModalOpen] = useState(false)
  const [isEditMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ name: "", price: 0, stock: 0 });
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [isModalOpenOrder, setModalOpenOrder] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [orderQuantity, setOrderQuantity] = useState(1)

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
        toast.error("Failed to load products")
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
        toast.error("Failed to load products")
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
        if (!formData.category_id) {
          return toast.error("Category must be selected");
        }
        if (isEditMode) {
          if (!formData.id) throw new Error("Missing product id for update")
          await productsServices.updateProduct(formData.id, formData)
          toast.success("Product updated")
        } else {
          await productsServices.addProduct(formData)
          toast.success("Product added")
        }
        setModalOpen(false)
        fetchDataProducts()
    } catch (error) {
        console.error("[handleSubmit] error:", error)
        toast.error("Failed to save product")
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
        const result = await productsServices.deleteProduct(id)
        toast.success(result.data.message)
        fetchDataProducts()
    } catch (error) {
        console.error("[handleDelete] error:", error)
        toast.error("Failed to delete product")
    }
  }

  const handleSearch = async (keyword) => {
    try {
        setSearch(keyword)
        if (keyword.trim() === "") {
          fetchDataProducts()
          return
        }
        const res = await productsServices.searchProduct(keyword)
        setProducts(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
        toast.error("Search failed")
    }
  }

  const handleOrder = (product) => {
    setSelectedProduct(product)
    setModalOpenOrder(true)
    setOrderQuantity(1)
  }

  const submitOrder = async () => {
    try {
        if (!orderQuantity || orderQuantity <= 0) {
          return toast.error("Enter a valid amount!")
        }
        const payload = {
          items :[
            {
              product_id : selectedProduct.id,
              product_price : selectedProduct.price,
              quantity : parseInt(orderQuantity, 10)
            },
          ],
        }
        await orderServices.createOrder(payload)
        toast.success("Order succesfully")
        setModalOpenOrder(false)
    } catch (error) {
        console.error(error)
        toast.error("Failed to order")
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
            options: categories
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

      {isModalOpenOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                Order {selectedProduct?.name}
              </h3>
              <label className="block text-gray-700 font-medium mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                  onClick={() => setModalOpenOrder(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-800 text-white px-3 py-1 rounded"
                  onClick={submitOrder}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default Product;