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
import adocaoAdmin from '../components/admin/adocaoAdmin.vue'
import editalAdmin from '../components/admin/editalAdmin.vue'
import Edital from '@/components/edital.vue'
import EditalNoticias from '@/components/editalNoticias.vue'
import EditalCampanhas from '../components/editalCampanhas.vue'

const routes = [
  // Rotas públicas
  { path: '/', component: Home },
  { path: '/login', component: Login },
  
{ 
  path: '/adocao', 
  name: 'Adocao', 
  component: Adocao  
},

{ path: '/footer', component: Footer },
  
  // Rotas de edital - Notícias e Campanhas
  { 
    path: '/edital/noticias', 
    name: 'edital-noticias', 
    component: EditalNoticias  
  },
  { 
    path: '/edital/campanhas', 
    name: 'edital-campanhas', 
    component: EditalCampanhas  
  },
  
  // Rota para detalhes de uma notícia/campanha específica
  { 
    path: '/edital/:id', 
    name: 'edital-detalhes', 
    component: Edital
  },
  
  // Rotas de admin
  { 
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
{ 
  path: '/edital-adocao', 
  component: adocaoAdmin, 
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

// Guard de navegação
router.beforeEach((to, from, next) => {
  // Rotas públicas
  const publicPaths = ['/', '/login', '/adocao', '/footer'];
  const isPublicEdital = to.path.startsWith('/edital') && !to.path.includes('admin');
  
  if (publicPaths.includes(to.path) || isPublicEdital) {
    return next();
  }

  // Verificar autenticação para rotas protegidas
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (to.meta?.requiresAuth) {
    if (!token || !userRole) {
      console.log('❌ Sem autenticação, redirecionando para login');
      return next('/login');
    }

    if (to.meta.role && userRole !== to.meta.role) {
      console.log(`❌ Role inválida. Usuário: ${userRole}, Necessária: ${to.meta.role}`);
      
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