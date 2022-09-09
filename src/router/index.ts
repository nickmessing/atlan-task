import { createRouter, createWebHistory, RouterView } from 'vue-router'

import Home from '@/views/Home.vue'
import CreateDB from '@/views/CreateDB.vue'
import { defineComponent } from 'vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/db',
      name: 'db',
      component: RouterView,
      children: [
        {
          path: 'new',
          name: 'new',
          component: CreateDB,
        },
      ],
    },
  ],
})

export default router
