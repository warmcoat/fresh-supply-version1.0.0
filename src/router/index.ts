import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
 
import TabsView from '../views/TabsView.vue'
import HomeVue from '../views/tabs/home/HomeVue.vue'
import OrderView from '../views/tabs/order/OrderView.vue'
import MeView from '../views/tabs/me/MeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/home',

        },
        {
            path: '/tabs',
            name: 'tabs',
            component: TabsView,
            children: [
                { name: 'home', path: '/home', component: HomeVue},
                { name: 'order', path: '/order', component: OrderView},
                { name: 'me', path: '/me', component: MeView}
            ]
        }
    ]
})


export default router

