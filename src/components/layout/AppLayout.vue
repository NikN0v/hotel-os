<template>
    <div class="min-h-screen bg-hotel-bg">
        <AppSidebar/>

        <AppHeader/>

        <main class="min-h-screen pt-(--hotel-header-height) transition-[padding-left] duration-300" :class="uiStore.sidebarCollapsed ? 'pl-(--hotel-sidebar-collapsed-width)' : 'pl-(--hotel-sidebar-width)'">
            <div class="p-6">
                <slot/>
            </div>
        </main>
    </div>
</template>

<script setup>
import { useUiStore } from "../../stores/ui.store";
import AppHeader from "./AppHeader.vue";
import AppSidebar from "./AppSidebar.vue";

const uiStore = useUiStore()
</script>