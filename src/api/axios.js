import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('hotel_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401 && location.pathname !== '/auth/login') {
        localStorage.removeItem('hotel_token')
        localStorage.removeItem('hotel_user')
        if (location.pathname !== '/auth/login') location.href = '/auth/login'
    }
    return Promise.reject(error)
})

export default api