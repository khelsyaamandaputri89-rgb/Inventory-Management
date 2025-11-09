import api from './api'

const addUsers = (data) => api.post("/users", data)
const getUsers = () => api.get("/users")
const updateUsers = (id, data) => api.put(`/users/${id}`, data)
const deleteUsers = (id) => api.delete(`/users/${id}`)
const searchUsers = (keyword) => api.get("/users/search", { params: { search: keyword }})

export default {addUsers, getUsers, updateUsers, deleteUsers, searchUsers}