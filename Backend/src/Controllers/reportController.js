const {User, Categories, Product, Order, OrderItem, Stock} = require("../Models")
const ExcelJs = require("exceljs")
const PDFDocument = require("pdfkit")
const {Op} = require("sequelize")

const exportProductExcel = async (data, res) => {
    const workbook = new ExcelJs.Workbook()
    const sheet = workbook.addWorksheet("Products")

    sheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Name", key: "name", width: 30 },
        { header: "Category ", key: "category", width: 15 },
        { header: "Price", key: "price", width: 15 },
        { header: "Stock", key: "stock", width: 10 }
    ]

    sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } } 
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF808080" },
    }
    cell.alignment = { vertical: "middle", horizontal: "center" }
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    }
  })

    data.forEach(items => sheet.addRow({
        id : items.id,
        name : items.name,
        price : items.price,
        stock : items.stock,
        category : items.category
    }))

    sheet.getColumn("price").numFmt = '"Rp"#, ##0.00; [red]-"Rp"#, ##0.00'

    sheet.eachRow((row, rowNumber) => {
        row.height = 20
        row.eachCell((cell) => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            }
        })
    })

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    res.setHeader("Content-Disposition", "attachment; filename=products.xlsx")

    await workbook.xlsx.write(res)
    res.end()
}

const exportProductPdf = async (data, res) => {
  const doc = new PDFDocument({ margin: 30, size: "A4" })

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", "attachment; filename=products.pdf")

  doc.pipe(res)

  doc.fontSize(18).font("Helvetica-Bold").text("Product Report", { align: "center" })
  doc.moveDown(1)

  const tableTop = 100
  const columnSpacing = 15
  const columnWidth = [50, 150, 100, 100, 70]

  const headers = ["ID", "Name", "Category", "Price (Rp)", "Stock"]

  doc.font("Helvetica-Bold").fontSize(12)
  let x = 50
  headers.forEach((header, i) => {
    doc.text(header, x, tableTop, { width: columnWidth[i], align: "left" });
    x += columnWidth[i] + columnSpacing;
  })

  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke()

  let y = tableTop + 25
  doc.font("Helvetica").fontSize(11)

  data.forEach((item) => {
    let x = 50
    const formattedPrice = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(item.price)

    const values = [
      item.id || "-",
      item.name || "-",
      item.category || "-",
      formattedPrice,
      item.stock?.toString() || "0",
    ]

    values.forEach((value, i) => {
      doc.text(value, x, y, { width: columnWidth[i], align: "left" });
      x += columnWidth[i] + columnSpacing;
    })

    y += 20;
    doc.moveTo(50, y - 5).lineTo(550, y - 5).strokeColor("#cccccc").stroke();
  })

  doc.end()
}

const getProductReport = async (req, res) => {
    try {
        const {category, exportType} = req.query
        const where = {}

        if (category) {
            where["$category.name$"] = category
        }

        const products = await Product.findAll({
            include : [
                {
                    model : Categories, 
                    attributes : ["id", "name"]}],
                    where 
                })

        const formattedProducts = products.map(product => ({
            id: product.id,
            name : product.name,
            stock : product.stock,
            category: product.Category?.name || "No category",
            price : product.price
        }))

        if (!exportType) return res.json(formattedProducts)

        if (exportType === "excel") {
            await exportProductExcel(formattedProducts, res)
            return
        }
        if (exportType === "pdf") {
            await exportProductPdf(formattedProducts, res)
            return
        }

        return res.json(formattedProducts)
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const exportOrderExcel = async (data, res) => {
    const workbook = new ExcelJs.Workbook()
    const sheet = workbook.addWorksheet("Orders")

    sheet.columns = [
        { header: "Order ID", key: "id", width: 10 },
        { header: "Name", key: "name", width: 30 },
        { header: "Date", key: "date", width: 15 },
        { header: "Total", key: "total", width: 15 },
        { header: "Status", key: "status", width: 10 }
    ]

    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } } 
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D3D3D3" },
            }
        cell.alignment = { vertical: "middle", horizontal: "center" }
    })

    data.forEach((order) => {
    sheet.addRow({
        id: order.id,
        name: order.user,
        date: new Date(order.date).toLocaleDateString("id-ID"),
        total: `Rp ${order.totalPrice.toLocaleString("id-ID")}`,
        status: order.status,
    })
})


    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx")

    await workbook.xlsx.write(res)
    res.end()
}

const exportOrderPDF = async (data, res) => {
  const doc = new PDFDocument({ margin: 30, size: "A4" })

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", "attachment; filename=orders.pdf")

  doc.pipe(res)
  doc.on("end", () => res.end())

  doc.fontSize(18).text("Order Report", { align: "center" })
  doc.moveDown(1)

  doc.fontSize(12)
  doc.text("ID", 50)
  doc.text("Customer", 100)
  doc.text("Date", 250)
  doc.text("Total", 350)
  doc.text("Status", 450)
  doc.moveDown(0.5)
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()

  data.forEach(order => {
    doc.text(order.id, 50)
    doc.text(order.user, 100)
    doc.text(order.date, 250)
    doc.text(`Rp ${order.totalPrice.toLocaleString("id-ID")}`, 350)
    doc.text(order.status, 450)
    doc.moveDown(0.3)
  })

  doc.end()
}


const getOrderReport = async (req, res) => {
    try {
        const {exportType} = req.query

        const start = new Date(); 
        start.setDate(start.getDate() - 30)
        const end = new Date()

        const orders = await Order.findAll({
            include: [
                { model: User, attributes: ["id", "username"] },
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product,
                            attributes: ["name", "price"],
                            include: [
                                { model: Categories, attributes: ["name"] } 
                            ]
                        }
                    ],
                    where: {
                        createdAt: { [Op.between]: [start, end] }, 
                    },
                }
            ],
            where : {status: "pending"},
            order: [["id", "ASC"]]
        })

        const formattedOrders = orders.map(order => ({
            id: order.id,
            user: order.User?.username || "Unknown",
            status: order.status,
            items: order.OrderItems.map(i => i.Product.name),
            categories: order.OrderItems.map(i => i.Product.Category?.name || "No category").join(", "),
            totalQty: order.OrderItems.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: order.OrderItems.reduce((sum, i) => sum + i.quantity * i.product_price, 0),
            date: order.createdAt
        }))

        if (!exportType) {
            return res.json(formattedOrders)
        }

        if (exportType === "excel") {
            await exportOrderExcel(formattedOrders, res)
            return
        }
        if (exportType === "pdf") {
            await exportOrderPDF(formattedOrders, res)
            return
        }

        return res.json(formattedOrders)
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const exportStockExcel = async (data, res) => {
    const workbook = new ExcelJs.Workbook()
    const sheet = workbook.addWorksheet("Products")
    
    sheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Product Name", key: "product_name", width: 30 },
        { header: "Change Type", key: "change_type", width: 15 },
        { header: "Quantity", key: "quantity", width: 15 },
        { header: "Stock Akhir", key: "stock_akhir", width: 15},
        { header: "Date", key: "createdAt", width: 10 }
    ]

    sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } } 
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D3D3D3" },
            }
        cell.alignment = { vertical: "middle", horizontal: "center" }
    })

    data.forEach((items) => {sheet.addRow(items)})

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    res.setHeader("Content-Disposition", "attachment; filename=stocks.xlsx")

    await workbook.xlsx.write(res)
    res.end()
}

const exportStockPDF = async (data, res) => {
    const doc = new PDFDocument({margin : 30, size : "A4"})

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", "attachment; filename=stocks.pdf")

    doc.pipe(res)

    doc.fontSize(18).text("Stock report", {
        align : "center"
    })
    doc.moveDown(1)

    doc.fontSize(12).text("ID", 50)
    doc.text("Product", 100)
    doc.text("Change Type", 250)
    doc.text("Quantity", 350)
    doc.text("Date", 450)
    doc.moveDown(0.5)
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()

     data.forEach((stock) => {
        doc.text(stock.id, 50)
        doc.text(stock.product_name, 100)
        doc.text(stock.change_type, 250)
        doc.text(stock.quantity, 350)
        doc.text(stock.createdAt, 450)
        doc.moveDown(0.3)
    })

    doc.end()
}

const getStockReport = async (req, res) => {
    try {
        const {exportType} = req.query

        const stockData = await Stock.findAll({
            include : [{
                model : Product,
                attributes : ["name"]
            }],
            order : [["createdAt", "DESC"]] 
        })

        const formatted = stockData.map((items) => ({
            id : items.id,
            product_name : items.Product?.name || "-",
            change_type : items.change_type,
            quantity : items.quantity,
            stock_akhir : items.stock_akhir,
            createdAt : items.createdAt.toLocaleDateString("id-ID")
        }))

        if(!exportType) {
            return res.json(formatted)
        }

        if (exportType === "excel") {
            await exportStockExcel(formatted, res)
            return
        }
        if (exportType === "pdf") {
            await exportStockPDF(formatted, res)
            return
        }

        return res.json(formatted)
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const getSummary = async (req, res) => {
    try {
        const start = new Date(); 
        start.setDate(start.getDate() - 30)
        const end = new Date()

        const orderItems = await OrderItem.findAll({
            include: [{ model: Order, where: { status: "pending" } }],
            where: { createdAt: { [Op.between]: [start, end] } },
            attributes: ["quantity", "product_price"]
        })

        const totalSales = orderItems.reduce((sum, item) => sum + (item.quantity * item.product_price), 0)

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

        const totalSold = await OrderItem.sum("quantity")

        res.json({
            totalSales,
            totalStock,
            totalSold
        })
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const getStockSales = async (req, res) => {
    try {
        const start = new Date();
        start.setDate(start.getDate() - 30)
        const end = new Date()

        const products = await Product.findAll({
            attributes : ["id", "name"],
            raw : true
        })

        const stockData = await Stock.findAll({
            attributes : ["product_id", "stock_akhir", "createdAt"],
            order: [["createdAt", "DESC"]],
            raw : true
        })

        const latestStocks = {}
        for (const s of stockData) {
            if (!latestStocks[s.product_id]) {
                latestStocks[s.product_id] = s.stock_akhir
            }
        }

        const orderitems = await OrderItem.findAll({
            attributes : ["product_id" , "quantity", "product_price", "createdAt"],
            where : { createdAt : {[Op.between] : [start, end]}},
            raw : true
        })

         const chartData = products.map((product) => {

            const stockAkhir = latestStocks[product.id] || 0

            const productSales = orderitems
                .filter((item) => item.product_id == product.id)
                .reduce((acc, item) => acc + item.quantity, 0)

            return {
                name : product.name,
                sales : productSales,
                stock : stockAkhir
            }
        })
       
        res.json(chartData)
    } catch (error) {
        console.error(error)
        res.status(500).json({error : error.message})
    }
}

const searchReportProduct = async (req, res) => {
  try {
    const { search } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
      ]
    }

    const products = await Product.findAll({
      include: [
        {
          model: Categories,
          attributes: ["id", "name"],
        },
      ],
      where,
    })

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      stock: product.stock,
      category: product.Category?.name || "No category",
      price: product.price,
    }))

    res.json(formattedProducts)
    console.log("Search query:", req.query)
  } catch (error) {
    console.error("Error saat search report product:", error)
    res.status(500).json({ error: error.message })
  }
}


const searchReportOrder = async (req, res) => {
  try {
    const { search } = req.query

    const where = {}

    if (search) {
      where[Op.or] = [
        { "$User.username$": { [Op.like]: `%${search}%` } },
        { "$OrderItems.Product.name$": { [Op.like]: `%${search}%` } },
        { status: { [Op.like]: `%${search}%` } },
      ]
    }

    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ["username"] },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["name"],
              include: [{ model: Categories, attributes: ["name"] }]
            }
          ]
        }
      ],
      where,
      order: [["createdAt", "DESC"]],
    })

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      user: order.User?.username || "Unknown",
      status: order.status,
      items: order.OrderItems.map(i => i.Product.name),
      categories: order.OrderItems.map(i => i.Product.Category?.name || "No category").join(", "),
      totalQty: order.OrderItems.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: Number(order.OrderItems.reduce((sum, i) => sum + i.total_price, 0)),
      date: order.createdAt.toLocaleString("id-ID"),
    }))

    res.json(formattedOrders)
    console.log("Search query:", req.query)
  } catch (error) {
    console.error("Error saat search report order:", error)
    res.status(500).json({ error: error.message })
  }
}


const searchReportStock = async (req, res) => {
  try {
    const { search } = req.query

    const where = {}

    if (search) {
      where[Op.or] = [
        { "$Product.name$": { [Op.like]: `%${search}%` } },
        { change_type: { [Op.like]: `%${search}%` } },
      ]
    }

    const stocks = await Stock.findAll({
      include: [{ model: Product, attributes: ["name"] }],
      where,
      order: [["createdAt", "DESC"]],
    })

    const formattedStocks = stocks.map((stock) => ({
      id: stock.id,
      product_name: stock.Product?.name || "-",
      change_type: stock.change_type,
      quantity: stock.quantity,
      stock_akhir: stock.stock_akhir,
      createdAt: stock.createdAt.toLocaleString("id-ID"),
    }))

    res.json(formattedStocks)
    console.log("Search query:", req.query)
  } catch (error) {
    console.error("Error saat search report stock:", error)
    res.status(500).json({ error: error.message })
  }
}


module.exports = {
    getProductReport, 
    getOrderReport, 
    getStockReport, 
    getSummary, 
    getStockSales, 
    searchReportProduct,
    searchReportOrder,
    searchReportStock
}