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

function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Home />} />
          <Route path = "/login" element = {<Login />} />
          <Route path = "/signup" element = {<Register />} />
          <Route path = "/sidebar" element = {<Sidebar />} />
          <Route path = "/navbar" element = {<Navbar />} />
          <Route element = {<DashboardLayout />} >
            <Route path="/dashboard" element = {
              <ProtectedRoute allowedRoles = {["superadmin", "admin", "user"]}>
              <Dashboard />
              </ProtectedRoute>
              }/>
            <Route path="/products" element = {<Product />} />
            <Route path="/orders" element = {
              <ProtectedRoute allowedRoles = {["superadmin", "admin"]}>
              <Order />
              </ProtectedRoute>
              } />
            <Route path="/my-orders" element = {
              <ProtectedRoute allowedRoles = {["user"]}>
              <MyOrders />
              </ProtectedRoute>
              } />
            <Route path="/categories" element = {<Categories />} />
            <Route path="/stock" element = {<Stock />} />
            <Route path="/reports" element = {<Report />} />
            <Route path="/users" element = {<User />} />
          </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App
