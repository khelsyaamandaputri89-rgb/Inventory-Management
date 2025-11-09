const {Order, OrderItem, User, Product, Stock, Categories} = require("../Models")
const {Op} = require("sequelize")

const createOrder = async (req, res) => {
    try {
        const {items} = req.body
        const userId = req.user.id

        if (!items || items.length === 0) {
            return res.status(400).json({message : "items must be filled in!"})
        }

        const order = await Order.create({user_id : userId, status : "pending"})

        for (const item of items) {
            const {product_id, quantity} = item

            const product = await Product.findByPk(item.product_id)

            if (!product) {
                return res.status(404).json(`product ${item.product_id} not found`)
            }

            const stockIn = await Stock.sum("quantity", {
                where : {product_id, change_type : "IN"}
            }) || 0

            const stockOut = await Stock.sum("quantity", {
                where : {product_id, change_type : "OUT"}
            }) || 0

            const adjustment = await Stock.sum("quantity", {
                where : {product_id, change_type : "ADJUSTMENT"}
            }) || 0

            const currentStock = stockIn - stockOut + adjustment

            if (currentStock < quantity) {
                return res.status(404).json(`product ${product.name} just remains ${currentStock}`)
            }

            await OrderItem.create({
                order_id : order.id,
                product_id : item.product_id,
                product_price : item.product_price,
                total_price : item.product_price*item.quantity,
                quantity : item.quantity
            })

            await Stock.create({
                product_id : product.id,
                change_type : "OUT",
                quantity ,
                stock_akhir :currentStock - quantity
            })

        }

        const newOrder = await Order.findByPk(order.id, {
            include : [{model : OrderItem, include : [Product]}
            ]
        })

        res.status(201).json({message : "Product ordered succesfully", order : newOrder})

    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const getOrder = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where : {user_id : req.user.id},
            include : [{
                model : User, 
                attributes : ["id", "username", "email"]},
                {
                  model : OrderItem,
                  include : [
                    {
                      model : Product, 
                      attributes : ["id", "name", "price", "stock"],
                      include: [
                        {
                          model: Categories, attributes: ["name"] } 
                      ]
                    }
                  ]
                }
              ],
              order: [["id", "ASC"]]
            }
          )

        const formattedOrders = orders.map(order => {
            const totalQty = order.OrderItems.reduce((sum, item) => sum + item.quantity, 0)
            const totalPrice = Number(order.OrderItems.reduce((sum, item) => sum + item.total_price, 0))

            return {
                id: order.id,
                status: order.status,
                items: order.OrderItems.map(i => `${i.Product.name}`),
                categories: order.OrderItems.map(i => i.Product.Category?.name || "No category").join(", "),
                totalQty,
                totalPrice,
                date: order.createdAt
            }
        })
        console.log("User ID:", req.user.id);
        console.log("Orders found:", orders.length);

                        
        res.json(formattedOrders)
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const getAllOrder = async (req, res) => {
  try {
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
          ]
        }
      ],
      order: [["id", "ASC"]]
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      user: order.User?.username || "Unknown",
      status: order.status,
      items: order.OrderItems.map(i => i.Product.name),
      categories: order.OrderItems.map(i => i.Product.Category?.name || "No category").join(", "),
      totalQty: order.OrderItems.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: Number(order.OrderItems.reduce((sum, i) => sum + i.total_price, 0)),
      date: order.createdAt
    }))

    res.json(formattedOrders);
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error)
    res.status(500).json({ error: error.message });
  }
}

const searchOrders = async (req, res) => {
  try {
    const { search } = req.query

    const whereCondition = search
      ? {
          [Op.or]: [
            { "$User.username$": { [Op.like]: `%${search}%` } },
            { "$OrderItems.Product.name$": { [Op.like]: `%${search}%` } },
            { status: { [Op.like]: `%${search}%` } }
          ]
        }
      : {}

    const orders = await Order.findAll({
      where: whereCondition,
      required: false,
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"]
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["name", "price"],
              include: [
                        { 
                            model: Categories, 
                            attributes: ["name"] 
                        }
                      ],
              }
            ]
          }
        ]
      })

    const formattedOrders = orders.map(order => {
            const totalQty = order.OrderItems.reduce((sum, item) => sum + item.quantity, 0)
            const totalPrice = order.OrderItems.reduce((sum, item) => sum + item.total_price, 0)

            return {
                id: order.id,
                user: order.User?.username || "Unknown",
                status: order.status,
                items: order.OrderItems.map(i => `${i.Product.name}`),
                totalQty,
                totalPrice,
                date: order.createdAt
            }
        })

    console.log("Orders found:", orders.length)

    res.status(200).json(formattedOrders)
  } catch (error) {
    console.error("Search order error:", error)
    res.status(500).json({ error: error.message })
  }
}

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params

    const order = await Order.findByPk(id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    const isOwner = order.user_id === req.user.id
    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin"

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Can't delete other people's orders!" })
    }

    await order.destroy()
    res.json({ message: "Order deleted succesfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {createOrder, getOrder, getAllOrder, deleteOrder, searchOrders}