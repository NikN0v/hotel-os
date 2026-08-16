<template>
    <BaseDialog v-model="isOpen" :title="title" :subtitle="message" :icon="icon" :width="420" :loading="loading">
        <template #actions>
            <v-btn variant="text" :disabled="loading" @click="close">
                Отмена
            </v-btn>

            <v-btn :color="confirmColor" :loading="loading" @click="confirm">
                {{ confirmText }}
            </v-btn>
        </template>
    </BaseDialog>
</template>

<script setup>
import { computed } from 'vue';
import BaseDialog from './BaseDialog.vue';

const props = defineProps({
    title: {type: String, default: 'Подтверждение'}, modelValue: String, message: String, icon: {type: String, default: 'mdi-alert-circle-outline'},
    confirmText: {type: String, default: 'Подтвердить'}, confirmColor: {type: String, default: 'error'}, loading: Boolean
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const close = () => {
    if (props.loading) return
    isOpen.value = false
}

const confirm = () => {
    emit('confirm')
}
</script>