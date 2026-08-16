<template>
    <v-card elevation="0" border class="rounded-hotel-xl">
        <div class="p-5">
            <div class="flex items-center gap-3">
                <div class="flex size-10 shrink-0 items-center justify-center rounded-hotel-md" :class="iconBackground">
                    <v-icon :icon="icon" size="20" :class="iconColor" />
                </div>

                <span class="text-sm font-medium text-hotel-text-secondary">
                    {{ title }}
                </span>
            </div>

            <div class="mt-5">
                <div class="text-2xl font-semibold leading-none text-hotel-text-primary">
                    {{ value }}
                </div>

                <div v-if="description" class="mt-2 text-xs text-hotel-text-muted">
                    {{ description }}
                </div>
            </div>
        </div>
    </v-card>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },

    value: {
        type: [String, Number],
        required: true
    },

    description: {
        type: String,
        default: ''
    },

    icon: {
        type: String,
        required: true
    },

    iconColor: {
        type: String,
        default: 'text-hotel-primary'
    },

    iconBackground: {
        type: String,
        default: 'bg-hotel-primary/10'
    }
})
</script>