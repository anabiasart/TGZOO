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

const routes = [
  // Rotas públicas
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/adocao', component: Adocao },
  { path: '/footer', component: Footer },
  
  // Rotas de edital
  { path: '/edital', redirect: '/edital/noticias' },
  { path: '/edital/noticias', name: 'edital', component: Edital },
  { path: '/edital/:id', name: 'edital-detalhes', component: Edital },
  
  // Rotas de admin
  { 
    //usando o requires para ele depender de ser autenticado
    path: '/admin', 
    component: adminHome, 
    meta: { requiresAuth: true, role: 'ROLE_ADMINISTRATOR' } 
  },
  { 
    path: '/agenda', 
    component: Agendar, 
    meta: { requiresAuth: true, role: 'ROLE_ADMINISTRATOR' } 
  },
  { 
    path: '/animal', 
    component: Animal, 
    meta: { requiresAuth: true, role: 'ROLE_ADMINISTRATOR' } 
  },
  { 
    path: '/especie', 
    component: Especie, 
    meta: { requiresAuth: true, role: 'ROLE_ADMINISTRATOR' } 
  },
  { 
    path: '/protocolo', 
    component: Protocolo, 
    meta: { requiresAuth: true, role: 'ROLE_ADMINISTRATOR' } 
  },
  { 
    path: '/atendimento', 
    component: Atendimento, 
    meta: { requiresAuth: true, role: 'ROLE_ADMINISTRATOR' } 
  },
  { 
    path: '/edital-admin', 
    component: editalAdmin, 
    meta: { requiresAuth: true, role: 'ROLE_ADMINISTRATOR' } 
  },
  
  // Rotas de usuário
  { 
    path: '/user', 
    component: userHome, 
    meta: { requiresAuth: true, role: 'ROLE_CUSTOMER' } 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


// Guard de navegação simplificado
router.beforeEach((to, from, next) => {
  // Rotas públicas
  const publicPaths = ['/', '/login', '/adocao', '/footer'];
  const isPublicEdital = to.path.startsWith('/edital') && !to.path.includes('admin');//editais sao publicos exceto se tiver admin no path
  
  if (publicPaths.includes(to.path) || isPublicEdital) {
    return next();
  }

  // Verificar autenticação para rotas protegidas
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  //debug
  console.log(`🔍 Token: ${token ? 'Presente' : 'Ausente'}`);
  console.log(`🔍 Role do usuário: ${userRole}`);
  console.log(`🔍 Role necessária: ${to.meta?.role}`);

  if (to.meta?.requiresAuth) {
    // Sem autenticação
    if (!token || !userRole) {
      console.log('❌ Sem autenticação, redirecionando para login');
      return next('/login');
    }

    // Verificar se a role do usuário corresponde à role necessária
    if (to.meta.role && userRole !== to.meta.role) {
      console.log(`❌ Role inválida. Usuário: ${userRole}, Necessária: ${to.meta.role}`);
      
      // Redirecionar para a página correta baseada na role do usuário
      if (userRole === 'ROLE_ADMINISTRATOR') {
        console.log('🔄 Redirecionando admin para /admin');
        return next('/admin');
      } else if (userRole === 'ROLE_CUSTOMER') {
        console.log('🔄 Redirecionando customer para /user');
        return next('/user');
      } else {
        console.log('🔄 Role desconhecida, redirecionando para login');
        return next('/login');
      }
    }
  }

  console.log('✅ Acesso permitido');
  next();
});
export default router