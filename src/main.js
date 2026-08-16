import { createApp } from 'vue'
import App from './App.vue'

import router, {setupRouterGuards} from './router/index.js'

import './assets/styles/main.scss'
import './styles.css'

import { vuetify } from './plugins/vuetify.js'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth.store.js'
import { useUiStore } from './stores/ui.store.js'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(vuetify)
app.use(router)

const authStore = useAuthStore()
const uiStore = useUiStore()

authStore.restoreAuth()

uiStore.initTheme()

setupRouterGuards(pinia)

app.mount('#app')