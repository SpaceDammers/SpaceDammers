import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import socket from './socket'

import './assets/scss/globals.scss';

const app = createApp(App)
app.config.globalProperties.$socket = socket;
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
