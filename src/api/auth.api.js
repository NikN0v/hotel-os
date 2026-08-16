import api from "./axios"

export const registerUser = async (user) => {
    const {data} = await api.post('/register', user)
    return data
}

export const loginUser = async (email, password) => {
    const {data} = await api.post('/auth', {email, password})
    return data
}