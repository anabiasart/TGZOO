<script setup>
import { formatDataBR, formatHoraBR } from '@/utils/datetime'

import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Syringe, User, Calendar } from 'lucide-vue-next'
import vete from "../assets/img/vete.jpg"
import pata from "../assets/img/pata.jpg"
import zoo from "../assets/img/zoo.png"
import { useEditais } from "@/data/editaisData.js"

const { todosItens: todasNoticias, carregarTodos: carregarNoticias } = useEditais()

const noticias = ref([])
const router = useRouter()
const menuAberto = ref(false)

const campanhasAtivasDropdown = computed(() => {
  return todasNoticias.value
    .filter(i => i.tipo === 'campanha')
    .slice(0, 10)
})

const noticiasDropdown = computed(() => {
  return todasNoticias.value
    .filter(i => i.tipo === 'noticia')
    .slice(0, 10)
})


onMounted(async () => {
  try {
    await carregarNoticias()
  } catch (erro) {
    console.error('Erro ao carregar notícias:', erro)
  }
})
function getTitulo(item) {
  if (item.tipo === 'campanha') {
    return item.nomeCampanha || item.titulo
  }
  return item.nomeNoticia || item.titulo
}

function getImagem(item) {
  if (item.tipo === 'campanha') {
    return item.urlImagem || vete
  }
  return item.urlImagemNoticia || item.imagem || vete
}

function getResumo(item) {
  if (item.tipo === 'campanha') {
    let texto = `${item.dataInicioCampanha || ''} até ${item.dataFimCampanha || ''}`
    if (item.horarioCampanha) {
      texto += ` - ${item.horarioCampanha}`
    }
    return cortarTexto(texto, 80)
  }
  return cortarTexto(item.resumo || '', 80)
}

// Função para cortar texto
function cortarTexto(texto, limite) {
  if (!texto) return '' 
  texto = texto.replace(/\s+/g, ' ').trim()
  if (texto.length <= limite) return texto
  const cortado = texto.slice(0, limite + 1)
  const ultimoEspaco = cortado.lastIndexOf(' ')
  if (ultimoEspaco <= 0) return texto.slice(0, limite) + '…'
  return cortado.slice(0, ultimoEspaco) + '…'
}



watch(todasNoticias, () => {
  noticias.value = todasNoticias.value
    .slice(0, 4)
    .map(n => ({
      id: n.id,
      tipo: n.tipo,
      titulo: getTitulo(n),
      resumo: getResumo(n),
      imagem: getImagem(n),
      badge: n.tipo === 'campanha' ? ' Campanha' : ' Notícia'
    }))
})

function fecharMenu() {
  if (window.innerWidth > 768) menuAberto.value = false
}
onMounted(() => window.addEventListener('resize', fecharMenu))
onUnmounted(() => window.removeEventListener('resize', fecharMenu))

const imagens = ref([
  { src: vete, texto: "Cuide do seu pet com amor e vacinas." },
  { src: pata, texto: "Adote um amigo e ganhe um companheiro fiel." }
])
const indexAtual = ref(0)
let intervalo
function proximo() { indexAtual.value = (indexAtual.value + 1) % imagens.value.length }
function anterior() { indexAtual.value = (indexAtual.value - 1 + imagens.value.length) % imagens.value.length }
onMounted(() => { intervalo = setInterval(proximo, 4000) })
onUnmounted(() => clearInterval(intervalo))

const servicos = [
  { titulo: "Vacine o seu Pet", desc: "Garanta a saúde dos seus amigos peludos...", label: "CONSULTAR", icon: Syringe, acao: () => router.push('/edital') },
  { titulo: "Faça login", desc: "Receba dicas dos nossos veterinários...", label: "LOGIN", icon: User, acao: () => router.push('/login') },
  { titulo: "Agende uma Consulta", desc: "Receba atendimento especializado...", label: "AGENDAR", icon: Calendar, acao: () => router.push('/login') }
]

// FAQ
const faq = ref([
  { pergunta: "Como faço para cadastrar meu pet?", resposta: "Basta acessar a área de login, criar sua conta e cadastrar os dados do seu pet.", aberto: false },
  { pergunta: "As vacinas são gratuitas?", resposta: "Sim, as campanhas de vacinação promovidas pela prefeitura são gratuitas.", aberto: false },
  { pergunta: "Onde acontecem os mutirões de adoção?", resposta: "Normalmente na Praça Central ou no Centro Veterinário Municipal. Confira no edital.", aberto: false }
])
function toggleFaq(index) { faq.value[index].aberto = !faq.value[index].aberto }
</script>

<template>
<nav class="navbar">
  <div class="navbar-logo" @click="router.push('/')">
    <img :src="zoo" alt="ZoonoSys Logo" class="logo" />
  </div>

<ul class="navbar-links">
  
  <li @click="router.push('/')">Início</li>

  <!-- NOTÍCIAS -->
  <li class="relative group">
    <span class="cursor-pointer">Notícias</span>

    <ul
      class="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-md opacity-0 invisible
             group-hover:opacity-100 group-hover:visible transition-all duration-200
             transform group-hover:translate-y-1 z-50">

      <li v-for="n in noticiasDropdown" :key="n.id">
        <span
          class="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
          @click="router.push(`/edital/${n.id}`)"
        >
          {{ n.nomeNoticia || n.titulo }}
        </span>
      </li>
    </ul>
  </li>

  <!-- CAMPANHAS -->
  <li class="relative group">
    <span class="cursor-pointer">Campanhas</span>

    <ul
      class="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-md opacity-0 invisible
             group-hover:opacity-100 group-hover:visible transition-all duration-200
             transform group-hover:translate-y-1 z-50">

      <li v-for="c in campanhasAtivasDropdown" :key="c.id">
        <span
          class="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
          @click="router.push(`/edital/${c.id}`)"
        >
          {{ c.nomeCampanha || c.titulo }}
        </span>
      </li>

      <li v-if="campanhasAtivasDropdown.length === 0"
          class="px-4 py-2 text-gray-500 text-sm">
        Nenhuma campanha ativa
      </li>
    </ul>
  </li>

  <li @click="router.push('/login')">Login</li>
  <li @click="router.push('/edital/adocao')">Adote um Amigo</li>
</ul>

  <button class="navbar-toggle" @click="menuAberto = !menuAberto">☰</button>

  <ul v-if="menuAberto" class="navbar-mobile">
    <li @click="router.push('/')">Início</li>
    <li @click="router.push('/edital/noticias')">Notícias</li> 
    <li @click="router.push('/edital/campanhas')">Campanhas</li>
    <li @click="router.push('/login')">Login</li>
    <li @click="router.push('/contato')">Contato</li>
  </ul>
</nav>

<div class="carrossel-container">
  <img :src="imagens[indexAtual].src" alt="Carrossel" />
  <transition name="fade" mode="out-in">
    <div class="carrossel-texto" :key="indexAtual">
      <h2>{{ imagens[indexAtual].texto }}</h2>
    </div>
  </transition>
  <button class="btn-prev" @click="anterior">‹</button>
  <button class="btn-next" @click="proximo">›</button>
</div>

<div class="home-page">
  <div class="content">
    <div class="template2">
      <main class="col-central">
        <section class="noticias">
          <h3 class="titulo">  Últimas Notícias & Campanhas</h3>
          <div class="lista-noticias">
            <div v-for="n in noticias" :key="n.id" class="card-noticia">
              <div class="card-badge">
                <span :class="n.tipo === 'campanha' ? 'badge-campanha' : 'badge-noticia'">
                  {{ n.badge }}
                </span>
              </div>
              <img :src="n.imagem" :alt="n.titulo" />
              <div class="conteudo">
                <h4>{{ n.titulo }}</h4>
                <p>{{ n.resumo }}</p>
                <button class="btn-leia" @click="router.push(`/edital/${n.id}`)">
                  Leia mais ›
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <aside class="col-esquerda">
        <section class="texto-zoonoses">
          <h2>Sobre as Zoonoses</h2>
          <p>
            Zoonoses são doenças que podem ser transmitidas de animais para humanos.
            É fundamental a vacinação e os cuidados veterinários para prevenir esses riscos.
          </p>
        </section>

        <div v-for="(s, i) in servicos" :key="i" class="service">
          <component :is="s.icon" class="icon"/>
          <h3>{{ s.titulo }}</h3>
          <p>{{ s.desc }}</p>
          <button class="btn-action" @click="s.acao">{{ s.label }}</button>
        </div>

        <section class="faq">
          <h3>Dúvidas Frequentes</h3>
          <div v-for="(item, i) in faq" :key="i" class="faq-item">
            <button class="faq-question" @click="toggleFaq(i)">
              {{ item.pergunta }}
              <span>{{ item.aberto ? '−' : '+' }}</span>
            </button>
            <p v-if="item.aberto" class="faq-answer">{{ item.resposta }}</p>
          </div>
        </section>
      </aside>
    </div>
  </div>
</div>
</template>

<style>
.home-page {
  margin: 0;
  display: flex;
  flex-direction: column; 
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd); 
}

.content {
  flex: 1; 
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  width: 100%;
  margin-top: 70px;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  backdrop-filter: blur(10px);
  background: rgba(255,255,255,0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 6rem;
  box-shadow: 0 5px 10px rgba(0,0,0,0.08);
  z-index: 100;
}

.navbar-logo {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.navbar-logo .logo {
  height: 150px;
  width: auto;
  transition: transform 0.3s ease;
}

.navbar-logo .logo:hover {
  transform: scale(1.05);
}

.navbar-links {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.navbar-links li {
  cursor: pointer;
  font-weight: 500;
  color: #333;
  transition: all 0.2s ease;
}

.navbar-links li:hover {
  color: #0ea5e9;
  transform: translateY(-2px);
}

.navbar-toggle {
  display: none;
  background: transparent;
  color: #0ea5e9;
  font-size: 28px;
  border: none;
  cursor: pointer;
}

.navbar-mobile {
  position: absolute;
  top: 70px;
  right: 0;
  background: white;
  color: #333;
  width: 220px;
  list-style: none;
  padding: 12px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.navbar-mobile li {
  padding: 14px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.navbar-mobile li:hover {
  background: #f1f5f9;
}

@media (max-width: 768px) {
  .navbar-links { display: none; }
  .navbar-toggle { display: block; }
}

.template2 {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-auto-rows: auto; 
  gap: 20px;
  width: 100%;
  align-items: start;
}

@media (max-width: 1024px) {
  .template2 {
    grid-template-columns: 1fr;
  }
}

.col-esquerda {
  display: flex;          
  flex-direction: column;  
  gap: 65px;
  grid-column: 1;
  grid-row: 1;   
  align-self: start;      
  height: 100%;
}

.col-central {
  grid-column: 2 / 4;
}

.service {
  background: linear-gradient(135deg, #d1fae5, #a5f3fc);
  padding: 50px;
  border-radius: 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 10px rgba(0,0,0,0.2);
}

.icon {
  width: 56px;
  height: 56px;
  margin-bottom: 12px;
  color: #1e40af;
}

.service h3 {
  font-size: 40px;
  margin: 10px 0;
}

.service p {
  font-size: 18px;
  color: #555;
}

.btn-action {
  background: linear-gradient(135deg, #1e40af, #a5f3fc, #93c5fd); 
  color: #1e40af;
  padding: 8px 14px;
  margin-top: 10px;
  border-radius: 9999px;
  font-size: 20px;
  transition: transform 0.2s ease;
}

.btn-action:hover {
  transform: scale(1.05);
}

.texto-zoonoses {
  background: white;
  padding: 15px;
  font-size: 1.3rem;
  border-radius: 16px;
  margin-bottom: 40px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}

.texto-zoonoses h2 {
  font-size: 1.55rem;
  font-weight: 600;
  color: #0ea5e9;
  margin-bottom: 10px;
}

.titulo {
  font-size: 1.75rem;
  font-weight: bold;
  color: #0ea5e9;
  margin-bottom: 20px;
}

.lista-noticias {
  display: grid;
  gap: 30px;
}

.card-noticia {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.card-noticia:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

.card-badge span {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 600;
  display: inline-block;
}

.badge-campanha {
  background: #dbeafe;
  color: #1e40af;
}

.badge-noticia {
  background: #f1f5f9;
  color: #475569;
}

.card-noticia img {
  height: 180px;
  object-fit: cover;
  width: 100%;
}

.conteudo {
  padding: 16px;
}

.conteudo h4 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.conteudo p {
  font-size: 22px;
  color: #555;
  margin-bottom: 12px;
}

.btn-leia {
  background: linear-gradient(135deg, #1e40af, #a5f3fc, #93c5fd); 
  color: #1e40af;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 19px;
  transition: background 0.2s;
  border: none;
  cursor: pointer;
}

.btn-leia:hover {
  background: #a5f3fc;
}

.carrossel-container {
  position: relative;
  width: 100%;              
  max-width: 100vw;         
  height: 500px;            
  overflow: hidden;
  margin: 0;               
  margin-top: 70px;
  border-radius: 0;         
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.carrossel-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;        
  transition: opacity 0.10s ease;
}

.btn-prev, .btn-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.8);
  color: #0ea5e9;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  border: none;
  font-size: 40px;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
}

.btn-prev:hover, .btn-next:hover {
  background: #0ea5e9;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.btn-prev { left: 15px; }
.btn-next { right: 15px; }

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.carrossel-texto {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #1e40af, #8dbabf, #93c5fd); 
  color: rgb(203, 243, 255);
  padding: 16px 32px;
  border-radius: 16px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  max-width: 80%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  animation: fadeInUp 0.8s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translate(-50%, 20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

.faq {
  background: white;
  padding: 20px;
  border-radius: 16px;
  margin-top: 40px;
    font-size: 1.26rem;

  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}

.faq h3 {
  margin-bottom: 15px;
  color: #059669;
  text-align: left;
}

.faq-item {
  margin-bottom: 10px;
}

.faq-question {
  width: 100%;
  text-align: left;
  background: #f1f5f9;
  padding: 10px 14px;
  border-radius: 8px;
  display: flex;
    font-size: 1.3rem;
  justify-content: space-between;
  cursor: pointer;
  transition: background 0.2s ease;
  border: none;
}

.faq-question:hover {
  background: #e2e8f0;
}

.faq-answer {
  margin-top: 8px;
  font-size: 18px;
  color: #444;
  padding-left: 5px;
}
</style>