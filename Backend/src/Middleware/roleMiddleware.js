function checkRole(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({message : "Akses anda di tolak, Role tidak sesuai!"})
       }
       next()
    }
}

module.exports = checkRole