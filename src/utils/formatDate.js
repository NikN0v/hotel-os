import { format, parseISO, isValid } from "date-fns";
import { ru } from "date-fns/locale";

const normalizeDate = (value) => {
    const date = value instanceof Date ? value : parseISO(value)
    return isValid(date) ? date : null
}

export const formatDate = (value) => {
    const date = normalizeDate(value)
    if (!date) return '-'
    return format(date, 'dd.MM.yyyy', {locale: ru})
}

export const formatDateTime = (value) => {
    const date = normalizeDate(value)
    if (!date) return '-'
    return format(date, 'dd.MM.yyyy, HH:mm', {locale: ru})
}

export const formatLongDate = (value) => {
    const date = normalizeDate(value)
    if (!date) return '-'
    return format(date, 'd MMMM yyyy', {locale: ru})
}