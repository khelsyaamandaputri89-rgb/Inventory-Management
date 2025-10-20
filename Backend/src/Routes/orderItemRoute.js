const express = require("express")
const router = express.Router()
const authMiddleware = require("../Middleware/authMiddleware")
const checkRole = require("../Middleware/roleMiddleware")
const {createOrderItem, getOrderItem, putOrderItem, deleteOrderItem} = require("../Controllers/orderItemController")

router.post("/", authMiddleware, checkRole(["admin", "superadmin"]), createOrderItem)

router.get("/",  authMiddleware, checkRole(["user", "admin", "superadmin"]), getOrderItem)

router.put("/:id",  authMiddleware, checkRole(["admin", "superadmin"]), putOrderItem)

router.delete("/:id",  authMiddleware, checkRole(["admin", "superadmin"]), deleteOrderItem)

module.exports = router