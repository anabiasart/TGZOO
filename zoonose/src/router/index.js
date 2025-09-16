
/*criando um router por conta que o tailwind tava bugando o css e nao tava rodando
a logica aqui é que basicamente ele vai ir primeiro no app e depois
aop pressionar login a logica é ele ir para o login.vue */



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
  { path: '/', component: Home },  
  { path: '/login', component: Login },
  { path: '/admin', component: adminHome },
  { path: '/user', component: userHome },
  { path: '/agenda', component: Agendar },
  { path: '/animal', component: Animal },
  { path: '/especie', component: Especie},
  { path: '/protocolo', component: Protocolo },
  { path: '/atendimento', component: Atendimento },

     {path: '/edital',
    redirect: { name: 'edital/1' } 
  },
  {
    path: '/edital/noticias',
    name: 'edital',
    component: Edital 
  },
  { path: '/footer', component: Footer },
  { path: '/adocao', component: Adocao },
{ path: '/edital-admin', component: editalAdmin },    

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Rotas públicas
  const publicRoutes = ["/", "/login", "/adocao", "/contato"];
  const isPublicEdital = to.path.startsWith("/edital");

  // Se não tiver token e não for rota pública → manda pro login
  if (!token && !publicRoutes.includes(to.path) && !isPublicEdital) {
    return next("/login");
  }

  // 🔹 Se já estiver logado e tentar ir para /login → redireciona para sua home correta
  if (token && to.path === "/login") {
    if (role === "ADMINISTRATOR" || role === "user_administrador") {
      return next("/admin");
    } else if (role === "CUSTOMER" || role === "user_costumer") {
      return next("/user");
    } else {
      return next("/");
    }
  }

  // 🔹 Proteção de rotas administrativas
  if (to.path.startsWith("/admin") && !(role === "ADMINISTRATOR" || role === "user_administrador")) {
    return next("/user");
  }

  // 🔹 Proteção de rotas de usuário comum
  if (to.path.startsWith("/user") && !(role === "CUSTOMER" || role === "user_costumer")) {
    return next("/admin");
  }

  next();
});

export default router
