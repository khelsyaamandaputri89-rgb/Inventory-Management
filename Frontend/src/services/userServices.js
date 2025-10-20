import api from './api'

const User = (data) => api.post("/users", data)
const Users = (data) => api.get("/users", data)
const user = (data) => api.put("/users/:id", data)
const users = (data) => api.delete("/users/:id", data)

export default {User, Users, user, users}