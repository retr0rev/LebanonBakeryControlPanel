import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Products from '@/views/Products.vue'
import Inventory from '@/views/Inventory.vue'
import Sales from '@/views/Sales.vue'
import Workers from '@/views/Workers.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: Dashboard },
    { path: '/products', name: 'products', component: Products },
    { path: '/inventory', name: 'inventory', component: Inventory },
    { path: '/sales', name: 'sales', component: Sales },
    { path: '/workers', name: 'workers', component: Workers },
  ],
})

export default router
