const {Stock, Product} = require("../Models")

const createStock = async (req, res) => {
    try {
        const {product_id, change_type, quantity} = req.body

        if (!product_id || !change_type || !quantity)
            return res.status(400).json({message : "Items must be filled in!"})

        const lastStock = await Stock.findOne({
            where: { product_id },
            order: [["createdAt", "DESC"]],
        }); 
        console.log("Last stock:", lastStock)

        let stock_awal = lastStock ? lastStock.stock_akhir : 0
        let qty = Number(quantity)
        let stock_akhir
        
        if (change_type === "IN") stock_akhir = stock_awal + qty
        else if (change_type === "OUT") stock_akhir = stock_awal - qty
        else if (change_type === "ADJUSTMENT") stock_akhir = qty

        const stock = await Stock.create({product_id, change_type, quantity, stock_awal, stock_akhir})
        console.log("[createStock] success:", stock.dataValues)
        
        res.status(201).json({message : "Successfully added stock changes", data : stock})
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const getStock = async (req, res) => {
    try {
        const {product_id} = req.query

        const condition = product_id ? { product_id } : {}

        const stocks = await Stock.findAll({
            where : condition,
            order : [["createdAt", "DESC"]],
            include: ["Product"],
    })

    res.json(stocks)
    
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const deleteStock = async (req, res) => {
    try {
        const {id} = req.params

        const stock = await Stock.findByPk(id)

        if (!stock) {
            res.status(404).json({message : "Stock not found"})
        }
  
        await stock.destroy()
        
        res.json({message : "Stock deleted succesfully"})
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const searchStock = async (req, res) => {
    try {
        const {search} = req.query
        const stock = await Stock.findAll({
            include: [{
                model: Product,
                as: "Product",
                where: search
                ? { name: { [Op.like]: `%${search}%` } }
                : undefined
            }],
            order: [["createdAt", "DESC"]],
            });
        
        res.status(200).json(stock)
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

module.exports = {createStock, getStock, deleteStock, searchStock, countStock}