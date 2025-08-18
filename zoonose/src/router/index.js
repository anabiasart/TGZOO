
/*criando um router por conta que o tailwind tava bugando o css e nao tava rodando
a logica aqui é que basicamente ele vai ir primeiro no app e depois
aop pressionar login a logica é ele ir para o login.vue */



import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/home.vue'
import Login from '../components/login.vue'
import adminHome from '../components/admin/adminHome.vue'
import userHome from '../components/user/userHome.vue'
import Agendar from '../components/admin/Agenda.vue'


const routes = [
  { path: '/', component: Home },   // Home vai ser a página inicial
  { path: '/login', component: Login },
  { path: '/admin', component: adminHome },
  { path: '/user', component: userHome },
  { path: '/agenda', component: Agendar },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
