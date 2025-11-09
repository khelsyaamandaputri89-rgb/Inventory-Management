import React, { useEffect, useState } from "react"
import orderServices from "../services/orderServices"
import Table from "../components/Table"
import { FiArrowLeft } from "react-icons/fi"
import toast from "react-hot-toast"
import Swal from "sweetalert2"

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchDataOrder = async () => {
        setLoading(true);
        try {
            const result = await orderServices.getAllOrder()
            setOrders(result.data)
        } catch (error) {
            toast.error("Failed to load orders")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDataOrder();
    }, []);

    const handleDeleteOrder = async (id) => {
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

        if (result.isConfirmed) {
        try {
            const result = await orderServices.deleteOrder(id);
            toast.success(result.data.message)
            fetchDataOrder();
        } catch (error) {
            toast.error("Failed to delete order")
        }
      }
    }

    const handleSearch = async (keyword) => {
        try {
            setSearch(keyword)
                if (keyword.trim() === "") {
                    fetchDataOrder()
                    return
                } 
            const result = await orderServices.searchOrder(keyword)
            setOrders(result.data)
            console.log(result.data)
        } catch (error) {
            toast.error("Search failed")
        }
      }

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "User", accessor: "user" },
        { header: "Items", accessor: "items", render: (items) => Array.isArray(items) ? items.map(i => (typeof i === "string" ? i : i.name)).join(", ") : "-" },
        { header: "Category", accessor: "categories" },
        { header: "Quantity", accessor: "totalQty" },
        { header: "Total Price", accessor: "totalPrice", render: (price) => `Rp ${Number(price  ).toLocaleString("id-ID")}` },
        { header: "Status", accessor: "status",
            render: (status) => (
              <span
                className={`${
                  status === "Completed"
                    ? "text-green-600"
                    : status === "Pending"
                    ? "text-red-700"
                    : "text-yellow-500"
                } font-medium`}
              >
                {status}
              </span>
            )
         },
        { header: "Date", accessor: "date"},
    ]


    return (
        <div className="p-6 pt-1">
        <div className="ml-64 px-2 py-1">
            <div 
                onClick={() => window.history.back()} 
                className="flex items-center text-red-800 cursor-pointer mb-2"
                >
                <FiArrowLeft className="mr-2" /> Back
            </div>
            <h1 className="text-2xl font-bold mb-4 mt-8">Orders</h1>
        </div>
        {loading && <p>Loading...</p>}

            <Table
            columns={columns}
            data={orders}
            onDelete={handleDeleteOrder}
            onSearch={handleSearch}
            />
        </div>
    )
}

export default Order