const express = require("express")
const router = express.Router()
const authMiddleware = require("../Middleware/authMiddleware")
const checkRole = require ("../Middleware/roleMiddleware")
const {
    getProductReport, 
    getOrderReport, 
    getStockReport, 
    getSummary, 
    getStockSales, 
    searchReportProduct,
    searchReportOrder,
    searchReportStock
} = require("../Controllers/reportController")

router.get("/product", authMiddleware, checkRole(["admin", "superadmin"]), getProductReport)

router.get("/order", authMiddleware, checkRole(["admin", "superadmin"]), getOrderReport)

router.get("/stock", authMiddleware, checkRole(["admin", "superadmin"]), getStockReport)

router.get("/summary", authMiddleware, checkRole(["admin", "superadmin"]), getSummary)

router.get("/stock-sales", authMiddleware, checkRole(["admin", "superadmin"]), getStockSales)

router.get("/products/search", authMiddleware, checkRole(["admin", "superadmin"]), searchReportProduct)

router.get("/orders/search", authMiddleware, checkRole(["admin", "superadmin"]), searchReportOrder)

router.get("/stocks/search", authMiddleware, checkRole(["admin", "superadmin"]), searchReportStock)

module.exports = router