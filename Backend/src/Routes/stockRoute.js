const express = require("express")
const router = express.Router()
const authMiddleware = require("../Middleware/authMiddleware")
const checkRole = require("../Middleware/roleMiddleware")
const {createStock, getStock, countStock} = require("../Controllers/stockController")

router.post("/", authMiddleware, checkRole(["admin", "superadmin"]), createStock)

router.get("/", authMiddleware, checkRole(["admin", "superadmin"]), getStock)

router.get("/current", authMiddleware, checkRole(["admin", "superadmin"]), countStock)

module.exports = router