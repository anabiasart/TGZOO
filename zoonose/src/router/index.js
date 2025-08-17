
/*criando um router por conta que o tailwind tava bugando o css e nao tava rodando
a logica aqui é que basicamente ele vai ir primeiro no app e depois
aop pressionar login a logica é ele ir para o login.vue */



import { createRouter, createWebHistory } from 'vue-router'
import home from '../components/home.vue'
import login from '../components/login.vue'

const routes = [
  { path: '/', component: home },   // Home vai ser a página inicial
  { path: '/login', component: login }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
