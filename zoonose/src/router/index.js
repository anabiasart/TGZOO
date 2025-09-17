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

// ✅ ROTAS CORRIGIDAS - Adicionadas rotas de dashboard que estavam faltando
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  
  // 🔥 ROTAS ADMIN - Adicionadas rotas de dashboard
  { 
    path: '/admin', 
    component: adminHome, 
    meta: { requiresAuth: true, role: 'admin' } 
  },
  { 
    path: '/admin/dashboard', // ⭐ ROTA QUE ESTAVA FALTANDO!
    component: adminHome, 
    meta: { requiresAuth: true, role: 'admin' } 
  },
  
  // 🔥 ROTAS USER - Adicionadas rotas de dashboard  
  { 
    path: '/user', 
    component: userHome, 
    meta: { requiresAuth: true, role: 'user' } 
  },
  { 
    path: '/customer/dashboard', // ⭐ ROTA QUE ESTAVA FALTANDO!
    component: userHome, 
    meta: { requiresAuth: true, role: 'user' } 
  },
  
  // Outras rotas admin
  { path: '/agenda', component: Agendar, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/animal', component: Animal, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/especie', component: Especie, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/protocolo', component: Protocolo, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/atendimento', component: Atendimento, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/edital-admin', component: editalAdmin, meta: { requiresAuth: true, role: 'admin' } },
  
  // Rotas públicas
  { path: '/edital', redirect: '/edital/noticias' },
  { path: '/edital/noticias', name: 'edital', component: Edital },
  { path: '/edital/:id', name: 'edital-detalhes', component: Edital },
  { path: '/footer', component: Footer },
  { path: '/adocao', component: Adocao },
  
  // 🔥 ROTA CATCH-ALL para páginas não encontradas
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/' 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ FUNÇÃO CORRIGIDA - Agora funciona com os roles que seu backend retorna
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
  
  const roleString = String(roleToCheck).trim().toUpperCase();
  
  // ✅ VERIFICAÇÕES MAIS ABRANGENTES
  const adminRoles = [
    'ADMIN',
    'ADMINISTRATOR', 
    'ROLE_ADMIN',
    'ROLE_ADMINISTRATOR',
    'USER_ADMINISTRADOR',
    'ADMINISTRADOR'
  ];
  
  const isAdminRole = adminRoles.some(adminRole => 
    roleString === adminRole || roleString.includes('ADMIN')
  );
  
  console.log("🔍 isAdmin resultado:", isAdminRole, "para role:", roleString);
  return isAdminRole;
}

// ✅ FUNÇÃO CORRIGIDA - Agora funciona com customer/user
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
  }
  
  // Se for objeto, extrair valor
  if (typeof roleToCheck === 'object') {
    roleToCheck = roleToCheck.authority || roleToCheck.name || roleToCheck.role;
  }
  
  const roleString = String(roleToCheck).trim().toUpperCase();
  
  // ✅ VERIFICAÇÕES MAIS ABRANGENTES
  const userRoles = [
    'USER',
    'CUSTOMER',
    'CLIENT',
    'ROLE_USER',
    'ROLE_CUSTOMER', 
    'ROLE_CLIENT',
    'USER_COSTUMER',
    'USER_CUSTOMER',
    'COSTUMER' // Para caso de typo no backend
  ];
  
  const isUserRole = userRoles.some(userRole => 
    roleString === userRole || 
    roleString.includes('CUSTOMER') || 
    roleString.includes('USER')
  );
  
  console.log("🔍 isUser resultado:", isUserRole, "para role:", roleString);
  return isUserRole;
}

// ✅ ROUTER GUARD MELHORADO
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log(`🧭 Navegando de ${from.path} para: ${to.path}`)
  console.log(`🔑 Token: ${!!token}, Role: "${role}" (tipo: ${typeof role})`)

  // Rotas públicas
  const publicRoutes = ["/", "/login", "/adocao", "/contato", "/footer"];
  const isPublicEdital = to.path.startsWith("/edital") && !to.path.includes("admin");

  // Se é rota pública, sempre permite
  if (publicRoutes.includes(to.path) || isPublicEdital) {
    console.log("🌐 Rota pública, permitindo acesso")
    return next();
  }

  // Para rotas protegidas, verificar autenticação
  if (to.meta?.requiresAuth) {
    // Verificar se tem token
    if (!token || token === "null" || token === "undefined") {
      console.log("❌ Token inválido, redirecionando para login")
      console.log(`Token atual: "${token}"`);
      return next("/login");
    }

    // Verificar se tem role
    if (!role || role === "null" || role === "undefined") {
      console.log("❌ Role inválido, redirecionando para login")
      console.log(`Role atual: "${role}"`);
      return next("/login");
    }

    // ✅ VERIFICAÇÃO CORRIGIDA - Agora verifica corretamente os roles
    if (to.meta.role === 'admin') {
      if (!isAdmin(role)) {
        console.log(`❌ Sem permissão de admin. Role atual: "${role}"`)
        console.log(`❌ Redirecionando para home`)
        return next("/");
      } else {
        console.log(`✅ Acesso admin AUTORIZADO para role: "${role}"`)
      }
    }

    if (to.meta.role === 'user') {
      if (!isUser(role)) {
        console.log(`❌ Sem permissão de usuário. Role atual: "${role}"`)
        console.log(`❌ Redirecionando para home`)
        return next("/");
      } else {
        console.log(`✅ Acesso usuário AUTORIZADO para role: "${role}"`)
      }
    }
  }

  console.log(`✅ Navegação permitida para: ${to.path}`)
  next();
});

// ✅ FUNÇÃO AUXILIAR - Determinar redirecionamento correto
export function determinarRedirecionamento(role) {
  console.log("🎯 Determinando redirecionamento para role:", role);
  
  if (!role) {
    console.warn("⚠️ Role não definido, redirecionando para login");
    return "/login";
  }

  // Normalizar role
  const roleString = String(role).trim().toUpperCase();
  console.log("🔄 Role normalizado:", roleString);
  
  // Verificar se é admin
  if (isAdmin(role)) {
    console.log(`📍 Role "${roleString}" é ADMIN → /admin/dashboard`);
    return "/admin/dashboard";
  }
  
  // Verificar se é user/customer
  if (isUser(role)) {
    console.log(`📍 Role "${roleString}" é USER → /customer/dashboard`);
    return "/customer/dashboard";
  }
  
  // Fallback
  console.warn(`⚠️ Role "${roleString}" não reconhecido, usando fallback`);
  
  // Se contém admin no nome, vai para admin
  if (roleString.includes('ADMIN')) {
    console.log(`📍 Fallback: "${roleString}" contém ADMIN → /admin/dashboard`);
    return "/admin/dashboard";
  }
  
  // Senão, vai para user
  console.log(`📍 Fallback: "${roleString}" → /customer/dashboard`);
  return "/customer/dashboard";
}

// ✅ FUNÇÃO DE DEBUG - Use para testar
export function debugAuth() {
  console.log("=== 🔍 DEBUG AUTENTICAÇÃO ===");
  
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const user = localStorage.getItem("user");
  
  console.log("Token:", token ? `${token.substring(0, 30)}...` : "❌ Não encontrado");
  console.log("Role:", `"${role}" (tipo: ${typeof role})`);
  console.log("User:", user ? JSON.parse(user) : "❌ Não encontrado");
  
  console.log("\n--- Verificações ---");
  console.log("É Admin?", isAdmin(role));
  console.log("É User?", isUser(role));
  
  const destino = determinarRedirecionamento(role);
  console.log("Destino calculado:", destino);
  
  console.log("=== 🔍 FIM DEBUG ===");
  
  return { token, role, user, isAdmin: isAdmin(role), isUser: isUser(role), destino };
}

export default router