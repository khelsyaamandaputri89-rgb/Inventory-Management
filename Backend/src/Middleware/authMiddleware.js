const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SECRET_KEY

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({error : "Token tidak ditemukan"})
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY)
        req.user = {
            id : decoded.id,
            role : decoded.role,
            username : decoded.username
        }
        console.log("Akses berhasil, username :", req.user.username, "| Role :", req.user.role );
        next()
    } catch (error) {
        return res.status(403).json({message : "Token tidak valid"})
    }
}

module.exports = authMiddleware