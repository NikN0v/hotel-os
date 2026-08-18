import { defineStore } from "pinia";
import { ref } from "vue";
import { createGuest, deleteGuest, getGuests, updateGuest } from "../api/guests.api";

export const useGuestsStore = defineStore('guests', () => {
    const guests = ref([])
    const loading = ref(false)
    const saving = ref(false)
    const deleting = ref(false)
    const error = ref(null)

    const loadGuests = async () => {
        loading.value = true
        error.value = null

        try {
            guests.value = await getGuests()
        } catch (e) {
            error.value = e
            throw e
        } finally {
            loading.value = false
        }
    }

    const addGuest = async (guest) => {
        saving.value = true
        error.value = null

        try {
            const newGuest = await createGuest(guest)
            guests.value.push(newGuest)
            return newGuest
        } catch (e) {
            error.value = e
            throw e
        } finally {
            saving.value = false
        }
    }

    const editGuest = async (id, guest) => {
        saving.value = true
        error.value = null

        try {
            const updatedGuest = await updateGuest(id, guest)
            const index = guests.value.findIndex(it => it.id === id)
            if (index !== -1) guests.value[index] = updatedGuest
            return updatedGuest
        } catch (e) {
            error.value = e
            throw e
        } finally {
            saving.value = false
        }
    }

    const removeGuest = async (id) => {
        deleting.value = true
        error.value = null

        try {
            await deleteGuest(id)
            guests.value = guests.value.filter(it => it.id !== id)
        } catch (e) {
            error.value = e
            throw e
        } finally {
            deleting.value = false
        }
    }

    const getGuestById = (id) => guests.value.find(it => it.id === id)

    return {
        guests, loading, saving, deleting, error,
        loadGuests, addGuest, editGuest, removeGuest, getGuestById
    }
})