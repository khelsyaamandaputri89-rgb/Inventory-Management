import api from './api'

const addStock = (data) => api.post("/stocks", data)
const getStock = (data) => api.get("/stocks", data)
const countStock = (data) => api.post("/stocks/current", data)
const deleteStock = (id) => api.delete(`/stocks/${id}`)
const searchStock = (keyword) => api.get("/stocks/search", { params: { search: keyword }})

export default {addStock, getStock, countStock, deleteStock, searchStock}