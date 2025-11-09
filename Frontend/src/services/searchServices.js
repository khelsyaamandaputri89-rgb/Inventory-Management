import api from "./api"

const searchAll = (query) => api.get(`/search?query=${encodeURIComponent(query)}`)

export default {searchAll}