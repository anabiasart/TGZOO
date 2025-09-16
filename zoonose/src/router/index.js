// ROUTER CONFIGURADO PARA HOME.VUE SEMPRE PRIMEIRO

import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/home.vue'
import Login from '../components/login.vue'
import adminHome from '../components/admin/adminHome.vue'
import userHome from '../components/user/userHome.vue'
import Agendar from '../components/admin/Agenda.vue'
import Animal from '../components/admin/Animal.vue'
import Especie from '../components/admin/Especie.vue'
import Protocolo from '../components/admin/Protocolo.vue'
import Atendimento from '../components/admin/Atendimento.vue'
import Footer from '../components/footer.vue'
import Adocao from '../components/adocao.vue'
import editalAdmin from '../components/admin/editalAdmin.vue'
import Edital from '@/components/edital.vue'

import api from "@/services/api";

export const getUsers = () => api.get("/users");
export const createUser = (user) => api.post("/users", user);

const routes = [
  { path: '/', component: Home },        // Home sempre acessível
  { path: '/login', component: Login },   // Login sempre acessível
  { path: '/admin', component: adminHome, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/user', component: userHome, meta: { requiresAuth: true, role: 'user' } },
  { path: '/agenda', component: Agendar, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/animal', component: Animal, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/especie', component: Especie, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/protocolo', component: Protocolo, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/atendimento', component: Atendimento, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/edital', redirect: '/edital/noticias' },
  { path: '/edital/noticias', name: 'edital', component: Edital },
  { path: '/footer', component: Footer },
  { path: '/adocao', component: Adocao },   // Público
  { path: '/edital-admin', component: editalAdmin, meta: { requiresAuth: true, role: 'admin' } },    
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ROUTER GUARD SIMPLIFICADO
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log(`Navegando para: ${to.path}`)
  console.log(`Token: ${!!token}, Role: ${role}`)

  // Rotas que sempre podem ser acessadas (públicas)
  const publicRoutes = ["/", "/login", "/adocao", "/contato"];
  const isPublicEdital = to.path.startsWith("/edital") && !to.path.includes("admin");

  // Se é rota pública, sempre permite
  if (publicRoutes.includes(to.path) || isPublicEdital) {
    console.log("Rota pública, permitindo acesso")
    return next();
  }

  // Para rotas protegidas, verificar autenticação
  if (to.meta?.requiresAuth) {
    if (!token || !role || role === "undefined") {
      console.log("Sem autenticação, redirecionando para login")
      return next("/login");
    }

    // Verificar permissões baseadas no role
    if (to.meta.role === 'admin') {
      if (!(role === "ADMINISTRATOR" || role === "user_administrador")) {
        console.log("Sem permissão de admin")
        return next("/");
      }
    }

    if (to.meta.role === 'user') {
      if (!(role === "CUSTOMER" || role === "user_costumer")) {
        console.log("Sem permissão de usuário")
        return next("/");
      }
    }
  }

  console.log("Acesso permitido")
  next();
});

export default router