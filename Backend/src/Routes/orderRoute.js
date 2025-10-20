const express = require("express")
const router = express.Router()
const authMiddleware = require("../Middleware/authMiddleware")
const checkRole = require("../Middleware/roleMiddleware")
const {createOrder, getOrder, deleteOrder, getAllOrder, searchOrders} = require("../Controllers/orderController")

router.post("/",  authMiddleware, checkRole(["admin", "superadmin"]), createOrder)

router.get("/", authMiddleware, checkRole(["admin", "superadmin"]), getAllOrder)

router.get("/my-orders", authMiddleware, checkRole(["user"]), getOrder)

router.post("/my", authMiddleware, checkRole(["user"]), createOrder)

router.get("/search", authMiddleware, checkRole(["user", "admin", "superadmin"]), searchOrders)

router.delete("/:id",  authMiddleware, checkRole(["user", "admin", "superadmin"]), deleteOrder)

module.exports = router