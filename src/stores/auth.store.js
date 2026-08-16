import { defineStore } from "pinia"
import { computed, ref } from "vue"

const TOKEN_KEY = 'hotel_token'
const USER_KEY = 'hotel_user'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(null)
    const loading = ref(false)
    const initialized = ref(false)

    const isAuth = computed(() => Boolean(token.value && user.value))

    const saveAuth = (authData) => {
        token.value = authData.token
        user.value = authData.data

        localStorage.setItem(TOKEN_KEY, authData.token)
        localStorage.setItem(USER_KEY, JSON.stringify(authData.data))
    }

    const restoreAuth = () => {
        const storedToken = localStorage.getItem(TOKEN_KEY)
        const storedUser = localStorage.getItem(USER_KEY)

        if (!storedToken || !storedUser) {
            initialized.value = true
            return
        }

        try {
            token.value = storedToken
            user.value = JSON.parse(storedUser)
            return true
        } catch {
            clearAuth()
        }
        initialized.value = true
    }

    const clearAuth = () => {
        token.value = null
        user.value = null

        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
    }

    const logout = () => {
        clearAuth()
    }

    return {
        user, token, loading, isAuth, initialized,
        saveAuth, restoreAuth, clearAuth, logout
    }
})