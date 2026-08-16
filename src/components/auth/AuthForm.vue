<template>
    <div class="w-full">
        <div class="mb-8 text-center">
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-hotel-primary/10">
                <v-icon icon="mdi-bed-outline" size="30" color="primary"/>
            </div>

            <h1 class="text-2xl font-bold tracking-tight text-hotel-text-primary">{{ title }}</h1>
            <p class="mt-2 text-sm text-hotel-text-secondary">{{ subtitle }}</p>
        </div>

        <v-card elevation="0" border class="pa-6 sm:pa-8">
            <v-alert v-if="error" type="error" variant="tonal" density="comfortable" class="mb-5">
                {{ error }}
            </v-alert>

            <v-form ref="formRef" @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <slot/>

                    <v-btn type="submit" color="primary" size="large" block :loading="loading">
                        {{ submitText }}
                    </v-btn>
                </div>
            </v-form>

            <div v-if="$slots.footer" class="mt-6 border-t border-hotel-border pt-5 text-center text-sm">
                <slot name="footer"/>
            </div>
        </v-card>

        <div class="mt-6 text-center">
            <v-btn variant="text" size="small" prepend-icon="mdi-arrow-left" color="secondary" @click="emit('back')">
                На главную
            </v-btn>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
    title: {type: String, required: true}, subtitle: {type: String, required: true}, submitText: {type: String, required: true},
    loading: Boolean, error: String
})

const emit = defineEmits(['submit', 'back'])

const formRef = ref(null)

const handleSubmit = async () => {
    const result = await formRef.value?.validate()
    if (!result?.valid) return
    emit('submit')
}

defineExpose({formRef})
</script>