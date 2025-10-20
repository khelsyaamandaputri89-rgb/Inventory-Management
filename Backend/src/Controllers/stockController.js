const {Stock} = require("../Models")

const createStock = async (req, res) => {
    try {
        const {product_id, change_type, quantity} = req.body

        if (!product_id || !change_type || !quantity)
            return res.status(400).json({message : "Items must be filled in!"})

        const stock = await Stock.create({product_id, change_type, quantity})
        
        res.status(201).json({message : "Successfully added stock changes", data : stock})
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const getStock = async (req, res) => {
    try {
        const {product_id} = req.body

        const stocks = await Stock.findAll({
            where : {product_id},
            order : [["createdAt", "DESC"]]
    })

    res.json(stocks)
    
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const countStock = async (req, res) => {
    try {
        const {product_id} = req.body

    const stockIn = await Stock.sum("quantity", {
        where : {product_id, change_type : "IN"}
    })

    const stockOut = await Stock.sum("quantity", {
        where : {product_id, change_type : "OUT"}
    })

    const adjustment = await Stock.sum("quantity", {
        where : {product_id, change_type : "ADJUSTMENT"}
    }) 

    const totalStock = (stockIn || 0) - (stockOut || 0) + (adjustment || 0)

    res.json({product_id, totalStock})

    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

module.exports = {createStock, getStock, countStock}