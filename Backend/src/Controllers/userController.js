const {User, Order} = require("../Models")
const bcrypt = require("bcrypt")
const {Op} = require("sequelize")

const createUser = async (req, res) => {
    try {
        const {username, email, password, role} = req.body
        
        if (!username || !email || !password || !role) {
            return res.status(400).json({message : "All fields must be filled in!"})
        }

        const existingUsername = await User.findOne({where : {username}})

        if (existingUsername) {
            return res.status(400).json({message : "Username already registered"})
        }

        const existingUser = await User.findOne({where : {email}})

        if (existingUser) {
            return res.status(400).json({message : "Email already registered"})
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
        const users = await User.findAll({
            attributes : {exclude : ["password"]},
            include : [Order]
        })
                
        res.status(200).json(users)

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

        const user = await User.findByPk(id)

        if (!user) {
            return res.status(404).json({message : "User not found"})
        }

        await user.destroy()

        res.json({message : "User deleted succesfully"})

    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const searchUser = async (req, res) => {
    try {
        const { search } = req.query
            let users
        
            if (search) {
              users = await User.findAll({
                where: { username: { [Op.like]: `%${search}%` } },
              })
            } else {
              users = await User.findAll()
            }
        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

module.exports = {createUser, getUser, putUser, deleteUser, searchUser}