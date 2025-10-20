import api from './api'

const addCategories = (data) => api.post("/categories", data)
const getCategories = () => api.get("/categories")
const updatecategories = (id, data) => api.put(`/categories/${id}`, data)
const deleteCategories = (id) => api.delete(`/categories/${id}`)
const searchCategories = (keyword) => api.get("/categories/search", { params: { search: keyword }})

export default {addCategories, getCategories, updatecategories, deleteCategories, searchCategories}