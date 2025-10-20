import api from './api'

const addProduct = (data) => api.post("/products", data)
const getProduct = () => api.get("/products")
const updateProduct = (id, data) => api.put(`/products/${id}`, data)
const deleteProduct = (id) => api.delete(`/products/${id}`)
const searchProduct = (keyword) => api.get("/products/search", { params: { search: keyword }})

export default {addProduct, getProduct, updateProduct, deleteProduct, searchProduct}