import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/scss/variables.scss';
import './assets/scss/globals.scss';

const app = createApp(App)

app.use(router)

app.mount('#app')
