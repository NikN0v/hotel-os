export const RESERVATION_STATUSES = {
    pending: {label: 'Ожидает подтверждения', color: 'warning'},
    confirmed: {label: 'Подтверждено', color: 'info'},
    checked_in: {label: 'Заселён', color: 'success'},
    checked_out: {label: 'Завершено', color: 'secondary'},
    cancelled: {label: 'Отменено', color: 'error'}
}

export const RESERVATION_STATUS_OPTIONS = Object.entries(RESERVATION_STATUSES).map(([value, config]) => ({value, title: config.label, color: config.color}))

export const ROOM_STATUS_BY_RESERVATION_STATUS = {
    pending: 'reserved',
    confirmed: 'reserved',
    checked_in: 'occupied',
    checked_out: 'available',
    cancelled: 'available'
}

export const RESERVATION_STATUS_TRANSITIONS = {
    pending: ['pending', 'confirmed', 'cancelled'],
    confirmed: ['confirmed', 'checked_in', 'cancelled'],
    checked_in: ['checked_in', 'checked_out'],
    checked_out: ['checked_out'],
    cancelled: ['cancelled']
}

export const canChangeReservationStatus = (currentStatus, newStatus) => {
    return RESERVATION_STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false
}