const { Product, Stock, User, OrderItem, Order, Categories } = require("../Models")
const {Op, Sequelize} = require("sequelize")

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
            attributes : ["id", "name", "stock", "price"],
            include : [
                {
                    model: Categories,
                    attributes: ["id", "name"],
                },
            ]
        })

        const allStocks = await Stock.findAll({
            attributes: ["product_id", "stock_akhir", "createdAt"],
            order: [["createdAt", "DESC"]],
            raw: true
        })

        const latestStocks = {}
        for (const s of allStocks) {
            if (!latestStocks[s.product_id]) {
                latestStocks[s.product_id] = s.stock_akhir
            }
        }

        const totalStock = Object.values(latestStocks).reduce((a, b) => a + (b || 0), 0)
        
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
                .filter((item) => item.product_id === product.id)
                .reduce((acc, item) => acc + item.quantity * item.product_price, 0)

            return {
                name : product.name,
                sales : productSales,
                category : product.Category ? product.Category.name : "Uncategorized",
                stock : stockAkhir
            }
        })

        const categorySales = {}

        chartData.forEach((item) => {
            if (!categorySales[item.category]) categorySales[item.category] = { sales: 0, stock: 0 };
            categorySales[item.category].sales += item.sales;
            categorySales[item.category].stock += item.stock;
        })

       const categoryChart = Object.keys(categorySales).map((key) => ({
            name: key,
            sales: categorySales[key].sales,
            stock: categorySales[key].stock,
        }))

        const totalCategories = await Categories.count()

        const totalProducts = await Product.count()

        res.status(200).json({
            sales : totalSales,
            totalCategories,
            stock : totalStock,
            totalProducts,
            chart : chartData,
            categoryChart
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
            attributes : ["id", "name", "stock", "price"],
            include : [
                {
                    model: Categories,
                    attributes: ["id", "name"],
                },
            ]
        })

        const allStocks = await Stock.findAll({
            attributes: ["product_id", "stock_akhir", "createdAt"],
            order: [["createdAt", "DESC"]],
            raw: true
        })

        const latestStocks = {}
        for (const s of allStocks) {
            if (!latestStocks[s.product_id]) {
                latestStocks[s.product_id] = s.stock_akhir
            }
        }

        const totalStock = Object.values(latestStocks).reduce((a, b) => a + (b || 0), 0)

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

        const categorySales = {}

        chartData.forEach((item) => {
            if (!categorySales[item.category]) categorySales[item.category] = { sales: 0, stock: 0 };
            categorySales[item.category].sales += item.sales;
            categorySales[item.category].stock += item.stock;
        })

       const categoryChart = Object.keys(categorySales).map((key) => ({
            name: key,
            sales: categorySales[key].sales,
            stock: categorySales[key].stock,
        }))

        const totalCategories = await Categories.count()

        res.status(200).json({
            sales : totalSales,
            purchase : 0,
            stock : totalStock,
            user : totalUser,
            totalCategories,
            chart : chartData,
            categoryChart
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