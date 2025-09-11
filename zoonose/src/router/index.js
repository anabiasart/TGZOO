
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

const routes = [
  { path: '/', component: Home },   // Home vai ser a página inicial
  { path: '/login', component: Login },
  { path: '/admin', component: adminHome },
  { path: '/user', component: userHome },
  { path: '/agenda', component: Agendar },
  { path: '/animal', component: Animal },
  { path: '/especie', component: Especie},
  { path: '/protocolo', component: Protocolo },
  { path: '/atendimento', component: Atendimento },

  { path: '/edital',name: 'Edital',
  component: () => import('../components/edital.vue')
},
  { path: '/footer', component: Footer },
  { path: '/adocao', component: Adocao },
    

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
