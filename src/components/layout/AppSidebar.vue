<template>
    <aside class="fixed inset-y-0 left-0 z-(--hotel-z-sidebar) flex flex-col border-r border-hotel-border bg-hotel-surface transition-[width,transform] duration-300"
        :class="[uiStore.sidebarCollapsed ? 'lg:w-(--hotel-sidebar-collapsed-width)' : 'lg:w-(--hotel-sidebar-width)', 'w-(--hotel-sidebar-width)',
            uiStore.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
        <div class="flex h-(--hotel-header-height) shrink-0 items-center border-r border-hotel-border" :class="uiStore.sidebarCollapsed ? 'justify-center px-2' : 'px-3'">
            <AppLogo/>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto p-3">
            <AppNavigation/>
        </div>

        <div class="hidden border-t border-hotel-border p-3 lg:block">
            <div class="flex flex-col gap-1">
                <RouterLink :to="{name: 'settings'}" class="group flex h-11 items-center rounded-hotel-md text-sm font-medium text-hotel-text-secondary transition-colors hover:bg-hotel-surface-hover hover:text-hotel-text-primary"
                    :class="uiStore.sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'" active-class="bg-hotel-primary-light text-hotel-primary">
                    <v-icon icon="mdi-cog-outline" class="shrink-0"/>
                    <span v-if="!uiStore.sidebarCollapsed" class="truncate">Настройки</span>
                </RouterLink>

                <button type="button" @click="openLogoutDialog"
                    class="group flex h-10 w-full items-center rounded-hotel-md text-sm font-medium text-hotel-text-secondary bg-hotel-surface transition-colors hover:bg-hotel-surface-hover hover:text-hotel-text-primary"
                        :class="uiStore.sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'">
                    <v-icon icon="mdi-logout" size="20" class="shrink-0"/>
                    <span v-if="!uiStore.sidebarCollapsed" class="truncate">Выйти</span>
                </button>

                <button type="button" @click="uiStore.toggleSidebar"
                    class="flex h-10 w-full items-center justify-center rounded-hotel-md text-hotel-text-muted bg-hotel-surface transition-colors hover:bg-hotel-surface-hover hover:text-hotel-text-primary"
                        :aria-label="uiStore.sidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'">
                    <v-icon :icon="uiStore.sidebarCollapsed ? 'mdi-chevron-right' : 'mdi-chevron-left'"/>
                </button>
            </div>
        </div>
    </aside>

    <Transition name="fade">
        <div v-if="uiStore.mobileSidebarOpen" @click="uiStore.closeMobileSidebar" class="fixed inset-0 z-[calc(var(--hotel-z-sidebar)-1)] bg-black/40 lg:hidden"/>
    </Transition>

    <v-dialog v-model="logoutDialog" max-width="420">
        <v-card class="p-5">
            <v-card-title>Выйти из аккаунта?</v-card-title>
            <v-card-text>Вы действительно хотите завершить текущую сессию?</v-card-text>
            <v-card-actions class="px-6 pb-5">
                <v-spacer/>
                <v-btn variant="text" @click="logoutDialog = false">
                    Отмена
                </v-btn>
                <v-btn color="error" variant="flat" @click="handleLogout">
                    Выйти
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUiStore } from "../../stores/ui.store";
import AppLogo from "./AppLogo.vue";
import AppNavigation from "./AppNavigation.vue";
import { useAuthStore } from "../../stores/auth.store";
import { ref } from "vue";

const router = useRouter()
const uiStore = useUiStore()
const authStore = useAuthStore()
const logoutDialog = ref(false)

const openLogoutDialog = () => {
    logoutDialog.value = true
}

const handleLogout = () => {
    uiStore.closeMobileSidebar()
    authStore.logout()
    router.push({name: 'login'})
}
</script>