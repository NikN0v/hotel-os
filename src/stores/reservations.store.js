import { defineStore } from "pinia";
import { computed, ref } from "vue";
import api from "../api/axios";

export const useReservationsStore = defineStore('reservations', () => {
    const reservations = ref([])
    const loading = ref(false)
    const error = ref(null)
    const saving = ref(false)
    const deleting = ref(false)

    const loadReservations = async () => {
        loading.value = true
        error.value = null

        try {
            const {data} = await api.get('/reservations')
            reservations.value = data ?? []
        } catch (e) {
            error.value = e
            throw e
        } finally {
            loading.value = false
        }
    }

    const createReservation = async (reservation) => {
        saving.value = true
        error.value = null
        try {
            const {data} = await api.post('/reservations', reservation)
            reservations.value.push(data)
            return data
        } catch (e) {
            error.value = e
            throw e
        } finally {
            saving.value = false
        }
    }

    const updateReservation = async (id, reservation) => {
        saving.value = true
        error.value = null
        try {
            const {data} = await api.patch(`/reservations/${id}`, reservation)
            const index = reservations.value.findIndex(it => it.id === id)
            if (index !== -1) reservations.value[index] = data
            return data
        } catch (e) {
            error.value = e
            throw e
        } finally {
            saving.value = false
        }
    }

    const deleteReservation = async (id) => {
        deleting.value = true
        error.value = null
        try {
            await api.delete(`/reservations/${id}`)
            reservations.value = reservations.value.filter(it => it.id !== id)
        } catch (e) {
            error.value = e
            throw e
        } finally {
            deleting.value = false
        }
    }

    const getReservationById = (id) => reservations.value.find(it => it.id === id)

    const reservationsCount = computed(() => reservations.value.length)

    return {
        reservations, loading, error, saving, deleting, reservationsCount,
        loadReservations, createReservation, updateReservation, deleteReservation, getReservationById
    }
})