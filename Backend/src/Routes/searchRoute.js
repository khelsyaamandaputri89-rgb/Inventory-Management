const express = require("express")
const router = express.Router()
const {searchAll} = require("../Controllers/searchController")
const authMiddleware = require("../Middleware/authMiddleware")
const checkRole = require("../Middleware/roleMiddleware")

router.get("/", authMiddleware, checkRole(["user", "admin", "superadmin"]), searchAll)

module.exports = router