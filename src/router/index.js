import { useAuthStore } from '../stores/auth.store.js';
import AuthLayout from '../layouts/AuthLayout.vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/auth',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import('../views/auth/Login.vue'),
                meta: {
                    guestOnly: true,
                    title: 'Вход'
                }
            },
            {
                path: 'register',
                name: 'register',
                component: () => import('../views/auth/Register.vue'),
                meta: {
                    guestOnly: true,
                    title: 'Регистрация'
                }
            }
        ]
    },
    {
        path: '/',
        component: DefaultLayout,
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('../views/dashboard/Dashboard.vue'),
                meta: {
                    title: 'Панель управления'
                }
            },
            {
                path: 'rooms',
                name: 'rooms',
                component: () => import('../views/rooms/Rooms.vue'),
                meta: {
                    title: 'Номера'
                }
            },
            {
                path: 'reservations',
                name: 'reservations',
                component: () => import('../views/reservations/Reservations.vue'),
                meta: {
                    title: 'Бронирования'
                }
            },
            {
                path: 'guests',
                name: 'guests',
                component: () => import('../views/guests/Guests.vue'),
                meta: {
                    title: 'Гости'
                }
            },
            {
                path: 'calendar',
                name: 'calendar',
                component: () => import('../views/calendar/Calendar.vue'),
                meta: {
                    title: 'Календарь'
                }
            },
            {
                path: 'payments',
                name: 'payments',
                component: () => import('../views/payments/Payments.vue'),
                meta: {
                    title: 'Платежи'
                }
            },
            {
                path: 'reports',
                name: 'reports',
                component: () => import('../views/reports/Reports.vue'),
                meta: {
                    title: 'Отчёты'
                }
            },
            {
                path: 'settings',
                name: 'settings',
                component: () => import('../views/settings/Settings.vue'),
                meta: {
                    title: 'Настройки'
                }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,

    scrollBehavior() {
        return {
            top: 0,
            left: 0
        }
    }
})

export const setupRouterGuards = (pinia) => {
    router.beforeEach(async (to) => {
        const authStore = useAuthStore(pinia)

        if (!authStore.initialized) {
            await authStore.restoreAuth()
        }

        if (to.meta.requiresAuth && !authStore.isAuth) {
            return {
                name: 'login',
                query: {
                    redirect: to.fullPath
                }
            }
        }

        if (to.meta.guestOnly && authStore.isAuth) {
            return {
                name: 'dashboard'
            }
        }

        return true
    })
}

export default router