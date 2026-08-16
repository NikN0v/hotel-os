<template>
    <nav class="flex flex-col gap-1">
        <v-tooltip v-for="item in navigation" :key="item.id" :disabled="!uiStore.sidebarCollapsed" location="right">
            <template #activator="{props}">
                <RouterLink v-bind="props" :to="item.to"
                    class="group flex h-11 items-center rounded-hotel-md text-sm font-medium text-hotel-text-secondary transition-colors hover:bg-hotel-surface-hover hover:text-hotel-text-primary"
                    :class="uiStore.sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'" active-class="bg-hotel-primary-light text-hotel-primary" @click="handleNavigation">
                    <v-icon :icon="item.icon" size="20" class="shrink-0" />
                    <span v-if="!uiStore.sidebarCollapsed" class="truncate">{{ item.label }}</span>
                </RouterLink>
            </template>
            <span class="text-hotel-text-secondary">{{ item.label }}</span>
        </v-tooltip>
    </nav>
</template>

<script setup>
import { useUiStore } from '../../stores/ui.store';

const uiStore = useUiStore()

const navigation = [
    {
        id: 'dashboard',
        label: 'Главная',
        to: {name: 'dashboard'},
        icon: 'mdi-view-dashboard-outline'
    },
    {
        id: 'rooms',
        label: 'Номера',
        to: {name: 'rooms'},
        icon: 'mdi-bed-outline'
    },
    {
        id: 'reservations',
        label: 'Бронирования',
        to: {name: 'reservations'},
        icon: 'mdi-calendar-check-outline'
    },
    {
        id: 'guests',
        label: 'Гости',
        to: {name: 'guests'},
        icon: 'mdi-account-group-outline'
    },
    {
        id: 'calendar',
        label: 'Календарь',
        to: {name: 'calendar'},
        icon: 'mdi-calendar-month-outline'
    },
    {
        id: 'payments',
        label: 'Платежи',
        to: {name: 'payments'},
        icon: 'mdi-credit-card-outline'
    },
    {
        id: 'reports',
        label: 'Отчёты',
        to: {name: 'reports'},
        icon: 'mdi-chart-box-outline'
    }
]

const handleNavigation = () => uiStore.closeMobileSidebar()
</script>