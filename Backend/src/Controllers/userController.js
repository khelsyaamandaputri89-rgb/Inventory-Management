const {User, Order} = require("../Models")
const bcrypt = require("bcrypt")

const createUser = async (req, res) => {
    try {
        const {username, email, password, role} = req.body
        
        if (!username || !email || !password || !role) {
            return res.status(400).json({message : "All fields must be filled in!"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({username, email, password : hashedPassword, role})

        const {password : pwd, ...userWithoutPassword} = user.toJSON()

        res.status(201).json({message : "User added succesfully", user : userWithoutPassword})

    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const getUser = async (req, res) => {
    try {
        const users = await User.findAll({include : [{model : Order}]})

        res.status(201).json(users)

    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const putUser = async (req, res) => {
     try {
        const {username, email, password} = req.body
        const {id} = req.params

        const user = await User.findByPk(id)

        if (!user) {
            return res.status(404).json({message : "User not found"})
        }

        if (username) user.username = username
        if (email) user.email = email
        if (password) {user.password = await bcrypt.hash(password, 10)}
        await user.save()

        const {password : pwd, ...updateUser} = user.toJSON()
        
        res.json({message : "User updated succesfully", user : updateUser})
        
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const deleteUser = async (req, res) => {
    try {
        const {id} = req.params

        const users = await User.findByPk(id)

        if (!users) {
            return res.status(404).json({message : "User not found"})
        }

        await users.destroy()

        res.json({message : "User deleted succesfully"})

    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

module.exports = {createUser, getUser, putUser, deleteUser}