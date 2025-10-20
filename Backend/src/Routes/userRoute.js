const express = require("express")
const router = express.Router()
const authMiddleware = require("../Middleware/authMiddleware")
const checkRole = require("../Middleware/roleMiddleware")
const {createUser, getUser, putUser, deleteUser} = require("../Controllers/userController")

router.post("/", authMiddleware, checkRole(["superadmin"]), createUser)

router.get("/", authMiddleware, checkRole(["admin", "superadmin"]), getUser)

router.put("/:id", authMiddleware, checkRole(["superadmin"]), putUser)

router.delete("/:id", authMiddleware, checkRole(["superadmin"]), deleteUser)

module.exports = router
