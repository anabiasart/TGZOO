<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Syringe, User, Calendar } from 'lucide-vue-next'
import { noticiasData } from "@/data/noticiasData.js"
import vete from "../assets/img/vete.jpg";
import pata from "../assets/img/pata.jpg"

const noticias = ref([])
const router = useRouter()
const menuAberto = ref(false)

const servicos = [
  { 
    titulo: "Vacine o seu Pet", 
    desc: "Garanta a saúde dos seus amigos peludos...", 
    label: "CONSULTAR", 
    icon: Syringe, 
    acao: () => router.push('/edital') 
  },
  { 
    titulo: "Faça login", 
    desc: "Receba dicas dos nossos veterinários...", 
    label: "LOGIN", 
    icon: User, 
    acao: () => router.push('/login') 
  },
  { 
    titulo: "Agende uma Consulta", 
    desc: "Receba atendimento especializado...", 
    label: "AGENDAR", 
    icon: Calendar, 
    acao: () => router.push('/login') 
  }
]

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

// Notícias
onMounted(() => {
  noticias.value = noticiasData.slice(0, 4).map((n, i) => ({
    titulo: n.titulo,
    resumo: cortarTexto(n.resumo, 80),
    imagem: i % 2 === 0 ? vete : pata

  }))
})

// FAQ
const faq = ref([
  { pergunta: "Como faço para cadastrar meu pet?", resposta: "Basta acessar a área de login, criar sua conta e cadastrar os dados do seu pet.", aberto: false },
  { pergunta: "As vacinas são gratuitas?", resposta: "Sim, as campanhas de vacinação promovidas pela prefeitura são gratuitas.", aberto: false },
  { pergunta: "Onde acontecem os mutirões de adoção?", resposta: "Normalmente na Praça Central ou no Centro Veterinário Municipal. Confira no edital.", aberto: false }
])
function toggleFaq(index) {
  faq.value[index].aberto = !faq.value[index].aberto
}

// Carrossel de banners
const imagens = ref([ vete, pata])

const indexAtual = ref(0)
let intervalo
function proximo() {
  indexAtual.value = (indexAtual.value + 1) % imagens.value.length
}
function anterior() {
  indexAtual.value = (indexAtual.value - 1 + imagens.value.length) % imagens.value.length
}
onMounted(() => {
  intervalo = setInterval(proximo, 4000)
})
onUnmounted(() => clearInterval(intervalo))
</script>

<template>
  <div class="home-page">
    <div class="content">

<nav class="navbar">
  <div class="navbar-logo" @click="router.push('/')">
    <span>🐾</span> ZoonoSys
  </div>

  <ul class="navbar-links">
    <li @click="router.push('/')">Início</li>
    <li @click="router.push('/edital')">Editais</li>
    <li @click="router.push('/login')">Login</li>
    <li @click="router.push('/contato')">Contato</li>
  </ul>

  <button class="navbar-toggle" @click="menuAberto = !menuAberto">☰</button>

  <ul v-if="menuAberto" class="navbar-mobile">
    <li @click="router.push('/')">Início</li>
    <li @click="router.push('/edital')">Editais</li>
    <li @click="router.push('/login')">Login</li>
    <li @click="router.push('/contato')">Contato</li>
  </ul>
</nav>



      <!-- Botão fixo -->
      <div class="hero-text">
        <button class="btn-adote" @click="router.push('public/user/detalhes.html')">Adote um Amigo</button>
      </div>

      <div class="template2">

        <!-- Serviços -->
        <aside class="col-esquerda">
          <div v-for="(s, i) in servicos" :key="i" class="service">
            <component :is="s.icon" class="icon"/>
            <h3>{{ s.titulo }}</h3>
            <p>{{ s.desc }}</p>
            <button class="btn-action" @click="s.acao">{{ s.label }}</button>
          </div>
        </aside>

        <!-- Conteúdo central -->
        <main class="col-central">
          <section class="texto-zoonoses">
            <h2>Sobre as Zoonoses</h2>
            <p>
              Zoonoses são doenças que podem ser transmitidas de animais para humanos.
              É fundamental a vacinação e os cuidados veterinários para prevenir esses riscos.
            </p>
          </section>

          <!-- Notícias estilo portal -->
          <section class="noticias">
            <h3 class="titulo">📰 Últimas Notícias & Editais</h3>
            <div class="lista-noticias">
              <div v-for="(n, i) in noticias" :key="i" class="card-noticia">
                <img :src="n.imagem" alt="Imagem notícia" />
                <div class="conteudo">
                  <h4>{{ n.titulo }}</h4>
                  <p>{{ n.resumo }}</p>
                  <button class="btn-leia" @click="router.push('/edital')">Leia mais ›</button>
                </div>
              </div>
            </div>
          </section>

          <!-- FAQ -->
          <section class="faq">
            <h3>❓ Dúvidas Frequentes</h3>
            <div v-for="(item, i) in faq" :key="i" class="faq-item">
              <button class="faq-question" @click="toggleFaq(i)">
                {{ item.pergunta }}
                <span>{{ item.aberto ? '−' : '+' }}</span>
              </button>
              <p v-if="item.aberto" class="faq-answer">{{ item.resposta }}</p>
            </div>
          </section>
        </main>

        <!-- Carrossel -->
        <aside class="col-direita">
          <div class="carrossel-container">
            <img :src="imagens[indexAtual]" alt="Carrossel" />
            <button class="btn-prev" @click="anterior">‹</button>
            <button class="btn-next" @click="proximo">›</button>
          </div>
        </aside>

      </div>
    </div>
  </div>
</template>

<style>
/* Fundo geral */
.home-page {
  margin: 0;
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd); 
}

/* Container */
.content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  width: 100%;
}

/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background: white; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    border-radius: 50px;

}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: bold;
  color: #0ea5e9;
  cursor: pointer;
  gap: 8px;
}
.navbar-logo span {
  color: #059669; 
}

/* Links desktop */
.navbar-links {
  display: flex;
  list-style: none;
  gap: 2rem;
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

/* Botão mobile */
.navbar-toggle {
  display: none;
  background: transparent;
  color: #0ea5e9;
  font-size: 28px;
  border: none;
  cursor: pointer;
}

/* Menu mobile */
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

/* Responsividade */
@media (max-width: 768px) {
  .navbar-links { display: none; }
  .navbar-toggle { display: block; }
}

/* Layout responsivo */
.template2 {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  width: 100%;
}
@media (max-width: 1024px) {
  .template2 {
    grid-template-columns: 1fr;
  }
  .col-direita {
    grid-template-columns: 1fr 1fr;
    display: grid;
  }
}


/* Botão fixo */
.hero-text {
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 50;
}
.btn-adote {
  background: linear-gradient(90deg, #38bdf8, #0ea5e9);
  color: white;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 9999px;
  transition: transform 0.3s ease;
}
.btn-adote:hover {
  transform: scale(1.05);
}

/* Serviços */
.col-esquerda {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.service {
  background: white;
  padding: 25px;
  text-align: center;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.service:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}
.service h3 {
  font-size: 20px;
  margin: 10px 0;
}
.service p {
  font-size: 14px;
  color: #555;
}
.icon {
  width: 28px;
  height: 28px;
  color: #059669;
}
.btn-action {
  background: #059669;
  color: white;
  padding: 8px 14px;
  margin-top: 10px;
  border-radius: 9999px;
  font-size: 14px;
  transition: transform 0.2s ease;
}
.btn-action:hover {
  transform: scale(1.05);
}

/* Texto zoonoses */
.texto-zoonoses {
  background: white;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 40px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}
.texto-zoonoses h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0ea5e9;
  margin-bottom: 10px;
}

/* Notícias estilo portal */
.titulo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0ea5e9;
  margin-bottom: 20px;
}
.lista-noticias {
  display: grid;
  gap: 20px;
}
.card-noticia {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}
.card-noticia:hover { transform: translateY(-5px); }
.card-noticia img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}
.conteudo { padding: 16px; }
.conteudo h4 { font-size: 18px; font-weight: bold; margin-bottom: 8px; }
.conteudo p { font-size: 14px; color: #555; margin-bottom: 12px; }
.btn-leia {
  background: #2563eb;
  color: white;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 14px;
  transition: background 0.2s;
}
.btn-leia:hover { background: #1e40af; }

/* Carrossel */
.carrossel-container {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.carrossel-container img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  transition: opacity 0.5s ease;
}
.btn-prev, .btn-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.btn-prev { left: 10px; }
.btn-next { right: 10px; }

/* FAQ */
.faq {
  background: white;
  padding: 20px;
  border-radius: 16px;
  margin-top: 40px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}
.faq h3 {
  margin-bottom: 15px;
  color: #059669;
  text-align: left;
}
.faq-item { margin-bottom: 10px; }
.faq-question {
  width: 100%;
  text-align: left;
  background: #f1f5f9;
  padding: 10px 14px;
  border-radius: 8px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  transition: background 0.2s ease;
}
.faq-question:hover { background: #e2e8f0; }
.faq-answer {
  margin-top: 8px;
  font-size: 14px;
  color: #444;
  padding-left: 5px;
}
</style>
