<template>
    <button type="button" class="flex size-10 items-center justify-center rounded-full text-hotel-text-secondary bg-hotel-surface transition-colors hover:bg-hotel-surface-hover hover:text-hotel-text-primary"
        :title="uiStore.theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'" @click="uiStore.toggleTheme">
        <v-icon :icon="uiStore.theme === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night'" size="20"/>
    </button>
</template>

<script setup>
import { useUiStore } from "../../stores/ui.store";

const uiStore = useUiStore()
</script>