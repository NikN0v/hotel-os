import api from "./axios"

export const getGuests = async () => {
    const {data} = await api.get('/guests')
    return data ?? []
}

export const createGuest = async (guest) => {
    const {data} = await api.post('/guests', guest)
    return data
}

export const updateGuest = async (id, guest) => {
    const {data} = await api.patch(`/guests/${id}`, guest)
    return data
}

export const deleteGuest = async (id) => {
    await api.delete(`/guests/${id}`)
}