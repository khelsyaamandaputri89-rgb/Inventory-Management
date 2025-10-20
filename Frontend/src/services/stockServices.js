import api from './api'

const addStock = (data) => api.post("/stocks", data)
const getStock = (data) => api.get("/stocks", data)
const countStock = (data) => api.post("/stocks/current", data)

export default {addStock, getStock, countStock}