
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
  { path: '/edital/:id', name: 'edital-detalhes', component: Edital },
  { path: '/footer', component: Footer },
  { path: '/adocao', component: Adocao },   // Público
  { path: '/edital-admin', component: editalAdmin, meta: { requiresAuth: true, role: 'admin' } },    
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Função para verificar se o role tem permissão de admin
function isAdmin(role) {
  if (!role) {
    console.log("🔍 isAdmin: role vazio");
    return false;
  }
  
  console.log("🔍 isAdmin: verificando role:", role, typeof role);
  
  let roleToCheck = role;
  
  // Se for array, pegar primeiro elemento
  if (Array.isArray(role)) {
    roleToCheck = role[0];
    console.log("🔍 isAdmin: role é array, usando:", roleToCheck);
  }
  
  // Se for objeto, extrair valor
  if (typeof roleToCheck === 'object') {
    roleToCheck = roleToCheck.authority || roleToCheck.name || roleToCheck.role;
    console.log("🔍 isAdmin: role é objeto, extraído:", roleToCheck);
  }
  
  const roleString = String(roleToCheck).trim();
  const roleNormalized = roleString.replace('ROLE_', '').toLowerCase();
  
  const isAdminRole = roleNormalized.includes('admin') || 
                      roleNormalized === 'administrator' ||
                      roleString === 'ROLE_ADMINISTRATOR' ||
                      roleString === 'ADMINISTRATOR' ||
                      roleString === 'user_administrador';
  
  console.log("🔍 isAdmin resultado:", isAdminRole, "para role:", roleString);
  return isAdminRole;
}

// Função para verificar se o role tem permissão de usuário
function isUser(role) {
  if (!role) {
    console.log("🔍 isUser: role vazio");
    return false;
  }
  
  console.log("🔍 isUser: verificando role:", role, typeof role);
  
  let roleToCheck = role;
  
  // Se for array, pegar primeiro elemento
  if (Array.isArray(role)) {
    roleToCheck = role[0];
    console.log("🔍 isUser: role é array, usando:", roleToCheck);
  }
  
  // Se for objeto, extrair valor
  if (typeof roleToCheck === 'object') {
    roleToCheck = roleToCheck.authority || roleToCheck.name || roleToCheck.role;
    console.log("🔍 isUser: role é objeto, extraído:", roleToCheck);
  }
  
  const roleString = String(roleToCheck).trim();
  const roleNormalized = roleString.replace('ROLE_', '').toLowerCase();
  
  const isUserRole = roleNormalized.includes('customer') || 
                     roleNormalized.includes('costumer') ||
                     roleNormalized === 'user' ||
                     roleString === 'ROLE_CUSTOMER' ||
                     roleString === 'CUSTOMER' ||
                     roleString === 'user_costumer';
  
  console.log("🔍 isUser resultado:", isUserRole, "para role:", roleString);
  return isUserRole;
}

// ROUTER GUARD APRIMORADO
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log(`🧭 Navegando para: ${to.path}`)
  console.log(`🔑 Token: ${!!token}, Role: ${role}`)

  // Rotas que sempre podem ser acessadas (públicas)
  const publicRoutes = ["/", "/login", "/adocao", "/contato"];
  const isPublicEdital = to.path.startsWith("/edital") && !to.path.includes("admin");

  // Se é rota pública, sempre permite
  if (publicRoutes.includes(to.path) || isPublicEdital) {
    console.log("🌐 Rota pública, permitindo acesso")
    return next();
  }

  // Para rotas protegidas, verificar autenticação
  if (to.meta?.requiresAuth) {
    // Verificar se tem token e role válidos
    if (!token || !role || role === "undefined" || role === "null") {
      console.log("❌ Sem autenticação válida, redirecionando para login")
      console.log(`Token: ${token}, Role: ${role}`);
      return next("/login");
    }

    // Verificar permissões específicas
    if (to.meta.role === 'admin') {
      if (!isAdmin(role)) {
        console.log(`❌ Sem permissão de admin. Role atual: ${role}`)
        return next("/");
      } else {
        console.log(`✅ Acesso admin autorizado para role: ${role}`)
      }
    }

    if (to.meta.role === 'user') {
      if (!isUser(role)) {
        console.log(`❌ Sem permissão de usuário. Role atual: ${role}`)
        return next("/");
      } else {
        console.log(`✅ Acesso usuário autorizado para role: ${role}`)
      }
    }
  }

  console.log("✅ Acesso permitido")
  next();
});

export default router