const express = require("express")
const router = express.Router()
const authMiddleware = require("../Middleware/authMiddleware")
const checkRole = require("../Middleware/roleMiddleware")
const {createStock, getStock, deleteStock, searchStock, countStock} = require("../Controllers/stockController")

router.post("/", authMiddleware, checkRole(["admin", "superadmin"]), createStock)

router.get("/", authMiddleware, checkRole(["admin", "superadmin"]), getStock)

router.delete("/:id", authMiddleware, checkRole(["admin", "superadmin"]), deleteStock)

router.get("/search", authMiddleware, checkRole(["admin", "superadmin"]), searchStock)

router.get("/current", authMiddleware, checkRole(["admin", "superadmin"]), countStock)

module.exports = router