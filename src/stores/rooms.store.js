import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { createRoom, deleteRoom, getRooms, updateRoom } from '../api/rooms.api'
import api from "../api/axios";

export const useRoomsStore = defineStore('rooms', () => {
    const rooms = ref([])
    const loading = ref(false)
    const error = ref(null)
    const updatingRoomId = ref(null)

    const availableRooms = computed(() => rooms.value.filter(room => room.status === 'available'))
    const reservedRooms = computed(() => rooms.value.filter(room => room.status === 'reserved'))
    const occupiedRooms = computed(() => rooms.value.filter(room => room.status === 'occupied'))
    const maintenanceRooms = computed(() => rooms.value.filter(room => room.status === 'maintenance'))

    const loadRooms = async () => {
        loading.value = true
        error.value = null

        try {
            rooms.value = await getRooms()
        } catch (e) {
            error.value = e
            throw e
        } finally {
            loading.value = false
        }
    }

    const addRoom = async (room) => {
        const newRoom = await createRoom(room)
        rooms.value.push(newRoom)
        return newRoom
    }

    const editRoom = async (id, room) => {
        const updatedRoom = await updateRoom(id, room)
        const index = rooms.value.findIndex(it => it.id === id)
        if (index !== -1) rooms.value[index] = updatedRoom
        return updatedRoom
    }

    const removeRoom = async (id) => {
        await deleteRoom(id)
        rooms.value = rooms.value.filter(room => room.id !== id)
    }

    const updateRoomStatus = async (id, status) => {
        updatingRoomId.value = id
        error.value = null

        try {
            const {data} = await api.patch(`/rooms/${id}`, {status})
            const index = rooms.value.findIndex(room => room.id === id)
            if (index !== -1) rooms.value[index] = data
            return data
        } catch (err) {
            error.value = err
            throw err
        } finally {
            updatingRoomId.value = null
        }
    }

    return {
        rooms, loading, error, availableRooms, reservedRooms, occupiedRooms, maintenanceRooms, updatingRoomId,
        loadRooms, addRoom, editRoom, removeRoom, updateRoomStatus
    }
})