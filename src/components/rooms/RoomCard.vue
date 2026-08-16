<template>
    <v-card elevation="0" border
        class="rounded-hotel-lg transition-colors hover:bg-hotel-surface-hover">
        <div class="p-4">
            <div class="flex items-start justify-between gap-3">
                <div>
                    <div class="text-xl font-semibold text-hotel-text-primary">№{{ room.number }}</div>
                    <div class="mt-1 text-sm text-hotel-text-secondary">{{ roomTypeLabel }}</div>
                </div>

                <v-chip :color="statusColor" size="small" variant="tonal">
                    {{ statusLabel }}
                </v-chip>
            </div>

            <div class="mt-5 space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-hotel-text-secondary">Этаж</span>
                    <span class="text-hotel-text-primary">{{ room.floor }}</span>
                </div>

                <div class="flex justify-between">
                    <span class="text-hotel-text-secondary">Вместимость</span>
                    <span class="text-hotel-text-primary">{{ room.capacity }} чел.</span>
                </div>

                <div class="flex justify-between">
                    <span class="text-hotel-text-secondary">Стоимость</span>
                    <span class="text-hotel-text-primary">{{ formatCurrency(room.price || 0) }}</span>
                </div>
            </div>

            <div class="mt-5 flex justify-end gap-1">
                <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="secondary" aria-label="Редактировать" @click="$emit('edit', room)"/>
                <v-btn icon="mdi-delete-outline" variant="text" size="small" color="error" aria-label="Удалить" @click="$emit('delete', room)"/>
            </div>
        </div>
    </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../../utils/formatCurrency.js'

const props = defineProps({
    room: Object
})

defineEmits(['edit', 'delete'])

const statusLabels = {
    available: 'Свободен',
    reserved: 'Забронирован',
    occupied: 'Занят',
    maintenance: 'Обслуживание'
}

const statusColors = {
    available: 'success',
    reserved: 'warning',
    occupied: 'error',
    maintenance: 'secondary'
}

const typeLabels = {
    standard: 'Стандарт',
    comfort: 'Комфорт',
    deluxe: 'Делюкс',
    suite: 'Люкс'
}

const statusLabel = computed(() => statusLabels[props.room.status] ?? props.room.status)
const statusColor = computed(() => statusColors[props.room.status] ?? 'secondary')
const roomTypeLabel = computed(() => typeLabels[props.room.type] ?? props.room.type)
</script>