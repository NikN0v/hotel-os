<template>
    <div class="relative flex min-h-32 flex-col rounded-hotel-lg border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        :class="[
            statusClasses.border,
            statusClasses.background
        ]">
        <div class="flex items-start justify-between gap-2">
            <button type="button" class="min-w-0 text-left bg-transparent" @click="$emit('select', room)">
                <div class="text-lg font-semibold text-hotel-text-primary">
                    №{{ room.number }}
                </div>

                <div class="mt-1 text-xs text-hotel-text-secondary">
                    {{ roomTypeLabel }}
                </div>
            </button>

            <span class="mt-1 size-3 shrink-0 rounded-full" :class="statusClasses.dot"/>
        </div>

        <div class="mt-auto flex items-end justify-between gap-2 pt-5">
            <div class="text-xs text-hotel-text-muted">
                {{ room.capacity }} чел.
            </div>

            <v-menu v-if="interactive" location="bottom end">
                <template #activator="{ props: menuProps }">
                    <v-btn v-bind="menuProps" size="small" variant="text" :color="statusClasses.vuetifyColor"
                        :loading="loading" class="px-2!">
                        {{ statusLabel }}
                        <v-icon icon="mdi-chevron-down" size="16" class="ml-1" />
                    </v-btn>
                </template>

                <v-list density="compact">
                    <v-list-item v-for="status in statuses" :key="status.value"
                        :disabled="status.value === room.status || loading"
                        @click="$emit('change-status', room, status.value)">
                        <template #prepend>
                            <span class="mr-3 size-2.5 rounded-full" :class="status.dot" />
                        </template>

                        <v-list-item-title>
                            {{ status.label }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    room: {
        type: Object,
        required: true
    },

    loading: {
        type: Boolean,
        default: false
    },
    interactive: {type: Boolean, default: true}
})

defineEmits([
    'select',
    'change-status'
])

const statuses = [
    {
        value: 'available',
        label: 'Свободен',
        dot: 'bg-hotel-success'
    },
    {
        value: 'reserved',
        label: 'Забронирован',
        dot: 'bg-hotel-warning'
    },
    {
        value: 'occupied',
        label: 'Занят',
        dot: 'bg-hotel-danger'
    },
    {
        value: 'maintenance',
        label: 'Обслуживание',
        dot: 'bg-hotel-text-muted'
    }
]

const statusConfig = {
    available: {
        label: 'Свободен',
        border: 'border-hotel-success/40',
        background: 'bg-hotel-success/5',
        dot: 'bg-hotel-success',
        text: 'text-hotel-success',
        vuetifyColor: 'success'
    },

    reserved: {
        label: 'Забронирован',
        border: 'border-hotel-warning/40',
        background: 'bg-hotel-warning/5',
        dot: 'bg-hotel-warning',
        text: 'text-hotel-warning',
        vuetifyColor: 'warning'
    },

    occupied: {
        label: 'Занят',
        border: 'border-hotel-danger/40',
        background: 'bg-hotel-danger/5',
        dot: 'bg-hotel-danger',
        text: 'text-hotel-danger',
        vuetifyColor: 'error'
    },

    maintenance: {
        label: 'Обслуживание',
        border: 'border-hotel-border',
        background: 'bg-hotel-surface-secondary',
        dot: 'bg-hotel-text-muted',
        text: 'text-hotel-text-secondary',
        vuetifyColor: 'secondary'
    }
}

const typeLabels = {
    standard: 'Стандарт',
    comfort: 'Комфорт',
    deluxe: 'Делюкс',
    suite: 'Люкс'
}

const config = computed(() => {
    return statusConfig[props.room.status] ?? statusConfig.maintenance
})

const statusClasses = computed(() => ({
    border: config.value.border,
    background: config.value.background,
    dot: config.value.dot,
    text: config.value.text,
    vuetifyColor: config.value.vuetifyColor
}))

const statusLabel = computed(() => {
    return config.value.label
})

const roomTypeLabel = computed(() => {
    return typeLabels[props.room.type] ?? props.room.type
})
</script>