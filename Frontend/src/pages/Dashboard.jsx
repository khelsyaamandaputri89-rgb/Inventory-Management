import React, { useState, useEffect } from 'react'
import dashboardServices from '../services/dashboardServices'
import CardMetric from '../components/CardMetric'
import Chart from '../components/Chart'

const Dashboard = () => {
    const [ dashboardData, setDashboardData ] = useState({
        sales: 0,
        totalCategories: 0,
        stock: 0,
        user: 0,
        totalProducts : 0,
        chart: [],
        orders : [],
        categoryChart : []
    })
    const data = JSON.parse(localStorage.getItem("user"))
    const user = data
    const username = user.username || "User"
    const role = user.role || ""

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                let result
                if (role === "superadmin") { 
                    result = await dashboardServices.getDashboardSuperadmin()
                }
                if (role === "admin") { 
                    result = await dashboardServices.getDashboardAdmin()
                }
                if (role === "user") { 
                    result = await dashboardServices.getDashboardUser()
                }

                if (result)
                console.log("Dashboard result:", result.data)
                setDashboardData(result.data)
            } catch (error) {
                console.error("Failed to load dashboard data", error)
            }
        }
        if (role) fetchDashboard()
    }, [role])

    const recentOrders = (dashboardData.orders || []).slice(0, 3)

    const productCount = {}

    dashboardData.orders?.forEach(order => {
        const productId = order.Product?.id
        const productName = order.Product?.name

        if (productId) {
            if (!productCount[productId]) {
                productCount[productId] = {name : productName, totalQty : 0}
            }
            productCount[productId].totalQty += order.quantity
        }
    })

    console.log("Orders:", dashboardData.orders)

    const favoritProduct = Object.values(productCount).sort((a, b) => b.totalQty -  a.totalQty) [0]

    const favoritProductName = favoritProduct ? favoritProduct.name : "Not "

    return (
        <div>
            <div className="ml-64 bg-white flex justify-between items-center px-8 py-4">
                <div>
                    <h2 className="text-xl font-semibold">Welcome Back, {username}</h2>
                </div>
            </div>
            
            {!dashboardData.chart || dashboardData.chart.length === 0 ? (
                <p>
                    loading...
                </p>
                ) : (
                    <>
                    {role === "superadmin" && (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 ml-64 bg-white justify-between px-8 py-4">
                                <CardMetric
                                    title="Total Sales"
                                    value={`Rp ${dashboardData.sales.toLocaleString()}`}
                                    color="text-blue-600"
                                    valueSize={dashboardData.sales >= 10000000 ? "text-xl" : "text-2xl"}
                                />
                                <CardMetric
                                    title="Total Categories"
                                    value={dashboardData.totalCategories}
                                    color="text-indigo-600"
                                />
                                <CardMetric
                                    title="Total Stock"
                                    value={dashboardData.stock}
                                    color="text-green-600"
                                />
                                <CardMetric
                                    title="Total Users"
                                    value={dashboardData.user}
                                    color="text-orange-500"
                                />
                            </div>
                            <div className='ml-64 bg-white justify-between flex flex-wrap items-center gap-8 px-8 py-4'>
                                <div className='w-full lg:w-[48%]'>
                                <Chart
                                    data={dashboardData.chart} 
                                    title= "Sales & Stock"
                                    time= "Last 30 days"
                                />
                                </div>
                                <div className='w-full lg:w-[48%]'>
                                <Chart 
                                    data={dashboardData.categoryChart} 
                                    title="Sales per Categories"
                                    time="All Categories"
                                />
                                </div>
                            </div>
                        </div>
                    )}

                    {role === "admin" && (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ml-64 bg-white justify-between px-8 py-4">
                                <CardMetric
                                    title="Total Sales"
                                    value={`Rp ${dashboardData.sales.toLocaleString()}`}
                                    color="text-blue-600"
                                    valueSize={dashboardData.sales >= 10000000 ? "text-xl" : "text-2xl"}
                                />
                                <CardMetric
                                    title="Total Categories"
                                    value={dashboardData.totalCategories}
                                    color="text-indigo-600"
                                />
                                <CardMetric
                                    title="Total Stock"
                                    value={dashboardData.stock}
                                    color="text-green-600"
                                />
                                <CardMetric
                                    title="Total Product"
                                    value={dashboardData.totalProducts}
                                    color="text-green-600"
                                />
                            </div>
                            <div className='ml-64 bg-white flex flex-wrap justify-between gap-8 mt-10 items-center px-8 py-4'>
                                <div className='w-full lg:w-[48%]'>
                                <Chart
                                    data={dashboardData.chart} 
                                    title= "Sales & Stock"
                                    time= "Last 30 days"
                                />
                                </div>
                                <div className='w-full lg:w-[48%]'>
                                <Chart 
                                    data={dashboardData.categoryChart} 
                                    title="Sales per Categories"
                                    time="All Categories"
                                />
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

                {role === "user" && (
                    <div className='ml-64 px-8 py-4'>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 bg-white justify-between items-center">
                            <CardMetric 
                                title="My Orders" 
                                value={dashboardData.orders?.length || 0} 
                                color="text-blue-600" 
                            />
                            <CardMetric 
                                title="My Total Spending" 
                                value={`Rp ${((dashboardData.orders || [])
                                    .reduce((sum, o) => sum + (o.Product?.price * o.quantity || 0), 0))
                                    .toLocaleString()} `}
                                color="text-green-600" 
                            />
                            <CardMetric
                                title="Favorite Product"
                                value={favoritProductName}
                                color="text-yellow-600"
                            />
                        </div>

                        <div className="bg-white shadow-md rounded-2xl grid justify-between items-center p-9 px-10">
                            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                            {recentOrders.length > 0 ? (
                                <table className="w-full text-sm text-gray-700 border-separate border-spacing-x-5 border-spacing-y-5">
                                <thead>
                                    <tr className="border-b text-left w-full">
                                        <th className="py-2 px-4">Product</th>
                                        <th className="py-2 px-10">Quantity</th>
                                        <th className="py-2 px-10">Total Price</th>
                                        <th className="py-2 px-10">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order, i) => (
                                        <tr key={i} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-4">{order.Product?.name}</td>
                                        <td className="py-2 px-10">{order.quantity}</td>
                                        <td className="py-2 px-10">
                                            Rp {(order.Product?.price * order.quantity).toLocaleString()}
                                        </td>
                                        <td className="py-2 px-10">
                                            <span
                                            className={`${
                                                order.Order?.status === "completed"
                                                ? "text-green-600"
                                                : order.Order?.status === "pending"
                                                ? "text-yellow-500"
                                                : "text-gray-500"
                                            } font-medium`}
                                            >
                                            {order.Order?.status || "-"}
                                            </span>
                                        </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            ) : (
                                <p className="text-gray-500">You have no recent orders yet.</p>
                            )}
                        </div>
                    </div>
                )}
        </div>
    )
}

export default Dashboard