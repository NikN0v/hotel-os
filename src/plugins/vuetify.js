import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import { ru } from 'vuetify/locale'

export const vuetify = createVuetify({
    locale: {
        locale: 'ru',
        messages: {
            ru
        }
    }
})