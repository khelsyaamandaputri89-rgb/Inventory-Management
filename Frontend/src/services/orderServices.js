import api from './api'

const addOrder = (data) => api.post("/orders", data)
const createOrder = (data) => api.post("/orders/my", data)
const getAllOrder = () => api.get("/orders")
const getOrder = () => api.get("/orders/my-orders")
const deleteOrder = (id) => api.delete(`/orders/${id}`)
const searchOrder = (keyword) => api.get("/orders/search", { params: { search: keyword }})

export default { addOrder, createOrder, getOrder, getAllOrder, deleteOrder, searchOrder }
