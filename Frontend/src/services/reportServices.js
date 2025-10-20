import api from './api'

const sales = (data) => api.get("/reports/sales", data)
const purchases = (data) => api.get("/reports/purchase", data)

export default {sales, purchases}