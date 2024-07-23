import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 引入我们导出的 router 
import router from "./router"; //添加router



createApp(App).use(router).mount('#app')



//测试
console.log('retdfjg')
