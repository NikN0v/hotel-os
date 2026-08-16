<template>
    <div class="space-y-6">
        <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div v-for="item in legend" :key="item.status"
                class="flex items-center gap-2 text-sm text-hotel-text-secondary">
                <span class="size-2.5 rounded-full" :class="item.dot" />

                <span>
                    {{ item.label }}
                </span>
            </div>
        </div>

        <div v-for="floor in floors" :key="floor" class="space-y-3">
            <div class="flex items-center gap-3">
                <h3 class="text-sm font-semibold text-hotel-text-primary">
                    {{ floor }} этаж
                </h3>

                <div class="h-px flex-1 bg-hotel-border" />
            </div>

            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                <RoomMapItem v-for="room in roomsByFloor(floor)" :key="room.id" :room="room"
                    @select="handleSelect" @change-status="handleChangeStatus"/>
            </div>
        </div>

        <div v-if="!floors.length"
            class="flex min-h-48 flex-col items-center justify-center rounded-hotel-lg border border-dashed border-hotel-border">
            <v-icon icon="mdi-bed-outline" size="40" class="mb-3 text-hotel-text-muted" />

            <p class="text-sm text-hotel-text-secondary">
                Номера не найдены
            </p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

import RoomMapItem from './RoomMapItem.vue'

const props = defineProps({
    rooms: {type: Array, default: () => []},
    loadingRoomId: {type: [String, Number], default: null},
    interactive: {type: Boolean, default: true}
})

const emit = defineEmits(['select', 'change-status'])

const legend = [
    {
        status: 'available',
        label: 'Свободен',
        dot: 'bg-hotel-success'
    },
    {
        status: 'reserved',
        label: 'Забронирован',
        dot: 'bg-hotel-warning'
    },
    {
        status: 'occupied',
        label: 'Занят',
        dot: 'bg-hotel-danger'
    },
    {
        status: 'maintenance',
        label: 'Обслуживание',
        dot: 'bg-hotel-text-muted'
    }
]

const floors = computed(() => {
    return [...new Set(
        props.rooms.map(room => Number(room.floor))
    )]
        .filter(Boolean)
        .sort((a, b) => a - b)
})

const roomsByFloor = floor => {
    return props.rooms
        .filter(room => Number(room.floor) === floor)
        .sort((a, b) => {
            return Number(a.number) - Number(b.number)
        })
}

const handleSelect = (room) => emit('select', room)

const handleChangeStatus = (room, status) => emit('change-status', room, status)
</script>