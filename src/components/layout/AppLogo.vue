<template>
    <div class="flex h-12 items-center gap-3 overflow-hidden px-3">
        <div class="flex size-9 shrink-0 items-center justify-center rounded-hotel-md bg-hotel-primary text-white">
            <v-icon icon="mdi-office-building-outline" size="22"/>
        </div>
        
        <transition name="fade">
            <div v-if="!uiStore.sidebarCollapsed" class="whitespace-nowrap">
                <div class="text-base font-bold text-hotel-text-primary">
                    HotelOS
                </div>

                <div class="text-xs text-hotel-text-muted">
                    Управление отелем
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { useUiStore } from '../../stores/ui.store';

const uiStore = useUiStore()
</script>