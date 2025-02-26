// src/plugins/vuetify.js

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
    // Any Vuetify options here. For example, to set up themes:
    theme: {
        defaultTheme: 'light', // or 'dark'
        themes: {
            light: {
                primary: '#6200ea',
                secondary: '#03dac6',
                accent: '#82b1ff',
                error: '#ff5252',
                info: '#2196f3',
                success: '#4caf50',
                warning: '#ffc107'
            },
            dark: {
                primary: '#6200ea',
                secondary: '#03dac6',
                accent: '#82b1ff',
                error: '#ff5252',
                info: '#2196f3',
                success: '#4caf50',
                warning: '#ffc107'
            },
        },
    }
})
