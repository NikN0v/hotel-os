import api from './axios'

export const getRooms = async () => {
    const {data} = await api.get('/rooms')
    return data
}

export const getRoom = async (id) => {
    const {data} = await api.get(`/rooms/${id}`)
    return data
}

export const createRoom = async (room) => {
    const {data} = await api.post('/rooms', room)
    return data
}

export const updateRoom = async (id, room) => {
    const {data} = await api.patch(`/rooms/${id}`, room)
    return data
}

export const deleteRoom = async (id) => await api.delete(`/rooms/${id}`)