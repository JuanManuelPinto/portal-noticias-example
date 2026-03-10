import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'
import PublicPortal from '../views/PublicPortal.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const routes = [
  { path: '/', component: PublicPortal },
  { path: '/login', component: AdminLogin },
  { 
    path: '/admin', 
    component: AdminDashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (to.meta.requiresAuth && !session) {
    next('/login')
  } else {
    next()
  }
})

export default router