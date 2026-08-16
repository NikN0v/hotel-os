<template>
    <div class="space-y-6">
        <div class="flex items-start justify-between gap-4">
            <div>
                <h1 class="text-2xl font-semibold text-hotel-text-primary">{{ title }}</h1>
                <p v-if="description" class="mt-2 text-sm text-hotel-text-secondary">{{ description }}</p>
            </div>

            <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
                <slot name="actions" />
            </div>
        </div>

        <slot>
            <v-card elevation="0" border class="rounded-hotel-xl">
                <div class="text-center">
                    <v-icon :icon="icon" size="48" class="mb-4 text-hotel-text-muted" />
                    <p class="text-sm text-hotel-text-secondary">Раздел находится в разработке</p>
                </div>
            </v-card>
        </slot>
    </div>
</template>

<script setup>
defineProps({
    title: { type: String, required: true }, description: String, icon: { type: String, default: 'mdi-tools' }
})
</script>