<template>
  <AuthForm
    title="Создание аккаунта"
    subtitle="Зарегистрируйтесь для работы с HotelOS"
    submit-text="Создать аккаунт"
    :loading="loading"
    :error="error"
    @submit="handleRegister"
    @back="handleBack"
  >
  <v-text-field label="Тест" variant="outlined"/>  
  
  <v-text-field
      v-model="form.name"
      label="Имя"
      autocomplete="name"
      prepend-inner-icon="mdi-account-outline"
      :rules="nameRules"
    />

    <v-text-field
      v-model="form.email"
      label="Email"
      type="email"
      autocomplete="email"
      prepend-inner-icon="mdi-email-outline"
      :rules="emailRules"
    />

    <v-text-field
      v-model="form.password"
      label="Пароль"
      :type="showPassword ? 'text' : 'password'"
      autocomplete="new-password"
      prepend-inner-icon="mdi-lock-outline"
      :append-inner-icon="
        showPassword
          ? 'mdi-eye-off-outline'
          : 'mdi-eye-outline'
      "
      :rules="passwordRules"
      @click:append-inner="showPassword = !showPassword"
    />

    <v-text-field
      v-model="form.passwordConfirm"
      label="Повторите пароль"
      :type="
        showPasswordConfirm
          ? 'text'
          : 'password'
      "
      autocomplete="new-password"
      prepend-inner-icon="mdi-lock-check-outline"
      :append-inner-icon="
        showPasswordConfirm
          ? 'mdi-eye-off-outline'
          : 'mdi-eye-outline'
      "
      :rules="passwordConfirmRules"
      @click:append-inner="
        showPasswordConfirm = !showPasswordConfirm
      "
    />

    <!-- Footer -->
    <template #footer>
      <span class="text-hotel-text-secondary">
        Уже есть аккаунт?
      </span>

      <RouterLink
        to="/auth/login"
        class="
          ml-1
          font-medium
          text-primary
          hover:underline
        "
      >
        Войти
      </RouterLink>
    </template>
  </AuthForm>
</template>

<script setup>
import AuthForm from '../../components/auth/AuthForm.vue';
import { registerUser } from '../../api/auth.api';
import { useAuthStore } from '../../stores/auth.store';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({name: '', email: '', password: '', passwordConfirm: ''})

const loading = ref(false)
const error = ref('')

const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const nameRules = [
  (value) => {
    if (!value?.trim()) {
      return 'Введите имя'
    }

    return (
      value.trim().length >= 2 ||
      'Имя должно содержать минимум 2 символа'
    )
  }
]

const emailRules = [
  (value) => {
    if (!value) {
      return 'Введите email'
    }

    return (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
      'Введите корректный email'
    )
  }
]

const passwordRules = [
  (value) => {
    if (!value) {
      return 'Введите пароль'
    }

    return (
      value.length >= 6 ||
      'Пароль должен содержать минимум 6 символов'
    )
  }
]

const passwordConfirmRules = [
  (value) => {
    if (!value) {
      return 'Повторите пароль'
    }

    return (
      value === form.password ||
      'Пароли не совпадают'
    )
  }
]

const handleRegister = async () => {
    error.value = ''
    if (!form.name || !form.email || !form.password) {
        error.value = 'Заполните все поля'
        return
    }
    loading.value = true

    try {
        const user = {
            ...form,
            avatar: '',
            currency: 'RUB',
            theme: 'dark',
            createdAt: new Date().toISOString()
        }

        const res = await registerUser(user)
        authStore.saveAuth(res)
        await router.push({name: 'dashboard'})
    } catch (e) {
        error.value = e.response?.data?.message || 'Не удалось создать аккаунт'
    } finally {
        loading.value = false
    }
}

const handleBack = () => {
  router.push('/')
}
</script>