import React, { useEffect, useState } from "react"
import stockServices from "../services/stockServices"
import productsServices from "../services/productsServices"
import Table from "../components/Table"
import FormModal from "../components/ModalForm"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import { FiArrowLeft } from "react-icons/fi"

const Stock = () => {
    const [stock, setStock] = useState([])
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState("")
    const [isModalOpen, setModalOpen] = useState(false)
    const [formData, setFormData] = useState({product_id: "", change_type: "", quantity: 0})
    const [loading, setLoading] = useState(false)

    const role = localStorage.getItem("role")

    const fetchDataStock = async () => {
        setLoading(true);
        try {
            const result = await stockServices.getStock();
            const mapped = result.data.map(s => ({
                ...s,
                product: s.Product?.name || `ID-${s.product_id}`,
                createdAt: new Date(s.createdAt).toLocaleString(),
            }));

            const latestStockPerProduct = Object.values(
                mapped.reduce((acc, curr) => {
                    if (!acc[curr.product] || new Date(curr.createdAt) > new Date(acc[curr.product].createdAt)) {
                    acc[curr.product] = curr;
                    }
                    return acc;
                }, {})
            )
            setStock(latestStockPerProduct)     
        } catch (error) {
            console.error("[fetchDataStock] error:", error)
            toast.error("Failed to load stock")
        } finally {
            setLoading(false)
        }
    }

    const fetchDataProducts = async () => {
        try {
            const result = await productsServices.getProduct()
            setProducts(result.data)
        } catch (error) {
            console.error("[fetchDataProduct] error : ", error)
        }
    }

    useEffect(() => {
        fetchDataStock(),
        fetchDataProducts()
    }, [])

    const handleSubmit = async () => {
        try {
            if (!formData.product_id || !formData.change_type || !formData.quantity) {
                toast.error("All fields must be filled")
                return
            }
            await stockServices.addStock(formData)
            toast.success("Stocks succesfully updated")
            setModalOpen(false)
            fetchDataStock()
        } catch (error) {
            console.error("[handleSubmit] error  :", error)
            toast.error("Failed to add stock")
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
            const result = await stockServices.deleteStock(id)
            toast.success(result.data.message)
            fetchDataStock()
        } catch (error) {
            console.error("[handleDelete] error:", error)
            toast.error("Failed to delete stock")
        }
    }

    const handleAdd = async () => {
        setFormData({product_id: "", change_type: "", quantity: 0}),
        setModalOpen(true)
    }

    const handleSearch = async (keyword)=> {
        try {
            setSearch(keyword)
            if (keyword.trim() === "") {
                fetchDataStock()
                return
            }
            const filtered = stock.filter((item) =>
                item.Product?.name.toLowerCase().includes(keyword.toLowerCase())
                )
            console.log(stock)
            console.log(stock.map(item => item.Product?.name))
            setStock(filtered);
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
                <h1 className="text-2xl font-bold mb-5 mt-8">Stocks</h1>
            </div>
            {loading && <p>Loading...</p>}

            <Table
                title="Stocks"
                columns={[
                    { header: "ID", accessor: "id" },
                    { header: "Product", accessor: "product" },
                    { header: "Change Type", accessor: "change_type" },
                    { header: "Quantity", accessor: "quantity" },
                    { header: "Stock Akhir", accessor: "stock_akhir" },
                    { header: "Created At", accessor: "createdAt" }
                ]}
                data={stock}
                onAdd={role !== "user" ? handleAdd : undefined}
                onDelete={role !== "user" ? handleDelete :undefined}
                onSearch={handleSearch}
            />

            <div >
            <FormModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title={"Add Stock Change"}
                fields={[
                    {
                        name : "product_id",
                        label : "Product",
                        type : "select",
                        options : products.map((p) => ({ value: p.id, label: p.name }))
                    }, 
                    {
                        name : "change_type", 
                        label : "Change Type",
                        type : "select",
                        options : [
                            { value: "IN", label: "IN" },
                            { value: "OUT", label: "OUT" },
                            { value: "ADJUSTMENT", label: "ADJUSTMENT" }
                        ]
                    },
                    { name : "quantity", label : "Quantity", type : "number"}
                ]}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
            />
        </div>
    </div>
  )
}

export default Stock