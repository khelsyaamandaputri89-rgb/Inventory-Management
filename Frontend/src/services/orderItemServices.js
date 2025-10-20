import api from './api'

const orderItem = (data) => api.post("/order-items", data)
const order_item = (data) => api.get("/order-items", data)
const orderitem = (data) => api.put("/order-items/:id", data)
const order_Item = (data) => api.delete("/order-items/:id", data)

export default {orderItem, order_item, orderitem, order_Item}