import React, { useState } from "react"
import { RxDashboard } from "react-icons/rx"
import { BsBox2 } from "react-icons/bs"
import { FiLayers } from "react-icons/fi"
import { LuChartBar } from "react-icons/lu"
import { FiUsers } from "react-icons/fi"
import { FaList } from "react-icons/fa"
import { IoIosLogOut } from "react-icons/io"
import { NavLink, useNavigate } from "react-router-dom"
import { LuShoppingCart } from "react-icons/lu"
import { IoSearchOutline } from "react-icons/io5"
import authServices from "../services/authServices"
import Swal from "sweetalert2"
import toast from "react-hot-toast"
import searchServices from "../services/searchServices"
import productsServices from "../services/productsServices"

const Sidebar = () => {
  const data = JSON.parse(localStorage.getItem("user")) || {}
  const user = data
  const role = user.role || " "
  const username = user.username || "User"
  const [search, setSearch] = useState("")
  const [result, setResult] = useState({
    products: [],
    categories: [],
    orders: [],
    users: []
  })
  const navigate = useNavigate()

  const handleSearch = async (value) => {
    setSearch(value)
      if (value.trim() === "") {
            setResult({
              products: [],
              categories: [],
              orders: [],
              users: []
            })
            return
          } 
    try {
      let result 
      if (role === "user") {
        result = await productsServices.searchProduct()
        setResult({products : result.data})
      } else {
        result = await searchServices.searchAll()
        setResult(result.data)
      }
    } catch (error) {
      console.error("Search error:", error.response?.data || error)
      toast.error("Search failed")
    }
  }

  const handleSelect = (type) => {
    setSearch()
    setResult({
      products: [],
      categories: [],
      orders: [],
      users: []
    })
    switch (type) {
      case "products" :
        navigate("/products")
        break
      case "categories" : 
        navigate("/categories")
        break
      case "orders" : 
        navigate("/orders")
        break
      case "users" : 
        navigate(`/users/${item.id}`)
        break
      default :
        break
    }
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
                title: 'Are you sure you want to log out?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#b91c1c',
                cancelButtonColor: '#CBCBCB',
                confirmButtonText: 'Yes',
                background: '#fff',
            })
    if (result.isConfirmed) {
        try {
            toast.success("Logout succesfully")
            setTimeout(() => {
              authServices.logout()
            }, 1000)
        } catch (error) {
            toast.error("Failed to logout")
        }
    }
  } 

  return (
    <div className="fixed top-0 left-0 px-6 h-screen w-64 bg-white shadow-md flex flex-col border-r border-gray-200 z-50 rounded-br-3xl overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold text-red-800 py-5">
          <span
            className="text-outline"
            style={{ WebkitTextStroke: "1px maroon", color: "transparent" }}
          >
            K-smart
          </span>
          Inventory
        </h1>
      </div>

      <div className="relative px-4 mb-4">
        <IoSearchOutline className="absolute left-6 top-2.5 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-2 pl-9 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-red-900"
        />

        {search && (
          <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto z-50">
            {result.products?.length > 0 && (
              <div className="p-2 border-b border-gray-200">
                <p className="font-semibold text-sm">Products</p>
                {result.products.map((p) => (
                  <p 
                    key={p.id} 
                    onClick={() => handleSelect("products", p)}
                    className="text-sm hover:bg-gray-100 p-1 rounded cursor-pointer">
                    {p.name}
                  </p>
                ))}
              </div>
            )}

            {result.categories?.length > 0 && (
              <div className="p-2 border-b border-gray-200">
                <p className="font-semibold text-sm">Categories</p>
                {result.categories.map((c) => (
                  <p 
                    key={c.id} 
                    onClick={() => handleSelect("categories", c)}
                    className="text-sm hover:bg-gray-100 p-1 rounded cursor-pointer">
                    {c.name}
                  </p>
                ))}
              </div>
            )}

            {result.orders?.length > 0 && (
              <div className="p-2 border-b border-gray-200">
                <p className="font-semibold text-sm">Orders</p>
                {result.orders.map((o) => (
                  <p 
                    key={o.id} 
                    onClick={() => handleSelect("orders", o)}
                    className="text-sm hover:bg-gray-100 p-1 rounded cursor-pointer">
                    Order #{o.id} - {o.User?.username}
                  </p>
                ))}
              </div>
            )}

            {result.users?.length > 0 && (
              <div className="p-2">
                <p className="font-semibold text-sm">Users</p>
                {result.users.map((u) => (
                  <p 
                    key={u.id} 
                    onClick={() => handleSelect("users", u)}
                    className="text-sm hover:bg-gray-100 p-1 rounded cursor-pointer">
                    {u.username}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-3 px-6 mt-4 text-gray-700 text-center text-sm">
        <NavLink
          to="/dashboard"
          className= {({ isActive }) =>
          `flex items-center gap-3 p-2 rounded-lg transition ${
            isActive ? "bg-red-800 text-white" : "bg-white hover:text-[#cd2345]"
          }`
        }
        >
          <RxDashboard />
          Dashboard
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
          `flex items-center gap-3 p-2 rounded-lg transition ${
            isActive ? "bg-red-800 text-white" : "hover:text-[#cd2345]"
          }`
        }
        >
          <LuShoppingCart />
          Product
        </NavLink>
        {(role === "user") && (
        <NavLink
          to="/my-orders"
          className={({ isActive }) =>
          `flex items-center gap-3 p-2 rounded-lg transition ${
            isActive ? "bg-red-800 text-white" : "hover:text-[#cd2345]"
          }`
        }
        >
          <FaList />
          My Order
        </NavLink>
        )}
        {(role === "admin" || role === "superadmin") && (
        <NavLink
          to="/orders"
          className={({ isActive }) =>
          `flex items-center gap-3 p-2 rounded-lg transition ${
            isActive ? "bg-red-800 text-white" : "hover:text-[#cd2345]"
          }`
        }
        >
          <FaList />
          Order
        </NavLink>
        )}
        {(role === "admin" || role === "superadmin") && (
          <NavLink
            to="/categories"
            className={({ isActive }) =>
          `flex items-center gap-3 p-2 rounded-lg transition ${
            isActive ? "bg-red-800 text-white" : "hover:text-[#cd2345]"
          }`
        }
          >
            <FiLayers />
            Categories
          </NavLink>
        )}
        {(role === "admin" || role === "superadmin") && (
          <NavLink
            to="/stock"
            className={({ isActive }) =>
          `flex items-center gap-3 p-2 rounded-lg transition ${
            isActive ? "bg-red-800 text-white" : "hover:text-[#cd2345]"
          }`
        }
          >
            <BsBox2 />
            Stock
          </NavLink>
        )}
        {(role === "admin" || role === "superadmin") && (
          <NavLink
            to="/reports"
            className={({ isActive }) =>
          `flex items-center gap-3 p-2 rounded-lg transition ${
            isActive ? "bg-red-800 text-white" : "hover:text-[#cd2345]"
          }`
        }
          >
            <LuChartBar />
            Report
          </NavLink>
        )}
        {role === "superadmin" && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
          `flex items-center gap-3 p-2 rounded-lg transition ${
            isActive ? "bg-red-800 text-white" : "hover:text-[#cd2345]"
          }`
        }
          >
            <FiUsers />
            Management User
          </NavLink>
        )}
      </div>

      <div className="flex items-center justify-between p-4 border-t mt-auto">
        <div>
          <p className="text-sm font-semibold">{username}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
        <div className="px-20 ">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handleLogout()
            }}
            className="absolute right-7 py-4 bottom-3 text-gray-600 hover:text-red-800 transition"
          >
            <IoIosLogOut className="w-6 h-6 " />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar
