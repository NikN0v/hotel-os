<template>
    <PagePlaceholder title="Бронирования" description="Управление бронированиями и размещением гостей"
        icon="mdi-calendar-check-outline">
        <template #actions>
            <v-btn color="primary" prepend-icon="mdi-calendar-plus" @click="openCreateDialog">
                Новое бронирование
            </v-btn>
        </template>

        <div class="space-y-6">
            <v-card elevation="0" border class="rounded-hotel-xl">
                <div class="grid grid-cols-1 gap-4 p-5 md:grid-cols-4">
                    <v-text-field v-model="filters.search" label="Поиск" prepend-inner-icon="mdi-magnify" clearable />
                    <v-select v-model="filters.status" label="Статус" :items="statusFilterOptions" item-title="title"
                        item-value="value" clearable />
                    <v-text-field v-model="filters.checkIn" label="Заезд" type="date" clearable />
                    <v-text-field v-model="filters.checkOut" label="Выезд" type="date" clearable />
                </div>
            </v-card>

            <v-card elevation="0" border class="rounded-hotel-xl">
                <v-data-table :headers="headers" :items="filteredReservations" :loading="reservationsStore.loading"
                    item-value="id" hover class="bg-transparent">
                    <template v-slot:item.guest="{ item }">
                        <div>
                            <div class="font-medium text-hotel-text-primary">
                                {{ getGuestName(item.guest_id) }}
                            </div>

                            <div class="mt-0.5 text-xs text-hotel-text-muted">
                                {{ item.guests }} чел.
                            </div>
                        </div>
                    </template>

                    <template v-slot:item.room="{ item }">
                        <span class="font-medium text-hotel-text-primary">
                            №{{ getRoomNumber(item.room_id) }}
                        </span>
                    </template>

                    <template v-slot:item.checkIn="{ item }">
                        {{ formatDate(item.checkIn) }}
                    </template>

                    <template v-slot:item.checkOut="{ item }">
                        {{ formatDate(item.checkOut) }}
                    </template>

                    <template v-slot:item.price="{ item }">
                        <span class="font-medium text-hotel-text-primary">
                            {{ formatCurrency(item.price) }}
                        </span>
                    </template>

                    <template v-slot:item.status="{ item }">
                        <v-chip size="small" variant="tonal" :color="getStatusConfig(item.status).color">
                            {{ getStatusConfig(item.status).label }}
                        </v-chip>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <div class="flex items-center justify-end gap-1">
                            <v-btn v-if="item.status === 'pending'" icon="mdi-check-circle-outline" variant="text" size="small" color="primary" title="Подтвердить"
                                @click="handleConfirmReservation(item)"/>

                            <v-btn v-if="item.status === 'confirmed'" icon="mdi-login" variant="text" size="small" color="success" title="Заселить"
                                @click="handleCheckIn(item)"/>

                            <v-btn v-if="item.status === 'checked_in'" icon="mdi-logout" variant="text" size="small" color="secondary" title="Выселить"
                                @click="handleCheckOut(item)"/>

                            <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="secondary"
                                @click="openEditDialog(item)" />

                            <v-btn icon="mdi-delete-outline" variant="text" size="small" color="error"
                                @click="openDeleteDialog(item)" />
                        </div>
                    </template>

                    <template #no-data>
                        <div class="flex min-h-48 flex-col items-center justify-center">
                            <v-icon icon="mdi-calendar-blank-outline" size="48" class="mb-4 text-hotel-text-muted" />

                            <p class="text-sm text-hotel-text-secondary">
                                Бронирования не найдены
                            </p>
                        </div>
                    </template>
                </v-data-table>
            </v-card>
        </div>

        <BaseDialog v-model="reservationDialog" :title="dialogTitle" :subtitle="dialogSubtitle"
            icon="mdi-calendar-check-outline" :loading="saving" :persistent="saving">
            <ReservationForm :reservation="editingReservation" :guests="guests" :rooms="rooms" :loading="saving"
                @submit="handleReservationSubmit" @cancel="closeReservationDialog" />
        </BaseDialog>

        <BaseDialog v-model="deleteDialog" title="Удаление бронирования" subtitle="Это действие нельзя отменить"
            icon="mdi-delete-outline" width="480" :loading="deleting" :persistent="deleting">
            <p class="text-sm leading-6 text-hotel-text-secondary">
                Вы действительно хотите удалить бронирование
                <span class="font-medium text-hotel-text-primary">
                    {{ reservationToDelete
                        ? getGuestName(reservationToDelete.guest_id)
                        : ''
                    }}
                </span>?
            </p>

            <template #actions>
                <v-btn variant="text" color="secondary" :disabled="deleting" @click="deleteDialog = false">
                    Отмена
                </v-btn>

                <v-btn color="error" :loading="deleting" @click="handleDelete">
                    Удалить
                </v-btn>
            </template>
        </BaseDialog>

        <BaseDialog v-model="statusDialog" :title="statusActionConfig?.title" :subtitle="statusActionConfig?.subtitle" :icon="statusActionConfig?.icon" width="480"
            :loading="statusLoading" :persistent="statusLoading">
            <p class="text-sm leading-6 text-hotel-text-secondary">
                Вы действительно хотите выполнить действие
                <span class="font-medium text-hotel-text-primary">"{{ statusActionConfig?.buttonText }}"</span>
                для гостя
                <span class="font-medium text-hotel-text-primary">{{ statusReservation ? getGuestName(statusReservation.guest_id) : '' }}</span>?
            </p>
            
            <template #actions>
                <v-btn variant="text" color="secondary" :disabled="statusLoading" @click="closeStatusDialog">Отмена</v-btn>
                <v-btn :color="statusActionConfig?.color" :loading="statusLoading" @click="handleStatusAction">{{ statusActionConfig?.buttonText }}</v-btn>
            </template>
        </BaseDialog>
    </PagePlaceholder>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import PagePlaceholder from '../../components/ui/PagePlaceholder.vue'
import BaseDialog from '../../components/ui/BaseDialog.vue'
import ReservationForm from '../../components/reservations/ReservationForm.vue'
import { canChangeReservationStatus, RESERVATION_STATUS_OPTIONS, RESERVATION_STATUSES, ROOM_STATUS_BY_RESERVATION_STATUS } from '../../constants/reservation'
import { useRoomsStore } from '../../stores/rooms.store.js'
import { useReservationsStore } from '../../stores/reservations.store.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatDate } from '../../utils/formatDate.js'
import { useGuestsStore } from '../../stores/guests.store.js'

const reservationsStore = useReservationsStore()
const roomsStore = useRoomsStore()
const guestsStore = useGuestsStore()

const saving = ref(false)
const reservationDialog = ref(false)
const editingReservation = ref(null)
const deleteDialog = ref(false)
const reservationToDelete = ref(null)
const deleting = ref(false)

const statusDialog = ref(false)
const statusAction = ref(null)
const statusReservation = ref(null)
const statusLoading = ref(false)

const filters = reactive({
    search: '',
    status: null,
    checkIn: '',
    checkOut: ''
})

const headers = [
    {
        title: 'Гость',
        key: 'guest',
        sortable: false
    },
    {
        title: 'Номер',
        key: 'room',
        sortable: false
    },
    {
        title: 'Заезд',
        key: 'checkIn'
    },
    {
        title: 'Выезд',
        key: 'checkOut'
    },
    {
        title: 'Гости',
        key: 'guests'
    },
    {
        title: 'Стоимость',
        key: 'price'
    },
    {
        title: 'Статус',
        key: 'status'
    },
    {
        title: '',
        key: 'actions',
        sortable: false,
        align: 'end'
    }
]

const statusFilterOptions = [
    {
        value: null,
        title: 'Все статусы'
    },
    ...RESERVATION_STATUS_OPTIONS
]

const rooms = computed(() => {
    return roomsStore.rooms
})

const statusActionConfig = computed(() => {
    if (!statusAction.value) {
        return null
    }

    const configs = {
        confirm: {
            title: 'Подтверждение бронирования',
            subtitle: 'Бронирование будет подтверждено',
            icon: 'mdi-calendar-check-outline',
            color: 'primary',
            buttonText: 'Подтвердить',
            targetStatus: 'confirmed'
        },

        checkIn: {
            title: 'Заселение гостя',
            subtitle: 'Гость будет заселён в номер',
            icon: 'mdi-login',
            color: 'success',
            buttonText: 'Заселить',
            targetStatus: 'checked_in'
        },

        checkOut: {
            title: 'Выселение гостя',
            subtitle: 'Бронирование будет завершено',
            icon: 'mdi-logout',
            color: 'secondary',
            buttonText: 'Выселить',
            targetStatus: 'checked_out'
        }
    }

    return configs[statusAction.value]
})

const openStatusDialog = (reservation, action) => {
    statusReservation.value = reservation
    statusAction.value = action
    statusDialog.value = true
}

const closeStatusDialog = () => {
    statusDialog.value = false
    statusReservation.value = null
    statusAction.value = null
}

const handleStatusAction = async () => {
    if (
        !statusReservation.value ||
        !statusActionConfig.value
    ) {
        return
    }

    const reservation = statusReservation.value
    const targetStatus = statusActionConfig.value.targetStatus

    statusLoading.value = true

    try {
        const room = roomsStore.rooms.find(
            room => room.id === reservation.room_id
        )

        if (!room) {
            throw new Error('Номер не найден')
        }

        // Проверяем текущее состояние номера
        if (
            targetStatus === 'checked_in' &&
            room.status !== 'reserved'
        ) {
            throw new Error(
                `Номер №${room.number} не находится в статусе "Забронирован"`
            )
        }

        if (
            targetStatus === 'checked_out' &&
            room.status !== 'occupied'
        ) {
            throw new Error(
                `Номер №${room.number} не находится в статусе "Заселён"`
            )
        }

        // Обновляем бронирование
        await reservationsStore.updateReservation(
            reservation.id,
            {
                ...reservation,
                status: targetStatus
            }
        )

        // Синхронизируем номер
        const roomStatus =
            ROOM_STATUS_BY_RESERVATION_STATUS[targetStatus]

        await roomsStore.updateRoomStatus(
            room.id,
            roomStatus
        )

        closeStatusDialog()

    } catch (error) {
        console.error(
            'Не удалось изменить статус бронирования:',
            error
        )
    } finally {
        statusLoading.value = false
    }
}

const handleConfirmReservation = reservation => openStatusDialog(reservation, 'confirm')
const handleCheckIn = reservation => openStatusDialog(reservation, 'checkIn')
const handleCheckOut = reservation => openStatusDialog(reservation, 'checkOut')

const filteredReservations = computed(() => {
    return reservationsStore.reservations.filter(reservation => {
        const search = filters.search
            .trim()
            .toLowerCase()

        if (search) {
            const guestName = getGuestName(
                reservation.guest_id
            ).toLowerCase()

            const roomNumber = String(
                getRoomNumber(reservation.room_id)
            )

            const matchesSearch =
                guestName.includes(search) ||
                roomNumber.includes(search)

            if (!matchesSearch) {
                return false
            }
        }

        if (
            filters.status &&
            reservation.status !== filters.status
        ) {
            return false
        }

        if (
            filters.checkIn &&
            reservation.checkIn !== filters.checkIn
        ) {
            return false
        }

        if (
            filters.checkOut &&
            reservation.checkOut !== filters.checkOut
        ) {
            return false
        }

        return true
    })
})

const dialogTitle = computed(() => {
    return editingReservation.value
        ? 'Редактирование бронирования'
        : 'Новое бронирование'
})

const dialogSubtitle = computed(() => {
    return editingReservation.value
        ? 'Измените данные бронирования'
        : 'Заполните данные нового бронирования'
})

const getGuestName = guestId => {
    const guest = guests.value.find(
        item => item.id === guestId
    )

    return guest?.fullName ?? 'Неизвестный гость'
}

const getRoomNumber = roomId => {
    const room = rooms.value.find(
        item => item.id === roomId
    )

    return room?.number ?? '—'
}

const getStatusConfig = status => {
    return (
        RESERVATION_STATUSES[status] ?? {
            label: status,
            color: 'secondary'
        }
    )
}

const openCreateDialog = () => {
    editingReservation.value = null
    reservationDialog.value = true
}

const openEditDialog = reservation => {
    editingReservation.value = { ...reservation }
    reservationDialog.value = true
}

const closeReservationDialog = () => {
    reservationDialog.value = false
    editingReservation.value = null
}

const confirmReservation = async reservation => { }
const checkInReservation = async reservation => { }
const checkOutReservation = async reservation => { }

const handleReservationSubmit = async data => {
    saving.value = true

    try {
        const newRoomStatus =
            ROOM_STATUS_BY_RESERVATION_STATUS[data.status]

        if (editingReservation.value) {
            const oldReservation = editingReservation.value
            const statusChanged = oldReservation.status !== data.status

            if (statusChanged && !canChangeReservationStatus(oldReservation.status, data.status)) {
                throw new Error(`Нельзя изменить статус с "${RESERVATION_STATUSES[oldReservation.status]?.label}" на "${RESERVATION_STATUSES[data.status]?.label}"`)
            }

            if (statusChanged) {
                const room = roomsStore.rooms.find(room => room.id === data.room_id)
                if (!room) throw new Error('Номер не найден')
                if (data.status === 'checked_in' && room.status !== 'reserved') throw new Error(`Номер №${room.number} не находится в статусе "Забронирован"`)
                if (data.status === 'checked_out' && room.status !== 'occupied') throw new Error(`Номер №${room.number} не находится в статусе "Заселён"`)
            }

            if (oldReservation.room_id !== data.room_id) {
                const newRoom = roomsStore.rooms.find(
                    room => room.id === data.room_id
                )

                if (!newRoom) {
                    throw new Error('Новый номер не найден')
                }

                if (newRoom.status !== 'available') {
                    throw new Error(
                        `Номер №${newRoom.number} уже занят`
                    )
                }

                const oldRoom = roomsStore.rooms.find(
                    room => room.id === oldReservation.room_id
                )

                if (oldRoom) {
                    await roomsStore.updateRoomStatus(
                        oldRoom.id,
                        'available'
                    )
                }

                await roomsStore.updateRoomStatus(
                    newRoom.id,
                    newRoomStatus
                )
            } else {
                await roomsStore.updateRoomStatus(
                    data.room_id,
                    newRoomStatus
                )
            }

            await reservationsStore.updateReservation(
                oldReservation.id,
                data
            )
        }

        else {
            const room = roomsStore.rooms.find(
                room => room.id === data.room_id
            )

            if (!room) {
                throw new Error('Номер не найден')
            }

            if (room.status !== 'available') {
                throw new Error(
                    `Номер №${room.number} уже занят`
                )
            }

            await reservationsStore.createReservation(data)

            await roomsStore.updateRoomStatus(
                room.id,
                newRoomStatus
            )
        }

        reservationDialog.value = false
        editingReservation.value = null

    } catch (error) {
        console.error(
            'Не удалось сохранить бронирование:',
            error
        )
    } finally {
        saving.value = false
    }
}

const openDeleteDialog = reservation => {
    reservationToDelete.value = reservation
    deleteDialog.value = true
}

const handleDelete = async () => {
    if (!reservationToDelete.value) return

    deleting.value = true

    try {
        const reservation = reservationToDelete.value

        await reservationsStore.deleteReservation(
            reservation.id
        )

        const room = roomsStore.rooms.find(
            room => room.id === reservation.room_id
        )

        if (room) {
            await roomsStore.updateRoomStatus(
                room.id,
                'available'
            )
        }

        deleteDialog.value = false
        reservationToDelete.value = null

    } catch (error) {
        console.error(
            'Не удалось удалить бронирование:',
            error
        )
    } finally {
        deleting.value = false
    }
}

const guests = computed(() => guestsStore.guests)

onMounted(async () => {
    await Promise.all([
        reservationsStore.loadReservations(),
        roomsStore.loadRooms(),
        guestsStore.loadGuests()
    ])
})
</script>