<template>
    <v-dialog v-model="isOpen" :max-width="width" :persistent="persistent" scrollable>
        <v-card class="rounded-hotel-xl">
            <div class="flex items-start justify-between gap-4 border-b border-hotel-border px-6 py-5">
                <div class="flex min-w-0 items-center gap-3">
                    <div v-if="icon" class="flex size-10 shrink-0 items-center justify-center rounded-hotel-md bg-hotel-primary-light">
                        <v-icon :icon="icon" size="21" color="primary"/>
                    </div>

                    <div class="min-w-0">
                        <h2 class="text-lg font-semibold text-hotel-text-primary">{{ title }}</h2>
                        <p v-if="subtitle" class="mt-1 text-sm text-hotel-text-secondary">{{ subtitle }}</p>
                    </div>
                </div>

                <v-btn icon="mdi-close" variant="text" size="small" color="secondary" :disabled="loading" @click="close"/>
            </div>

            <v-card-text class="pa-6">
                <slot/>
            </v-card-text>

            <div v-if="$slots.actions" class="flex items-center justify-end gap-2 border-t border-hotel-border px-6 py-4">
                <slot name="actions"/>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: Boolean, title: String, subtitle: String, icon: String, width: {type: [String, Number], default: 560}, loading: Boolean, persistent: Boolean
})

const emit = defineEmits(['update:modelValue', 'close'])

const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const close = () => {
    if (props.loading) return
    emit('update:modelValue', false)
    emit('close')
}
</script>