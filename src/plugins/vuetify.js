import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { ru } from 'vuetify/locale'

const lightTheme = {
  dark: false,

  colors: {
    background: '#F1F5F9',
    surface: '#FFFFFF',
    'surface-variant': '#F8FAFC',

    primary: '#2563EB',
    secondary: '#64748B',

    success: '#16A34A',
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#0284C7',

    'on-background': '#0F172A',
    'on-surface': '#0F172A'
  }
}

const darkTheme = {
  dark: true,

  colors: {
    background: '#0F172A',
    surface: '#1E293B',
    'surface-variant': '#273449',

    primary: '#60A5FA',
    secondary: '#94A3B8',

    success: '#22C55E',
    warning: '#FBBF24',
    error: '#EF4444',
    info: '#38BDF8',

    'on-background': '#F8FAFC',
    'on-surface': '#F8FAFC'
  }
}

export const vuetify = createVuetify({
    theme: {
        defaultTheme: 'light',
        themes: {
            light: lightTheme,
            dark: darkTheme
        }
    },
    
    locale: {
        locale: 'ru',
        messages: {
            ru
        }
    },

    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {mdi}
    },

    defaults: {
        VTextField: {
            variant: 'outlined',
            density: 'comfortable',
            hideDetails: 'auto'
        },

        VTextarea: {
            variant: 'outlined',
            density: 'comfortable',
            hideDetails: 'auto'
        },

        VSelect: {
            variant: 'outlined',
            density: 'comfortable',
            hideDetails: 'auto'
        },

        VAutoComplete: {
            variant: 'outlined',
            density: 'comfortable',
            hideDetails: 'auto'
        },

        VBtn: {
            rounded: 'md'
        },

        VCard: {
            rounded: 'xl'
        }
    }
})