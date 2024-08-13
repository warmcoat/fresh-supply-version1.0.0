import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 引入我们导出的 router
import router from './router' //添加router
import 'amfe-flexible'
import 'normalize.css'
import './assets/common.scss'
import lazyPlugin from './directives/lazyLoading'
import { createPinia } from 'pinia'

const app = createApp(App)

const pinia = createPinia()

app.use(lazyPlugin)
app.use(router)
app.use(pinia)

app.mount('#app')
