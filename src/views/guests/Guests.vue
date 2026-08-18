<template>
    <PagePlaceholder title="Гости" description="Управление гостями отеля" icon="mdi-account-group-outline">
        <template #actions>
            <v-btn color="primary" prepend-icon="mdi-account-plus-outline" @click="openCreateDialog">Новый гость</v-btn>
        </template>

        <div class="space-y-6">
            <v-card elevation="0" border class="rounded-hotel-xl">
                <div class="p-5">
                    <v-text-field v-model="search" label="Поиск" prepend-inner-icon="mdi-magnify" clearable/>
                </div>
            </v-card>

            <v-card elevation="0" border class="rounded-hotel-xl">
                <v-data-table :headers="headers" :items="filteredGuests" :loading="guestsStore.loading" item-value="id" hover class="bg-transparent">
                    <template v-slot:item.fullName="{item}">
                        <div class="flex items-center gap-3">
                            <v-avatar size="38" color="primary">
                                <span class="text-sm font-semibold">{{ getInitials(item.fullName) }}</span>
                            </v-avatar>

                            <div>
                                <div class="font-medium text-hotel-text-primary">{{ item.fullName }}</div>
                                <div v-if="item.comment" class="mt-0.5 text-xs text-hotel-text-muted">{{ item.comment }}</div>
                            </div>
                        </div>
                    </template>

                    <template v-slot:item.phone="{item}">
                        <span class="text-hotel-text-secondary">
                            {{ item.phone || '-' }}
                        </span>
                    </template>

                    <template v-slot:item.email="{item}">
                        <span class="text-hotel-text-secondary">
                            {{ item.email || '-' }}
                        </span>
                    </template>

                    <template v-slot:item.document="{item}">
                        <span class="text-hotel-text-secondary">
                            {{ item.document || '-' }}
                        </span>
                    </template>

                    <template v-slot:item.actions="{item}">
                        <div class="flex items-center justify-end gap-1">
                            <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="secondary" @click="openEditDialog(item)"/>
                            <v-btn icon="mdi-delete-outline" variant="text" size="small" color="error" @click="openDeleteDialog(item)"/>
                        </div>
                    </template>

                    <template #no-data>
                        <div class="flex min-h-48 flex-col items-center justify-center">
                            <v-icon icon="mdi-account-off-outline" size="48" class="mb-4 text-hotel-text-muted"/>
                            <p class="text-sm text-hotel-text-secondary">Гости не найдены</p>
                        </div>
                    </template>
                </v-data-table>
            </v-card>
        </div>

        <BaseDialog v-model="guestDialog" :title="dialogTitle" :subtitle="dialogSubtitle" icon="mdi-account-outline" :loading="saving" :persistent="saving">
            <GuestForm :guest="editingGuest" :loading="saving" @submit="handleGuestSubmit" @cancel="closeGuestDialog"/>
        </BaseDialog>

        <ConfirmDialog v-model="deleteDialog" title="Удалить гостя?" :message="guestToDelete ? `Гость ${guestToDelete?.fullName || ''} будет удален. Это действие нельзя отменить.` : ''"
            icon="mdi-delete-outline" confirm-text="Удалить" confirm-color="error" :loading="deleting" @confirm="handleDelete"/>
    </PagePlaceholder>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import PagePlaceholder from '../../components/ui/PagePlaceholder.vue';
import { useGuestsStore } from '../../stores/guests.store.js';
import BaseDialog from '../../components/ui/BaseDialog.vue';
import GuestForm from '../../components/guests/GuestForm.vue';
import ConfirmDialog from '../../components/ui/ConfirmDialog.vue';

const guestsStore = useGuestsStore()
const search = ref('')
const guestDialog = ref(false)
const editingGuest = ref(null)
const deleteDialog = ref(false)
const guestToDelete = ref(null)
const saving = ref(false)
const deleting = ref(false)

const headers = [
    {title: 'Гость', key: 'fullName', sortable: true},
    {title: 'Телефон', key: 'phone', sortable: false},
    {title: 'Email', key: 'email', sortable: false},
    {title: 'Документ', key: 'document', sortable: false},
    {title: '', key: 'actions', sortable: false, align: 'end'}
]

const filteredGuests = computed(() => {
    const value = search.value.trim().toLowerCase()
    if (!value) return guestsStore.guests
    return guestsStore.guests.filter(guest => {
        return [
            guest.fullName,
            guest.phone,
            guest.email,
            guest.document
        ]
            .filter(Boolean)
            .some(field => String(field).toLowerCase().includes(value))
    })
})

const dialogTitle = computed(() => editingGuest.value ? 'Редактирование гостя' : 'Новый гость')
const dialogSubtitle = computed(() => editingGuest.value ? 'Измените данные гостя' : 'Заполните данные нового гостя')

const getInitials = fullName => {
    if (!fullName) return '?'
    return fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(name => name[0])
        .join('')
        .toUpperCase()
}

const openCreateDialog = () => {
    editingGuest.value = null
    guestDialog.value = true
}

const openEditDialog = guest => {
    editingGuest.value = {...guest}
    guestDialog.value = true
}

const closeGuestDialog = () => {
    guestDialog.value = false
    editingGuest.value = null
}

const handleGuestSubmit = async guest => {
    saving.value = true
    try {
        if (editingGuest.value) await guestsStore.editGuest(editingGuest.value.id, guest)
        else await guestsStore.addGuest(guest)
        closeGuestDialog()
    } catch (error) {
        console.error('Не удалось сохранить гостя:', error)
    } finally {
        saving.value = false
    }
}

const openDeleteDialog = guest => {
    guestToDelete.value = guest
    deleteDialog.value = true
}

const handleDelete = async () => {
    if (!guestToDelete.value) return
    deleting.value = true
    try {
        await guestsStore.removeGuest(guestToDelete.value.id)
        deleteDialog.value = false
        guestToDelete.value = null
    } catch (error) {
        console.error('Не удалось удалить гостя:', error)
    } finally {
        deleting.value = false
    }
}

onMounted(async () => {
    await guestsStore.loadGuests()
})
</script>