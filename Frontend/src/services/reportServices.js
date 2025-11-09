import api from './api'

const getProductReport = (params) => api.get("/reports/product", {params})
const getOrderReport = (params) => api.get("/reports/order", {params})
const getStockReport = (params) => api.get("/reports/stock", {params})
const getSummary = (data) => api.get("/reports/summary", data)
const getStockSales = (data) => api.get("/reports/stock-sales", data)
const searchReportProduct = (keyword) => api.get("/reports/products/search", { params: { search: keyword }})
const searchReportOrder = (keyword) => api.get("/reports/orders/search", { params: { search: keyword }})
const searchReportStock = (keyword) => api.get("/reports/stocks/search", { params: { search: keyword }})

export default {
    getProductReport, 
    getOrderReport, 
    getStockReport, 
    getSummary, 
    getStockSales, 
    searchReportProduct,
    searchReportOrder,
    searchReportStock
}