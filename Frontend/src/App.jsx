import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayouts'
import Product from './pages/Products'
import Order from './pages/Orders'
import Categories from './pages/Categories'
import Report from './pages/Reports'
import User from './pages/Users'
import Stock from './pages/Stocks'
import MyOrders from './pages/MyOrder'
import Password from './pages/Password'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
      <BrowserRouter>
        <Toaster 
                position='top-center'
                toastOptions={{
                  durations : 1000,
                  style : {
                    background : 'rgba(255,255,255, 0.8)',
                    backdropFilter : "blur(10px)",
                    borderRadius : "12px",
                    fontSize : "14px",
                    color : "#333"
                  }
              }}
          />
        <Routes>
          <Route path = "/" element = {<Home />} />
          <Route path = "/login" element = {<Login />} />
          <Route path = "/signup" element = {<Register />} />
          <Route path = "/sidebar" element = {<Sidebar />} />
          <Route path = "/navbar" element = {<Navbar />} />
          <Route element = {<DashboardLayout />} >
            <Route path = "/dashboard" element = {
              <ProtectedRoute allowedRoles = {["superadmin", "admin", "user"]}>
              <Dashboard />
              </ProtectedRoute>
            } />
            <Route path = "/products" element = {
              <ProtectedRoute allowedRoles = {["superadmin", "admin", "user"]}>
              <Product /> 
              </ProtectedRoute>
            } />
            <Route path = "/orders" element = {
              <ProtectedRoute allowedRoles = {["superadmin", "admin"]}>
              <Order />
              </ProtectedRoute>
            } />
            <Route path = "/my-orders" element = {
              <ProtectedRoute allowedRoles = {["user"]}>
              <MyOrders />
              </ProtectedRoute>
            } />
            <Route path = "/categories" element = {
              <ProtectedRoute allowedRoles = {["superadmin", "admin"]}>
              <Categories />
              </ProtectedRoute>
            } />
            <Route path = "/stock" element = {
              <ProtectedRoute allowedRoles = {["superadmin", "admin"]}>
              <Stock />
              </ProtectedRoute>
            } />
            <Route path = "/reports" element = {
              <ProtectedRoute allowedRoles = {["superadmin", "admin"]}>
              <Report />
              </ProtectedRoute>
            } />
            <Route path = "/users" element = {
              <ProtectedRoute allowedRoles = {["superadmin"]}>
              <User />
              </ProtectedRoute>
            } />
          </Route>
            <Route path = "/forgot-password" element = {<Password />} />
            <Route path = "/reset-password" element = {<Password />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
