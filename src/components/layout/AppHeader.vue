<template>
    <header class="fixed top-0 right-0 z-(--hotel-z-header) flex h-(--hotel-header-height) items-center border-b border-hotel-border bg-hotel-surface transition-[left] duration-300"
        :class="uiStore.sidebarCollapsed ? 'left-(--hotel-sidebar-collapsed-width)' : 'left-(--hotel-sidebar-width)'">
        <div class="flex w-full items-center justify-between px-6">
            <button type="button" class="flex size-10 items-center justify-center rounded-hotel-md text-hotel-text-secondary hover:bg-hotel-surface-hover lg:hidden" @click="uiStore.openMobileSidebar">
                <v-icon icon="mdi-menu"/>
            </button>

            <div class="hidden lg:block">
                <h1 class="text-lg font-semibold text-hotel-text-primary">Панель управления</h1>
            </div>

            <div class="ml-auto flex items-center gap-2">
                <ThemeSwitcher/>
                <v-divider vertical class="mx-2"/>
                <button type="button" class="flex items-center gap-3 rounded-hotel-md bg-hotel-surface p-1.5 pr-3 transition-colors hover:bg-hotel-surface-hover">
                    <v-avatar size="36" color="primary">
                        <span class="text-sm font-semibold ">A</span>
                    </v-avatar>

                    <div class="hidden text-left sm:block">
                        <div class="text-sm font-medium text-hotel-text-primary">Администратор</div>
                        <div class="text-xs text-hotel-text-muted">Администратор</div>
                    </div>

                    <v-icon icon="mdi-chevron-down" size="18" class="text-hotel-text-muted"/>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth.store";
import { useUiStore } from "../../stores/ui.store";
import ThemeSwitcher from "./ThemeSwitcher.vue";

const router = useRouter()
const uiStore = useUiStore()
const authStore = useAuthStore()

const handleLogout = () => {
    authStore.logout()
    router.push({name: 'login'})
}
</script>