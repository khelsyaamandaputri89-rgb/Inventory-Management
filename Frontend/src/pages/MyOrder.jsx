import React, { useEffect, useState } from "react"
import orderServices from "../services/orderServices"
import Table from "../components/Table"
import { FiArrowLeft } from "react-icons/fi"
import toast from "react-hot-toast"

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  const fetchOrders = async () => {
    setLoading(true);
    try {
        const result = await orderServices.getOrder()
        console.log("Orders to display:", orders)
        setOrders(result.data)
    } catch (err) {
        console.error("Error fetching my orders:", err)
        toast.error("Failed to load orders")
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [])

  const handleSearch = async (keyword) => {
      try {
        setSearch(keyword)
        if (keyword.trim() === "") {
          fetchOrders()
          return
        } 
          console.log("[handleSearch] calling orderProduct with:", keyword)
          const result = await orderServices.searchOrder(keyword)
          console.log("[handleSearch] response:", result)
          setOrders(result.data)
        } catch (error) {
          console.error("[handleSearch] error:", error)
          toast.error("Search failed")
      }
    }

  const columns = [
        { header: "Order ID", accessor: "id" },
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
        { header: "Date", accessor: "date" },
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
        <h1 className="text-2xl font-bold mb-7 mt-8">My Orders</h1>
      </div>
      {loading && <p>Loading...</p>}

        <Table 
        columns={columns}
        data={orders}
        onSearch={handleSearch}
        />

    </div>
  )
}

export default MyOrders;
