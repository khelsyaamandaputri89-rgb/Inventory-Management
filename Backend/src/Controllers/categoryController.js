const {Categories, Product} = require("../Models")
const { Op } = require("sequelize")

const createCategory = async (req, res) => {
    try {
        const {name, description} = req.body

        const category = await Categories.create({name, description})

        res.status(201).json(category)
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const getCategory = async (req, res) => {
    try {
        const {name} = req.query
        const where = {}

        if (name) {
            where.name = { [Op.iLike]: `%${name}%` }
        }

        const categories = await Categories.findAll({where, include : [{model : Product}]})

        res.json(categories)
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const putCategory = async (req, res) => {
    try {
        const {name, description} = req.body
        const {id} = req.params

        const category = await Categories.findByPk(id)

        if(!category) {
            return res.status(404).json({message : "Categories not found"})
        }

        category.name = name
        category.description = description
        category.save()

        res.json({message : "Categories updated succesfully", category})

    } catch (error) {
        res.status(404).json({error : error.message})
    }
}

const deleteCategory = async (req, res) => {
    try {
        const {id} = req.params

        const categories = await Categories.findByPk(id)

        if (!categories) {
            return res.status(404).json({message : "Categories not found"})
        }

        await categories.destroy()
        
        res.json({message : "Categories deleted succesfully"})

    } catch (error) {
        res.status(404).json({error : error.message})
    }
}

const searchCategory = async (req, res) => {
  try {
    const { search } = req.query
    let categories

    if (search) {
      categories = await Categories.findAll({
        where: { name: { [Op.iLike]: `%${search}%` } },
      });
    } else {
      categories = await Categories.findAll()
    }

    res.status(200).json(categories)
  } catch (error) {
    console.error("[searchCategory] error:", error)
    res.status(500).json({ error: error.message })
  }
}

module.exports = {createCategory, getCategory, putCategory, deleteCategory, searchCategory}