const express = require("express")
const router = express.Router()
const authMiddleware = require("../Middleware/authMiddleware")
const checkRole = require ("../Middleware/roleMiddleware")
const {salesReport, purchaseReport} = require("../Controllers/reportController")

router.get("/sales", authMiddleware, checkRole(["admin", "superadmin"]), salesReport)

router.get("/purchase", authMiddleware, checkRole(["admin", "superadmin"]), purchaseReport)

module.exports = router