import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.min.css' // Handling the layout and appearance of the webpage to adapt with different screen sizez (mobile, tablet, desktop)
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Provides interactive components such as modals, dropdowns, tooltips and carousels to function.

import { createPinia } from 'pinia'
import router from './router'

createApp(App)
    .use(createPinia())
    .use(router)
    .mount('#app')
