import { defineStore } from "pinia";
import { computed, ref } from "vue";
import api from "../api/axios";

export const useDashboardStore = defineStore('dashboard', () => {
    const loading = ref(false)
    const error = ref(null)

    const rooms = ref([])
    const reservations = ref([])
    const payments = ref([])
    const totalRooms = computed(() => rooms.value.length)
    const availableRooms = computed(() => rooms.value.filter(room => room.status === 'available'))
    const reservedRooms = computed(() => rooms.value.filter(room => room.status === 'reserved'))
    const occupiedRooms = computed(() => rooms.value.filter(room => room.status === 'occupied'))
    const maintenanceRooms = computed(() => rooms.value.filter(room => room.status === 'maintenance'))

    const occupancy = computed(() => {
        if (!totalRooms.value) return 0
        return Math.round(occupiedRooms.value.length / totalRooms.value) * 100
    })

    const today = new Date()

    const isToday = (date) => {
        const value = new Date(date)
        return (
            value.getFullYear() === today.getFullYear() &&
            value.getMonth() === today.getMonth() &&
            value.getDate() === today.getDate()
        )
    }

    const checkIns = computed(() => reservations.value.filter(reservation => reservation.status !== 'cancelled' && isToday(reservation.checkIn)).length)
    const checkOuts = computed(() => reservations.value.filter(reservation => reservation.status !== 'cancelled' && isToday(reservation.checkOut)).length)

    const revenue = computed(() => {
        return payments.value
            .filter(payment => payment.status === 'paid')
            .reduce(
                (total, payment) =>
                    total + Number(payment.amount || 0),
                0
            )
    })

    const loadDashboard = async () => {
        loading.value = true
        error.value = null

        try {
            const [
                roomsRes,
                reservationsRes,
                paymentsRes
            ] = await Promise.all([
                api.get('/rooms'),
                api.get('/reservations'),
                api.get('/payments')
            ])

            rooms.value = roomsRes.data ?? []
            reservations.value = reservationsRes.data ?? []
            payments.value = paymentsRes.data ?? []
        } catch (e) {
            error.value = e
            throw e
        } finally {
            loading.value = false
        }
    }

    return {
        loading, error, rooms, reservations, payments, totalRooms, occupiedRooms, availableRooms, reservedRooms, occupancy, checkIns, checkOuts, revenue,
        loadDashboard
    }
})