const {Product, Categories, Stock} = require("../Models")
const {Op} = require("sequelize")

const createProduct = async (req, res ) => {
    try {
        const {name, price, stock, category_id} = req.body
        const user = req.user
        
        if (!["admin", "superadmin"].includes(user.role)) {
            return res.status(403).json({ message: "Only admin/superadmin can add products" });
        }

        const category = await Categories.findByPk(category_id);
        if (!category) {
            return res.status(400).json({ message: "Categories not found" });
        }

        if (!stock || stock < 0) {
            return res.status(400).json({message : "Must enter the stock amount"})
        }

        const product = await Product.create({name, price, stock, user_id : req.user.id, category_id})

        if (stock && stock > 0) {
            await Stock.create({
                product_id : product.id,
                change_type : "IN",
                quantity : stock,
                stock_akhir : stock
            })
        }
        res.status(201).json({message : "Product added succesfully", product})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

const getProduct = async (req, res) => {
    try{
        const {category} = req.params
        const where = {}

        if (category) {
            where["$category.name$"] = category
        }

        const products = await Product.findAll({
            include : [
                {
                    model : Categories, 
                    attributes : ["id", "name"]}],
                    where })

        res.json(products)

    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const putProduct = async (req, res) => {
    try {
        const {name, price, stock} = req.body
        const {id} = req.params

        const update = await Product.update({name, price, stock} , {where : {id}})

        if (!update) {
            return res.status(404).json({message : "Product not found"})
        }

        if (!stock || stock < 0) {
            return res.status(400).json({message : "Must enter the stock amount!"})
        }

        const product = await Product.findByPk(id)

        if (stock && stock > 0) {
            await Stock.update({
                change_type : "IN",
                quantity : stock,
                stock_akhir : stock,
            }, {
                where : {product_id : product.id}
                }
            )
        }

        res.json({message : "Product updated succesfully", product})

    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params

        const products = await Product.findByPk(id)

        if (!products) {
            res.status(404).json({message : "Product not found"})
        }
  
        await products.destroy()
        
        res.json({message : "Product deleted succesfully"})

    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const searchProduct = async (req, res) => {
    try {
        const {search} = req.query
        let products

        if (search) {
            products = await Product.findAll({
                where : {
                    name : {
                    [Op.like] : `${search}%`
                    }
                }
            })
        } else {
            products = await Product.findAll()
        }

        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

module.exports = {createProduct, getProduct, putProduct, deleteProduct, searchProduct}