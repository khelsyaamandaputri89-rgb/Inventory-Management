const {OrderItem} = require("../Models")
const {Order} = require("../Models")

const createOrderItem = async (req, res) => {
    try {
        const {order_id, product_id, quantity} = req.body

        const orderItem = await OrderItem.create({order_id, product_id, quantity})

        res.status(201).json({message : "Berhasil menambahkan order item",orderItem})

    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const getOrderItem = async (req, res) => {
    try {
        const orderItems = await OrderItem.findAll({include : [{model : Order}]})

        res.json(orderItems)

    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const putOrderItem = async (req, res) => {
    try {
        const {quantity} = req.body
        const {id} = req.params

        const orderItem = await OrderItem.findByPk(id)

        if (!orderItem) {
            return res.status(404).json({message : "Order-item tidak ditemukan"})
        } 

        orderItem.quantity = quantity
        orderItem.save()

        res.json({message : "Order-item berhasil di perbarui", orderItem})

    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const deleteOrderItem = async (req, res) => {
     try {
        const {id} = req.params

        const orderItems = await OrderItem.findByPk(id)
        
        if (!orderItems) {
           return res.status(404).json({message : "Order-item tidak di temukan"})
        }

        await orderItems.destroy()
        res.json({message : "Order-item berhasil di hapus"})
        
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

module.exports = {createOrderItem, getOrderItem, putOrderItem, deleteOrderItem}