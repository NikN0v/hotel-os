<template>
    <PagePlaceholder title="Календарь" description="Календарь бронирований и занятости номеров" icon="mdi-calendar-month-outline">
        <template #actions>
            <v-btn variant="outlined" color="secondary" @click="goToday">Сегодня</v-btn>
        </template>

        <v-card elevation="0" border class="hotel-scheduler overflow-hidden rounded-hotel-xl">
            <DayPilotScheduler ref="schedulerRef" :config="schedulerConfig"/>
        </v-card>

        <BaseDialog v-model="reservationDialog" title="Бронирование" subtitle="Информация о бронировании" icon="mdi-calendar-check-outline" width="520">
            <div v-if="selectedReservation" class="space-y-5">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <div class="text-xs text-hotel-text-muted">Гость</div>
                        <div class="mt-1 font-medium text-hotel-text-primary">{{ getGuestName(selectedReservation.guest_id) }}</div>
                    </div>

                    <div>
                        <div class="text-xs text-hotel-text-muted">Номер</div>
                        <div class="mt-1 font-medium text-hotel-text-primary">№{{ getRoomNumber(selectedReservation.room_id) }}</div>
                    </div>

                    <div>
                        <div class="text-xs text-hotel-text-muted">Заезд</div>
                        <div class="mt-1 font-medium text-hotel-text-primary">{{ formatDate(selectedReservation.checkIn) }}</div>
                    </div>

                    <div>
                        <div class="text-xs text-hotel-text-muted">Выезд</div>
                        <div class="mt-1 font-medium text-hotel-text-primary">{{ formatDate(selectedReservation.checkOut) }}</div>
                    </div>

                    <div>
                        <div class="text-xs text-hotel-text-muted">Гостей</div>
                        <div class="mt-1 font-medium text-hotel-text-primary">{{ selectedReservation.guests }}</div>
                    </div>

                    <div>
                        <div class="text-xs text-hotel-text-muted">Стоимость</div>
                        <div class="mt-1 font-medium text-hotel-text-primary">{{ formatCurrency(selectedReservation.price) }}</div>
                    </div>
                </div>

                <div>
                    <div class="text-xs text-hotel-text-muted">Статус</div>
                    <v-chip class="mt-1" size="small" variant="tonal" :color="getStatusConfig(selectedReservation.status).color">
                        {{ getStatusConfig(selectedReservation.status).label }}
                    </v-chip>
                </div>

                <div v-if="selectedReservation.comment">
                    <div class="text-xs text-hotel-text-muted">Комментарий</div>
                    <p class="mt-1 text-sm leading-6 text-hotel-text-secondary">{{ selectedReservation.comment }}</p>
                </div>
            </div>

            <template #actions>
                <v-btn variant="text" color="secondary" @click="reservationDialog = false">Закрыть</v-btn>
            </template>
        </BaseDialog>
    </PagePlaceholder>
</template>

<script setup>
import PagePlaceholder from '../../components/ui/PagePlaceholder.vue';
import BaseDialog from '../../components/ui/BaseDialog.vue'
import { useReservationsStore } from '../../stores/reservations.store.js';
import { useRoomsStore } from '../../stores/rooms.store.js';
import { useGuestsStore } from '../../stores/guests.store.js';
import { computed, onMounted, ref } from 'vue';
import { RESERVATION_STATUSES } from '../../constants/reservation';
import { formatDate } from '../../utils/formatDate.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { DayPilot, DayPilotScheduler } from '@daypilot/daypilot-lite-vue';

const startDate = ref(DayPilot.Date.today().firstDayOfMonth())

const reservationsStore = useReservationsStore()
const roomsStore = useRoomsStore()
const guestsStore = useGuestsStore()

const schedulerRef = ref(null)
const reservationDialog = ref(false)
const selectedReservation = ref(null)

const rooms = computed(() => roomsStore.rooms)
const reservations = computed(() => reservationsStore.reservations)
const guests = computed(() => guestsStore.guests)

const resources = computed(() => {
    return rooms.value.map(room => ({
        id: String(room.id),
        name: `№${room.number}`
    }))
})

const events = computed(() => {
    return reservations.value.map(reservation => ({
        id: String(reservation.id),
        resource: String(reservation.room_id),
        start: reservation.checkIn,
        end: reservation.checkOut,
        text: getGuestName(reservation.guest_id),
        tags: {reservation, status: reservation.status},
        ...getEventColors(reservation.status)
    }))
})

const schedulerConfig = computed(() => ({
    startDate: startDate.value,
    days: startDate.value.daysInMonth(),
    scale: 'Day',
    timeHeaders: [
        {groupBy: 'Month', format: 'MMMM yyyy'},
        {groupBy: 'Day', format: 'ddd d'}
    ],
    resources: resources.value,
    events: events.value,
    rowHeaderWidth: 100,
    cellWidth: 80,
    eventHeight: 34,
    durationBarVisible: false,
    treeEnabled: false,
    locale: 'ru-ru',
    eventMoveHandling: 'Disabled',
    eventResizeHandling: 'Disabled',
    timeRangeSelectedHandling: 'Disabled',
    onBeforeEventRender: args => {
        const status = args.data.tags?.status
        args.data.borderRadius = 6
        args.data.fontColor = '#FFFFFF'
        args.data.backColor = getEventColors(status).backColor
        args.data.borderColor = getEventColors(status).borderColor
    },
    onEventClick: args => {
        handleEventClick(args.e.data.tags.reservation)
    }
}))

const goToday = () => startDate.value = DayPilot.Date.today().firstDayOfMonth()

const handleEventClick = info => {
    selectedReservation.value = info
    reservationDialog.value = true
}

const getGuestName = guestId => {
    const guest = guests.value.find(item => item.id === guestId)
    return guest?.fullName ?? 'Неизвестный гость'
}

const getEventColors = status => {
    const colors = {
        pending: {
            backColor: '#F59E0B',
            borderColor: '#D97706'
        },

        confirmed: {
            backColor: '#0284C7',
            borderColor: '#0369A1'
        },

        checked_in: {
            backColor: '#16A34A',
            borderColor: '#15803D'
        },

        checked_out: {
            backColor: '#64748B',
            borderColor: '#475569'
        },

        cancelled: {
            backColor: '#DC2626',
            borderColor: '#B91C1C'
        }
    }

    return colors[status] ?? {
        backColor: '#64748B',
        borderColor: '#475569'
    }
}

const getRoomNumber = roomId => {
    const room = rooms.value.find(item => item.id === roomId)
    return room?.number ?? '-'
}

const getStatusConfig = status => {
    return RESERVATION_STATUSES[status] ?? {label: status, color: 'secondary'}
}

onMounted(async () => {
    await Promise.all([
        reservationsStore.loadReservations(),
        roomsStore.loadRooms(),
        guestsStore.loadGuests()
    ])
})
</script>