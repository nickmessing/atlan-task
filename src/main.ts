import { createApp } from 'vue'

import Root from './Root.vue'
import router from './router'
import monacoTheme from './monacoTheme'

import './assets/main.scss'

const app = createApp(Root)

app.use(router)

app.mount('#app')
