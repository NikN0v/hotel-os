<template>
    <v-form ref="formRef" @submit.prevent="handleSubmit">
        <div class="space-y-5">
            <v-autocomplete v-model="form.guest_id" label="Гость" :items="guests" item-title="fullName" item-value="id" prepend-inner-icon="mdi-account-outline" :rules="[requiredRule]" :disabled="loading"/>

            <v-select v-model="form.room_id" label="Номер" :items="availableRooms" item-title="number" item-value="id" prepend-inner-icon="mdi-bed-outline" :rules="[requiredRule]" :disabled="loading"/>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <v-text-field v-model="form.checkIn" label="Дата заезда" type="date" prepend-inner-icon="mdi-calendar-arrow-right" :rules="[requiredRule]" :disabled="loading"/>
                <v-text-field v-model="form.checkOut" label="Дата выезда" type="date" prepend-inner-icon="mdi-calendar-arrow-left" :rules="[requiredRule, checkoutDateRule]" :disabled="loading"/>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <v-text-field v-model="form.guests" label="Количество гостей" type="number" min="1" prepend-inner-icon="mdi-account-group-outline" :rules="[requiredRule, guestsRule]" :disabled="loading"/>
                <v-text-field v-model="form.price" label="Стоимость" type="number" min="0" prepend-inner-icon="mdi-cash" suffix="₽" :rules="[requiredRule, priceRule]" :disabled="loading"/>
            </div>

            <v-textarea v-model="form.comment" label="Комментарий" rows="3" auto-grow :disabled="loading"/>
        </div>

        <div class="mt-6 flex justify-end gap-3">
            <v-btn type="button" variant="text" color="secondary" :disabled="loading" @click="emit('cancel')">Отмена</v-btn>
            <v-btn type="submit" color="primary" :loading="loading">{{ isEdit ? 'Сохранить' : 'Создать бронирование' }}</v-btn>
        </div>
    </v-form>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';

const props = defineProps({
    reservation: Object, guests: Array, rooms: Array, loading: Boolean
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)

const createInitialForm = () => ({
    guest_id: null,
    room_id: null,
    checkIn: '',
    checkOut: '',
    guests: 1,
    status: 'pending',
    price: 0,
    comment: ''
})

const form = reactive(createInitialForm())

const isEdit = computed(() => Boolean(props.reservation))

const availableRooms = computed(() => {
    return props.rooms.filter(room => {
        if (props.reservation && room.id === props.reservation.room_id) return true
        return room.status === 'available'
    })
})

const requiredRule = value => Boolean(value) || 'Поле обязательно'
const guestsRule = value => Number(value) >= 1 || 'Минимум один гость'
const priceRule = value => Number(value) >= 0 || 'Стоимость не может быть отрицательной'
const checkoutDateRule = value => {
    if (!value || !form.checkIn) return true
    return (
        value > form.checkIn || 'Дата выезда должна быть позже заезда'
    )
}

const fillForm = reservation => Object.assign(form, createInitialForm(), reservation ?? {})
const resetForm = () => {
    Object.assign(form, createInitialForm())
    formRef.value?.resetValidation()
}

const handleSubmit = async () => {
    const result = await formRef.value?.validate()
    if (!result?.valid) return
    emit('submit', {...form})
}

watch(() => props.reservation, reservation => {
    fillForm(reservation)
}, {immediate: true})

defineExpose({resetForm})
</script>