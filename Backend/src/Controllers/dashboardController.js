const { Product, Stock, User, OrderItem, Order } = require("../Models")
const {Op} = require("sequelize")

const dashboardAdmin = async (req, res) => {
    try {
        const start = new Date();
        start.setDate(start.getDate() - 30)
        const end = new Date()

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.error("Date invalid!", start, end);
            return res.status(400).json({ message: "Date invalid!" });
        }

        const products = await Product.findAll({
            attributes : ["id", "name", "stock", "price"]
        })

        const totalStock = await Stock.sum("stock_akhir")


        const stockData = await Stock.findAll({
            attributes : ["product_id", "stock_akhir"],
            order: [["createdAt", "DESC"]],
            group : ["product_id", "stock_akhir", "createdAt"]
        })

        const orderitems = await OrderItem.findAll({
            include : [
             {model : Product, attributes : ["id"]}
            ],
            attributes : ["product_id" , "quantity", "product_price", "createdAt"],
            where : { createdAt : {[Op.between] : [start, end]}}
        })

        console.log("OrderItems:", orderitems.map(i => ({
        product_id: i.product_id,
        qty: i.quantity,
        price: i.product_price
        })))
        console.log("Products:", products.map(p => ({ id: p.id, name: p.name })))


        const totalSales = orderitems.reduce((acc, item) => acc + item.quantity*item.product_price, 0)

        const chartData = products.map((product) => {

            const stockAwal = stockData.find((s) => s.product_id == product.id)
            const stockAkhir = stockAwal ? stockAwal.stock_akhir : 0

            const productSales = orderitems
                .filter((item) => item.product_id == product.id)
                .reduce((acc, item) => acc + item.quantity * item.product_price, 0)

            return {
                name : product.name,
                sales : productSales,
                purchase : 0,
                stock : stockAkhir
            }
        })

        res.status(200).json({
            sales : totalSales,
            purchase : 0,
            stock : totalStock,
            chart : chartData
        })


    } catch (error) {
        console.error(error)
        res.status(500).json({message : "Failed to load admin dashboard", error : error.message})
    }
}

const dashboardSuperadmin = async (req, res) => {
    try {
        const start = new Date(); 
        start.setDate(start.getDate() - 30)
        const end = new Date()
        console.log("Start:", start, "End:", end)

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.error("Tanggal invalid!", start, end);
            return res.status(400).json({ message: "Date invalid!" });
        }

        const products = await Product.findAll({
            attributes : ["id", "name", "stock", "price"]
        })

        const totalStock = await Stock.sum("stock_akhir")

        const totalUser = await User.count()

        const stockData = await Stock.findAll({
            attributes : ["product_id", "stock_akhir"],
            order: [["createdAt", "DESC"]],
            group : ["product_id", "stock_akhir", "createdAt"]
        })

        const orderitems = await OrderItem.findAll({
            include : [
             {model : Product, attributes : ["id"]}
            ],
            attributes : ["product_id" , "quantity", "product_price", "createdAt"],
            where : { createdAt : {[Op.between] : [start, end]}}
        })

        console.log("OrderItems:", orderitems.map(i => ({
        product_id: i.product_id,
        qty: i.quantity,
        price: i.product_price
        })))
        console.log("Products:", products.map(p => ({ id: p.id, name: p.name })))


        const totalSales = orderitems.reduce((acc, item) => acc + item.quantity*item.product_price, 0)

        const chartData = products.map((product) => {

            const stockAwal = stockData.find((s) => s.product_id == product.id)
            const stockAkhir = stockAwal ? stockAwal.stock_akhir : 0

            const productSales = orderitems
                .filter((item) => item.product_id == product.id)
                .reduce((acc, item) => acc + item.quantity * item.product_price, 0)

            return {
                name : product.name,
                sales : productSales,
                purchase : 0,
                stock : stockAkhir
            }
        })

        res.status(200).json({
            sales : totalSales,
            purchase : 0,
            stock : totalStock,
            user : totalUser,
            chart : chartData
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({message : "Failed to load superadmin dashboard", error : error.message})
    }
}

const dashboardUser = async (req, res) => {
    try {
        const userId = req.user.id

        const products = await Product.findAll({
            attributes : ["id", "name", "price", "stock"],
            order : ["createdAt"]
        })

        const orders = await OrderItem.findAll({
            include : [
                {model : Product, attributes : ["id","name", "price"]},
                {model : Order, attributes : ["id", "status"], where : {user_id : userId}}
            ],
            attributes: ["quantity", "createdAt"],
            order: [["createdAt", "DESC"]],
        })

        res.status(200).json({
            products, 
            orders
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({message : "Failed to load user dashboard", error : error.message})
    }
}

module.exports = { dashboardAdmin, dashboardSuperadmin, dashboardUser }