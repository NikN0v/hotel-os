<template>
  <AuthForm title="Добро пожаловать" subtitle="Войдите в панель управления HotelOS" submit-text="Войти"
    :loading="loading" :error="error" @submit="handleLogin" @back="handleBack">
    <v-text-field v-model="form.email" label="Email" type="email" autocomplete="email"
      prepend-inner-icon="mdi-email-outline" :rules="emailRules" />

    <v-text-field v-model="form.password" label="Пароль" :type="showPassword ? 'text' : 'password'"
      autocomplete="current-password" prepend-inner-icon="mdi-lock-outline"
      :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
      @click:append-inner="showPassword = !showPassword" :rules="passwordRules" />

    <template #footer>
      <span class="text-hotel-text-secondary">
        Нет аккаунта?
      </span>

      <RouterLink to="/auth/register" class="ml-1 font-medium text-primary hover:underline">
        Зарегистрироваться
      </RouterLink>
    </template>
  </AuthForm>
</template>

<script setup>
import AuthForm from '../../components/auth/AuthForm.vue';
import { loginUser } from '../../api/auth.api';
import { useAuthStore } from '../../stores/auth.store';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const authStore = useAuthStore()
const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const emailRules = [
  (value) => {
    if (!value) return 'Введите email'
    return (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Введите корректный email')
  }
]

const passwordRules = [
  (value) => {
    if (!value) return 'Введите пароль'
    return (
      value.length >= 6 || 'Пароль должен содержать минимум 6 символов'
    )
  }
]

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const res = await loginUser(form.email, form.password)
    authStore.saveAuth(res)
    await router.push({name: 'dashboard'})
  } catch (e) {
    error.value = e.response?.data?.message || 'Не удалось выполнить вход'
  } finally {
    loading.value = false
  }
}

const handleBack = () => router.push('/')
</script>