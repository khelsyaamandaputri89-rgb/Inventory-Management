import React, { useEffect, useState } from "react"
import orderServices from "../services/orderServices"
import Table from "../components/Table"
import { FiArrowLeft } from "react-icons/fi"

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchDataOrder = async () => {
        setLoading(true);
        try {
            const result = await orderServices.getAllOrder()
            setOrders(result.data)
            console.log("Fetched orders (raw):", result.data)
        } catch (error) {
        console.error("Failed to load orders", error)
        } finally {
        setLoading(false);
        }
    }

    useEffect(() => {
        fetchDataOrder();
    }, []);

    const handleDeleteOrder = async (id) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;

        try {
        const result = await orderServices.deleteOrder(id);
        alert(result.data.message);
        fetchDataOrder();
        } catch (error) {
        alert("Failed to delete order");
        }
    }

    const handleSearch = async (keyword) => {
        try {
          setSearch(keyword)
          if (keyword.trim() === "") {
            fetchDataOrder()
            return
          } 
          console.log("[handleSearch] calling orderProduct with:", keyword)
          const result = await orderServices.searchOrder(keyword)
          console.log("[handleSearch] response:", result)
          setOrders(result.data)
          console.log(result.data)
        } catch (error) {
          console.error("[handleSearch] error:", error)
          alert("Search failed")
        }
      }
    

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "User", accessor: "user" },
        { header: "Items", accessor: "items", render: (items) => Array.isArray(items) ? items.map(i => (typeof i === "string" ? i : i.name)).join(", ") : "-" },
        { header: "Category", accessor: "categories" },
        { header: "Quantity", accessor: "totalQty" },
        { header: "Total Price", accessor: "totalPrice", render: (price) => `Rp ${Number(price  ).toLocaleString("id-ID")}` },
        { header: "Status", accessor: "status" },
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