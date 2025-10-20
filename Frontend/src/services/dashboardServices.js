import api from './api'

const getDashboardAdmin = (data) => api.get("/dashboard/admin", data)
const getDashboardSuperadmin = (data) => api.get("/dashboard/superadmin", data)
const getDashboardUser = (data) => api.get("/dashboard/user", data)

export default { getDashboardAdmin, getDashboardSuperadmin, getDashboardUser }