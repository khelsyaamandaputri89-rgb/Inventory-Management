import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import Table from "../components/Table"
import reportServices from "../services/reportServices"
import { FiDownload } from "react-icons/fi"
import Select from 'react-select'
import CardMetric from "../components/CardMetric"
import Chart from "../components/Chart"
import axios from "axios"

const Report = () => {
    const [report, setReport] = useState({ value: "product", label: "Product Report" })
    const [data, setData] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [chartData, setChartData] = useState([])
    const [summaryData, setSummaryData] = useState({
        totalSales : 0,
        totalStock : 0,
        totalSold : 0
    })

    const option = [
        { value: "product", label: "Product Report" },
        { value: "order", label: "Order Report" },
        { value: "stock", label: "Stock Report" },
    ]

    const fetchReport = async () => {
        try {
            setLoading(true)
            let result

            if (report.value === "product") result = await reportServices.getProductReport()
            if (report.value === "order") result = await reportServices.getOrderReport()
            if (report.value === "stock") result = await reportServices.getStockReport()

            const formattedData = result.data.map((item) => ({
                ...item,
                createdAt: new Date(item.createdAt).toLocaleString(),
                updatedAt: new Date(item.updatedAt).toLocaleString(),
            }))
            .reverse()

            setData(formattedData)
            console.log(result)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load report!")
        } finally {
            setLoading(false)
        }
    }

    const fetchSummary = async () => {
        try {
            const result = await reportServices.getSummary()
            setSummaryData(result.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load summary")
        }
    }

    const fetchStockSales = async () => {
        try {
            const result = await reportServices.getStockSales()
            setChartData(result.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load stock and sales")
        }
    }

    const handleExport = async (type) => {
        try {
            const token = localStorage.getItem("token")
            const url = `${import.meta.env.VITE_SERVICE_URL}/reports/${report.value}?exportType=${type}`

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: "blob" 
            })
            console.log(response)

                const fileType = type === "excel"
                    ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    : "application/pdf"

            const blob = new Blob([response.data], {type : fileType})
            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = downloadUrl
            link.download = `${report.value}_report.${type === "excel" ? "xlsx" : "pdf"}`
            document.body.appendChild(link)
            link.click()
            link.remove()

            toast.success(`Export ${type.toUpperCase()} successfully`)
        } catch (error) {
            console.error(error)
            toast.error("Export failed")
        }
    }


    const handleSearch = async (keyword) => {
        try {
            setSearch(keyword)

            if (keyword.trim() === "") {
                fetchReport()
                return
            }

            let result

            if (report.value === "product") {
                result = await reportServices.searchReportProduct(keyword)
            } else if (report.value === "order") {
                result = await reportServices.searchReportOrder(keyword)
            } else if (report.value === "stock") {
                result = await reportServices.searchReportStock(keyword)
            }

            if (result && result.data) {
                setData(result.data)
            }
        } catch (error) {
            console.error("Error saat search:", error)
            toast.error("Search failed")
        }
    }

    useEffect(() => {
        fetchReport()
        fetchSummary()
        fetchStockSales()
    }, [report])

    const columns = {
        product: [
            { header: "ID", accessor: "id" },
            { header: "Name", accessor: "name" },
            { header: "Price", accessor: "price" },
            { header: "Stock", accessor: "stock" },
            { header: "Category", accessor: "category" }
        ],
        order: [
            { header: "ID", accessor: "id" },
            { header: "User", accessor: "user" },
            { header: "Items", accessor: "items", render: (items) => Array.isArray(items) ? items.map(i => (typeof i === "string" ? i : i.name)).join(", ") : "-" } ,
            { header: "Category", accessor: "categories" },
            { header: "Quantity", accessor: "totalQty" },
            { header: "Total Price", accessor: "totalPrice" },
            { header: "Status", accessor: "status" },
            { header: "Date", accessor: "date"},
        ],
        stock: [
            { header: "ID", accessor: "id" },
            { header: "Product", accessor: "product" },
            { header: "Change Type", accessor: "change_type" },
            { header: "Quantity", accessor: "quantity" },
            { header: "Stock Akhir", accessor: "stock_akhir" },
            { header: "Created At", accessor: "createdAt" }
        ],
    }


    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold flex items-center ml-64 gap-2">
                Reports
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 ml-64">
                <CardMetric 
                    title="Total Sales"
                    value={`Rp ${(summaryData.totalSales || 0).toLocaleString()}`}
                    color="text-blue-600"
                    valueSize={summaryData.totalSales >= 10000000 ? "text-xl" : "text-2xl"}
                />
                <CardMetric
                    title="Total Stock"
                    value={summaryData.totalStock ?? 0}
                    color="text-red-400" 
                />
                <CardMetric 
                    title="Total Sold"
                    value={summaryData.totalSold ?? 0}
                    color="text-green-600" 
                />
            </div>

            <div className="grid grid-cols-1 gap-6 ml-64 mb-8">
                <Chart 
                data={chartData}
                title= "Stock & Sold"
                barName= "stock"
                name= "sold"
                time= "Last month"
                />
            </div>

            <div className="flex gap-4 items-center ml-64 mt-10 mb-10">
                <Select
                    options={option}
                    value={option.find(opt => opt.value === report.value)}
                    onChange={(selected) => setReport(selected)}
                    placeholder="Select report type"
                    menuPlacement="bottom"
                    menuPosition="fixed"
                    classNamePrefix="custom"
                    styles = {{
                        control : (provided) => ({
                            ...provided,
                            borderRadius: "0.5rem",
                            borderColor: "#d1d5db",
                            minWidth: "200px",
                            boxShadow: "none",
                            "&:hover": { borderColor: "#9ca3af" }
                        }),
                        menu : (provided) => ({
                            ...provided,
                            zIndex : 9999,
                            display : "flex",
                            flexDirection : "column",
                            background : "white",
                            padding : "0.5rem",
                            gap : "0.25rem",
                            boxShadow : "0 4px 6px rgba(0,0,0,0.1)",
                            width : "fit-content"
                        }),
                        option : (provided, state) => ({
                            ...provided,
                            backgroundColor : state.isFocused ? "rgba(128,0,0,0.1)" : "white",
                            color : "black",
                            minWidth : "150px",
                            whiteSpace : "nowrap",
                            cursor : "pointer"
                        })
                    }} 
                />

                <button
                    onClick={() => handleExport("excel")}
                    disabled={loading}
                    className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                    <FiDownload className="mr-2" /> Export Excel
                </button>

                <button
                    onClick={() => handleExport("pdf")}
                    disabled={loading}
                    className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                    <FiDownload className="mr-2" /> Export PDF
                </button>
            </div>

            <div className="mt-4">
                {loading ? <p>Loading...</p>
                 : 
                    <Table 
                        data={data} 
                        columns={columns[report.value]}
                        onSearch={handleSearch}  
                    />
                }
            </div>
        </div>
    )
}

export default Report
