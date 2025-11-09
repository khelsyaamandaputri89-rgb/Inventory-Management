import axios from 'axios'
const serviceUrl = import.meta.env.VITE_SERVICE_URL

const api = axios.create({
    baseURL : serviceUrl,
    headers : {
        "Content-Type" : "application/json"
    }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
)

export default api