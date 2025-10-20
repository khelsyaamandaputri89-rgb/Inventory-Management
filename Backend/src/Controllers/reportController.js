const {Op, fn, col, literal} = require("sequelize")
const {Product, Sequelize} = require("../Models")
const {OrderItem} = require("../Models")
const {User} = require("../Models")

const salesReport = async (req, res) => {
    try {
        const {startDate, endDate} = req.query

        const sales = await OrderItem.findAll({
           include : [
             {model : Product, attributes : ["name"]}
           ],
           attributes : [
            "product_id",
            [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalSold"],
            [Sequelize.literal('SUM("quantity"*"price")'), "totalRevenue"]
           ],
           where : {createdAt : {[Op.between] : [startDate, endDate]}},
           group : ["product_id", "Product.id"]
        })

        res.json(sales)

    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const purchaseReport = async (req, res) => {
    try {
        const {startDate, endDate} = req.query

        const purchase = await Product.findAll({
            include : [
                {model : User, attributes : ["username"]}
            ],
            attributes : [
            "id", 
            [fn("SUM", col("price")), "totalPurchase"]
            ],
            where : {createdAt : {[Op.between] : [startDate, endDate]}},
            group : ["Product.id", "User.id"]
        })

        res.json(purchase)

    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

module.exports = {salesReport, purchaseReport}