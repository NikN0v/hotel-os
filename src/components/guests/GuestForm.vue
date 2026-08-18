<template>
    <v-form ref="formRef" @submit.prevent="handleSubmit">
        <div class="space-y-5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <v-text-field v-model="form.fullName" label="ФИО" prepend-inner-icon="mdi-account-outline" :rules="[requiredRule]" :disabled="loading"/>
                <v-text-field v-model="form.phone" label="Телефон" prepend-inner-icon="mdi-phone-outline" :rules="[requiredRule]" :disabled="loading"/>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <v-text-field v-model="form.email" type="email" label="Email" prepend-inner-icon="mdi-email-outline" :rules="[emailRule]" :disabled="loading"/>
                <v-text-field v-model="form.document" label="Документ" prepend-inner-icon="mdi-card-account-details-outline" :disabled="loading"/>
            </div>

            <v-textarea v-model="form.comment" label="Комментарий" rows="3" auto-grow prepend-inner-icon="mdi-text-box-outline" :disabled="loading"/>
        </div>

        <div class="mt-6 flex justify-end gap-3">
            <v-btn type="button" variant="text" color="secondary" :disabled="loading" @click="emit('cancel')">Отмена</v-btn>
            <v-btn type="submit" color="primary" :loading="loading">{{ isEdit ? 'Сохранить' : 'Добавить гостя' }}</v-btn>
        </div>
    </v-form>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';

const props = defineProps({
    guest: Object, loading: Boolean
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const createInitialForm = () => ({
    fullName: '',
    phone: '',
    email: '',
    document: '',
    comment: ''
})

const form = reactive(createInitialForm())
const isEdit = computed(() => Boolean(props.guest))
const requiredRule = value => Boolean(value?.trim()) || 'Поле обязательно'
const emailRule = value => {
    if (!value) return true
    return (
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Введите корректный email'
    )
}

const fillForm = guest => Object.assign(form, createInitialForm(), guest ?? {})

const resetForm = () => {
    Object.assign(form, createInitialForm())
    formRef.value?.resetValidation()
}

const handleSubmit = async () => {
    const result = await formRef.value?.validate()
    if (!result?.valid) return
    emit('submit', {...form})
}

watch(() => props.guest, guest => fillForm(guest), {immediate: true})

defineExpose({resetForm})
</script>