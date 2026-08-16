<template>
    <v-form ref="formRef" @submit.prevent="submit">
        <div class="space-y-4">
            <v-text-field v-model="form.number" label="Номер" :rules="[rules.required]"/>

            <div class="grid grid-cols-2 gap-4">
                <v-select v-model="form.floor" label="Этаж" :items="floors" :rules="[rules.required]"/>
                <v-select v-model="form.type" label="Тип номера" :items="roomTypes" item-title="label" item-value="value" :rules="[rules.required]"/>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <v-text-field v-model.number="form.capacity" label="Вместимость" type="number" min="1" :rules="[rules.required, rules.positive]"/>
                <v-text-field v-model.number="form.price" label="Стоимость за ночь" type="number" min="0" suffix="₽" :rules="[rules.required, rules.positive]"/>
            </div>

            <v-select v-model="form.status" label="Статус" :items="roomStatuses" item-title="label" item-value="value" :rules="[rules.required]"/>

            <v-textarea v-model="form.description" label="Описание" rows="3" auto-grow/>
        </div>
    </v-form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';

const props = defineProps({modelValue: Object})
const emit = defineEmits(['update:modelValue', 'submit'])

const formRef = ref(null)
const form = reactive({number: '', floor: 1, type: 'standard', capacity: 2, price: 0, status: 'available', description: ''})
const floors = [1, 2, 3, 4, 5]

const roomTypes = [
    {label: 'Стандарт', value: 'standard'},
    {label: 'Комфорт', value: 'comfort'},
    {label: 'Делюкс', value: 'deluxe'},
    {label: 'Люкс', value: 'suite'}
]

const roomStatuses = [
    {label: 'Свободен', value: 'available'},
    {label: 'Забронирован', value: 'reserved'},
    {label: 'Занят', value: 'occupied'},
    {label: 'На обслуживании', value: 'maintenance'}
]

const rules = {
    required: value => Boolean(value) || 'Поле обязательно',
    positive: value => Number(value) > 0 || 'Значение должно быть больше нуля'
}

const submit = async () => {
    const result = await formRef.value?.validate()
    if (!result.valid) return
    emit('submit', {...form})
}

watch(() => props.modelValue, (value) => {
    if (!value) {
        Object.assign(form, {
            number: '', floor: 1, type: 'standard', capacity: 2, price: 0, status: 'available', description: ''
        })
        return
    }

    Object.assign(form, {
        number: value.number ?? '',
        floor: value.floor ?? 1,
        type: value.type ?? 'standard',
        capacity: value.capacity ?? 2,
        price: value.price ?? 0,
        status: value.status ?? 'available',
        description: value.description ?? ''
    })
}, {immediate: true})

defineExpose({submit, form, validate: () => formRef.value?.validate()})
</script>