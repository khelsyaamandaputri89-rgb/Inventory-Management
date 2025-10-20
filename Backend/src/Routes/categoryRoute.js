const express = require("express")
const router = express.Router()
const authMiddleware = require("../Middleware/authMiddleware")
const checkRole = require ("../Middleware/roleMiddleware")
const {createCategory, getCategory, putCategory, deleteCategory, searchCategory} = require("../Controllers/categoryController")


router.post("/",authMiddleware, checkRole(["admin", "superadmin"]), createCategory)

router.get("/", authMiddleware, checkRole(["user", "admin", "superadmin"]), getCategory)

router.get("/search", authMiddleware, checkRole(["admin", "superadmin"]), searchCategory)

router.put("/:id", authMiddleware, checkRole(["admin", "superadmin"]), putCategory)

router.delete("/:id", authMiddleware, checkRole(["admin", "superadmin"]), deleteCategory)

module.exports = router