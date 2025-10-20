const express = require("express")
const router = express.Router()
const authMiddleware = require("../Middleware/authMiddleware")
const checkRole = require("../Middleware/roleMiddleware")
const {createProduct, getProduct, putProduct, deleteProduct, searchProduct} = require("../Controllers/productController")

router.post("/",  authMiddleware, checkRole(["admin", "superadmin"]), createProduct)

router.get("/search", authMiddleware,checkRole(["user", "admin", "superadmin"]), searchProduct)

router.get("/",  authMiddleware, checkRole(["user", "admin", "superadmin"]), getProduct)

router.put("/:id",  authMiddleware, checkRole(["admin", "superadmin"]), putProduct)

router.delete("/:id", authMiddleware, checkRole(["admin", "superadmin"]), deleteProduct)


module.exports = router