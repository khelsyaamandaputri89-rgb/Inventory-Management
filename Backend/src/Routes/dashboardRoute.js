const express = require("express")
const router = express.Router()
const { dashboardAdmin, dashboardSuperadmin, dashboardUser } = require("../Controllers/dashboardController")
const authMiddleware = require("../Middleware/authMiddleware")
const checkRole = require("../Middleware/roleMiddleware")

router.get("/superadmin", authMiddleware, checkRole(["superadmin"]), dashboardSuperadmin)

router.get("/admin", authMiddleware, checkRole(["admin"]), dashboardAdmin)

router.get("/user", authMiddleware, checkRole(["user"]), dashboardUser)

module.exports = router