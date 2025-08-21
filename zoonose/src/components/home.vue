<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Syringe, User, Calendar } from 'lucide-vue-next'
import { noticiasData } from "@/data/noticiasData.js"


const noticias = ref([])
const router = useRouter()

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

// Carregar notícias automaticamente
function cortarTexto(texto, limite) {
  if (!texto) return ''
  texto = texto.replace(/\s+/g, ' ').trim()
  if (texto.length <= limite) return texto
  const cortado = texto.slice(0, limite + 1)
  const ultimoEspaco = cortado.lastIndexOf(' ')
  if (ultimoEspaco <= 0) return texto.slice(0, limite) + '…'
  return cortado.slice(0, ultimoEspaco) + '…'
}


onMounted(() => {
  noticias.value = noticiasData.slice(0, 3).map(n => ({
    titulo: n.titulo,
    resumo: cortarTexto(n.resumo, 60)
  }))
})
</script>

<template>
  <div class="home-page">
    <div class="content">

      <!-- Botão fixo "Adote um Amigo" -->
      <div class="hero-text">
        <button class="btn-adote" @click="router.push('/detalhes')">Adote um Amigo</button>
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

          <section>
            <div class="card">
              <h3>📢 Últimas Notícias & Editais</h3>
              <div v-if="noticias.length">
                <div v-for="(noticia, i) in noticias" :key="i" class="mb-2">
                  <strong>{{ noticia.titulo }}</strong>
                  <p>{{ noticia.resumo }}</p>
                </div>
              </div>
              <div v-else>
                <p>Carregando notícias...</p>
              </div>
              <button class="btn-ver" @click="router.push('/edital')">VEJA MAIS</button>
            </div>
          </section>
        </main>

        <!-- Banners -->
        <aside class="col-direita">
          <img src="@/assets/img/vete.jpg" alt="Banner destaque" />
          <img src="@/assets/img/pata.jpg" alt="Banner destaque"/>
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
  background-color: #abe2bc;
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

/* Layout responsivo */
.template2 {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  width: 100%;
}
@media (max-width: 768px) {
  .template2 {
    grid-template-columns: 1fr;
  }
  .col-direita img {
    width: 100%;
    height: auto;
  }
}

/* Botão fixo */
.hero-text {
  position: fixed;
  top: 10px;
  left: 10px;
}
.btn-adote {
  background: linear-gradient(90deg, #38bdf8, #0ea5e9);
  color: white;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 8px;
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
  padding: 20px;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: transform 0.2s ease;
}
.service:hover {
  transform: translateY(-5px);
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
  width: 32px;
  height: 32px;
  margin: auto;
  color: #059669;
}
.btn-action {
  background: #059669;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  transition: transform 0.2s ease;
}
.btn-action:hover {
  transform: scale(1.05);
}

/* Central */
.texto-zoonoses {
  background: white;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}
.card {
  background: #f8fafc;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
  text-align: center;
}
.btn-ver {
  margin-top: 10px;
  background: #6366f1;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  transition: transform 0.2s ease;
}
.btn-ver:hover {
  transform: scale(1.05);
}

/* Banners */
.col-direita {
  display: grid;
  gap: 10px;
}
.col-direita img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
}
.col-direita img:hover {
  transform: scale(1.05);
}
</style>
