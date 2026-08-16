<template>
    <PagePlaceholder title="Номера" description="Управление номерным фондом отеля" icon="mdi-bed-outline">
        <template #actions>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
                Добавить номер
            </v-btn>
        </template>

        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <v-card v-for="item in statistics" :key="item.label" elevation="0" border class="rounded-hotel-xl">
                <div class="p-5">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-hotel-text-secondary">{{ item.label }}</span>
                        <v-icon :icon="item.icon" size="20" :class="item.iconClass" />
                    </div>

                    <div class="mt-3 text-2xl font-semibold text-hotel-text-primary">
                        {{ item.value }}
                    </div>
                </div>
            </v-card>
        </div>

        <v-card elevation="0" border class="mt-6 rounded-hotel-xl">
            <div class="border-b border-hotel-border p-5">
                <div class="flex items-center justify-between ">
                    <div>
                        <h2 class="text-lg font-semibold text-hotel-text-primary">Все номера</h2>
                        <p class="mt-1 text-sm text-hotel-text-secondary">Найдено: {{ filteredRooms.length }}</p>
                    </div>

                    <div class="flex items-center gap-1 rounded-hotel-md bg-hotel-surface-secondary p-1">
                        <v-btn icon="mdi-view-grid-outline" size="small" :variant="viewMode === 'grid' ? 'flat' : 'text'" :color="viewMode === 'grid' ? 'primary' : 'secondary'" @click="viewMode = 'grid'"/>
                        <v-btn icon="mdi-map-marker-outline" size="small" :variant="viewMode === 'map' ? 'flat' : 'text'" :color="viewMode === 'map' ? 'primary' : 'secondary'" @click="viewMode = 'map'"/>
                    </div>
                </div>
            </div>

            <div class="grid gap-4 border-b border-hotel-border p-5 md:grid-cols-3">
                <v-text-field v-model="search" label="Поиск по номеру" prepend-inner-icon="mdi-magnify" clearable />
                <v-select v-model="statusFilter" label="Статус" :items="statusOptions" />
                <v-select v-model="floorFilter" label="Этаж" :items="floorOptions" />
            </div>

            <div v-if="roomsStore.loading" class="flex min-h-64 items-center justify-center">
                <v-progress-circular indeterminate color="primary" />
            </div>

            <div v-else-if="roomsStore.error" class="p-6">
                <v-alert type="error" variant="tonal">
                    Не удалось загрузить номера.
                </v-alert>
            </div>

            <div v-else-if="!filteredRooms.length"
                class="flex min-h-64 flex-col items-center justify-center p-6 text-center">
                <v-icon icon="mdi-bed-outline" size="48" class="mb-4 text-hotel-text-muted" />
                <h3 class="text-base font-semibold text-hotel-text-primary">Номеров пока нет</h3>
                <p class="mt-1 text-sm text-hotel-text-secondary">Добавьте первый номер отеля</p>
            </div>

            <div v-else class="p-5">
                <div v-if="viewMode === 'grid'">
                    <div v-if="filteredRooms.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <RoomCard v-for="room in filteredRooms" :key="room.id" :room="room" @edit="openEditDialog"
                            @delete="openDeleteDialog" />
                    </div>
                </div>
                <RoomMap v-else :rooms="filteredRooms" @select="openEditDialog" :loading-room-id="roomsStore.updatingRoomId" @change-status="handleRoomStatusChange"/>
            </div>
        </v-card>
    </PagePlaceholder>

    <BaseDialog v-model="roomDialogOpen" :title="selectedRoom ? 'Редактировать номер' : 'Добавить номер'"
        :subtitle="selectedRoom ? `Изменение информации о номере №${selectedRoom.number}` : 'Заполните информацию о новом номере'"
        icon="mdi-bed-outline" :loading="roomsStore.loading">
        <RoomForm ref="roomFormRef" :model-value="selectedRoom" @submit="handleRoomSubmit" />

        <template #actions>
            <v-btn variant="text" :disabled="roomsStore.loading" @click="roomDialogOpen = false">
                Отмена
            </v-btn>

            <v-btn color="primary" :loading="roomsStore.loading" @click="roomFormRef?.submit()">
                {{ selectedRoom ? 'Сохранить' : 'Добавить' }}
            </v-btn>
        </template>
    </BaseDialog>

    <ConfirmDialog v-model="deleteDialogOpen" title="Удалить номер?" :message="selectedRoom ? `Номер №${selectedRoom.number} будет удален. Это действие нельзя отменить.` : ''"
        icon="mdi-delete-outline" confirm-text="Удалить" confirm-color="error" :loading="roomsStore.loading" @confirm="handleDeleteRoom"/>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import PagePlaceholder from '../../components/ui/PagePlaceholder.vue';
import { useRoomsStore } from '../../stores/rooms.store.js';
import BaseDialog from '../../components/ui/BaseDialog.vue';
import RoomForm from '../../components/rooms/RoomForm.vue';
import RoomCard from '../../components/rooms/RoomCard.vue';
import ConfirmDialog from '../../components/ui/ConfirmDialog.vue';
import RoomMap from '../../components/rooms/RoomMap.vue';

const roomsStore = useRoomsStore()
const roomDialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const selectedRoom = ref(null)
const roomFormRef = ref(null)

const viewMode = ref('grid')
const search = ref('')
const statusFilter = ref('all')
const floorFilter = ref('all')

const statusOptions = [
    { value: 'all', title: 'Все статусы' },
    { value: 'available', title: 'Свободен' },
    { value: 'reserved', title: 'Забронирован' },
    { value: 'occupied', title: 'Занят' },
    { value: 'maintenance', title: 'Обслуживание' }
]

const floorOptions = computed(() => {
    const floors = new Set(roomsStore.rooms.map(room => room.floor))

    return [
        { title: 'Все этажи', value: 'all' },
        ...Array.from(floors).sort((a, b) => a - b).map(floor => ({ title: `${floor} этаж`, value: floor }))
    ]
})

const filteredRooms = computed(() => {
    const query = search.value.trim().toLowerCase()
    return roomsStore.rooms.filter(room => {
        const matchesSearch = !query || String(room.number).toLowerCase().includes(query)
        const matchesStatus = statusFilter.value === 'all' || room.status === statusFilter.value
        const matchesFloor = floorFilter.value === 'all' || room.floor === floorFilter.value
        return (matchesSearch && matchesStatus && matchesFloor)
    })
})

const openCreateDialog = () => {
    selectedRoom.value = null
    roomDialogOpen.value = true
}

const openEditDialog = (room) => {
    selectedRoom.value = { ...room }
    roomDialogOpen.value = true
}

const openDeleteDialog = (room) => {
    selectedRoom.value = room
    deleteDialogOpen.value = true
}

const handleRoomSubmit = async (roomData) => {
    try {
        if (selectedRoom.value) await roomsStore.editRoom(selectedRoom.value.id, roomData)
        else await roomsStore.addRoom({ ...roomData, createdAt: new Date().toISOString() })
        roomDialogOpen.value = false
        selectedRoom.value = null
    } catch (e) {
        console.error('Не удалось сохранить номер:', e)
    }
}

const handleDeleteRoom = async () => {
    if (!selectedRoom.value) return
    try {
        await roomsStore.removeRoom(selectedRoom.value.id)
        deleteDialogOpen.value = false
        selectedRoom.value = null
    } catch (e) {
        console.error('Не удалось удалить номер:', e)
    }
}

const handleRoomStatusChange = async (room, status) => {
    if (room.status === status) return
    try {
        await roomsStore.updateRoomStatus(room.id, status)
    } catch (e) {
        console.error('Не удалось изменить статус номера:', e)
    }
}

const statistics = computed(() => [
    { label: 'Всего номеров', value: roomsStore.rooms.length, icon: 'mdi-bed-outline', iconClass: 'text-hotel-primary' },
    { label: 'Свободны', value: roomsStore.availableRooms.length, icon: 'mdi-check-circle-outline', iconClass: 'text-hotel-success' },
    { label: 'Заняты', value: roomsStore.occupiedRooms.length, icon: 'mdi-account-check-outline', iconClass: 'text-hotel-danger' },
    { label: 'Забронированы', value: roomsStore.reservedRooms.length, icon: 'mdi-calendar-check-outline', iconClass: 'text-hotel-warning' }
])

onMounted(async () => {
    await roomsStore.loadRooms()
})
</script>