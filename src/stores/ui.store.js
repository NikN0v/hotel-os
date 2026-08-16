import { defineStore } from "pinia"
import { ref } from "vue"
import { vuetify } from "../plugins/vuetify"

const THEME_KEY = 'hotel_theme'
const SIDEBAR_KEY = 'hotel_sidebar_collapsed'

export const useUiStore = defineStore('ui', () => {
    const theme = ref(localStorage.getItem(THEME_KEY) || 'dark')
    const sidebarCollapsed = ref(localStorage.getItem(SIDEBAR_KEY) === 'true')

    const mobileSidebarOpen = ref(false)

    const setTheme = (value) => {
        theme.value = value
        document.documentElement.dataset.theme = value
        vuetify.theme.global.name.value = value
        localStorage.setItem(THEME_KEY, value)
    }

    const toggleTheme = () => setTheme(theme.value === 'light' ? 'dark' : 'light')

    const toggleSidebar = () => {
        sidebarCollapsed.value = !sidebarCollapsed.value
        localStorage.setItem(SIDEBAR_KEY, String(sidebarCollapsed.value))
    }

    const openMobileSidebar = () => mobileSidebarOpen.value = true
    const closeMobileSidebar = () => mobileSidebarOpen.value = false

    const initTheme = () => {
        document.documentElement.dataset.theme = theme.value
    }

    setTheme(theme.value)

    return {
        theme, sidebarCollapsed, mobileSidebarOpen,
        setTheme, initTheme, toggleSidebar, toggleTheme, openMobileSidebar, closeMobileSidebar
    }
})