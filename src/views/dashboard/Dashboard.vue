<template>
    <div class="space-y-6">
        <div class="flex items-start justify-between gap-4">
            <div>
                <h1 class="text-2xl font-semibold text-hotel-text-primary">
                    Панель управления
                </h1>

                <p class="mt-2 text-sm text-hotel-text-secondary">
                    Обзор текущего состояния отеля
                </p>
            </div>

            <div class="hidden sm:block">
                <v-btn color="primary" prepend-icon="mdi-calendar-plus">
                    Новое бронирование
                </v-btn>
            </div>
        </div>

        <div v-if="dashboardStore.loading" class="flex min-h-64 items-center justify-center">
            <v-progress-circular indeterminate color="primary" />
        </div>

        <template v-else>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <DashboardStatCard title="Заполняемость" :value="`${dashboardStore.occupancy}%`"
                    description="Занято номеров" icon="mdi-chart-donut" icon-color="text-hotel-primary"
                    icon-background="bg-hotel-primary/10" />

                <DashboardStatCard title="Заезды" :value="dashboardStore.checkIns" description="Сегодня"
                    icon="mdi-login" icon-color="text-hotel-success" icon-background="bg-hotel-success/10" />

                <DashboardStatCard title="Выезды" :value="dashboardStore.checkOuts" description="Сегодня"
                    icon="mdi-logout" icon-color="text-hotel-warning" icon-background="bg-hotel-warning/10" />

                <DashboardStatCard title="Выручка" :value="formattedRevenue" description="Оплаченные платежи"
                    icon="mdi-cash-multiple" icon-color="text-hotel-info" icon-background="bg-hotel-info/10" />
            </div>

            <v-card elevation="0" border class="rounded-hotel-xl">
                <div class="border-b border-hotel-border p-5">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <h2 class="text-lg font-semibold text-hotel-text-primary">
                                Состояние номерного фонда
                            </h2>

                            <p class="mt-1 text-sm text-hotel-text-secondary">
                                Текущее состояние всех номеров
                            </p>
                        </div>

                        <v-btn variant="text" color="primary" append-icon="mdi-arrow-right" :to="{ name: 'rooms' }">
                            Все номера
                        </v-btn>
                    </div>
                </div>

                <div class="p-5">
                    <RoomMap :interactive="false" :rooms="dashboardStore.rooms" @select="handleRoomSelect" />
                </div>
            </v-card>
        </template>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RoomMap from '../../components/rooms/RoomMap.vue';
import { useDashboardStore } from '../../stores/dashboard.store'
import DashboardStatCard from '../../components/dashboard/DashboardStatCard.vue'

const router = useRouter()
const dashboardStore = useDashboardStore()

const formattedRevenue = computed(() => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    }).format(dashboardStore.revenue)
})

const handleRoomSelect = (room) => {
    router.push({
        name: 'rooms',
        query: {
            room: room.id
        }
    })
}

onMounted(() => {
    dashboardStore.loadDashboard()
})
</script>/Dashbo