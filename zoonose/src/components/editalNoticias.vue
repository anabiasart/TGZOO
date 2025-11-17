<template>
  <nav class="navbar">
    <div class="navbar-logo" @click="router.push('/')">
      <img :src="zoo" alt="ZoonoSys Logo" class="logo" />
    </div>

    <ul class="navbar-links">
      <li @click="router.push('/')">Início</li>

      <!-- NOTÍCIAS -->
      <li class="relative group">
        <span
          class="cursor-pointer"
          @click.stop="router.push('/edital/noticias')"
        >
          Notícias
        </span>

        <ul
          class="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-md opacity-0 invisible
                 group-hover:opacity-100 group-hover:visible transition-all duration-200
                 transform group-hover:translate-y-1 z-50"
        >
          <li v-for="n in noticiasDropdown" :key="n.id">
            <span
              class="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
             style="font-size: 1.2rem"

              @click="router.push(`/edital/${n.id}`)"
            >
              {{ n.nomeNoticia || n.titulo }}
            </span>
          </li>

          <li
            v-if="noticiasDropdown.length === 0"
            class="px-4 py-2 text-gray-500 text-sm"
          >
            Nenhuma notícia encontrada
          </li>
        </ul>
      </li>

      <!-- CAMPANHAS -->
      <li class="relative group">
        <span
          class="cursor-pointer"
          @click.stop="router.push('/edital/campanhas')"
        >
          Campanhas
        </span>

        <ul
          class="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-md opacity-0 invisible
                 group-hover:opacity-100 group-hover:visible transition-all duration-200
                 transform group-hover:translate-y-1 z-50"
        >
          <li v-for="c in campanhasAtivasDropdown" :key="c.id">
            <span
              class="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
             style="font-size: 1.2rem"

              @click="router.push(`/edital/${c.id}`)"
            >
              {{ c.nomeCampanha || c.titulo }}
            </span>
          </li>

          <li
            v-if="campanhasAtivasDropdown.length === 0"
            class="px-4 py-2 text-gray-500 text-sm"
          >
            Nenhuma campanha encontrada
          </li>
        </ul>
      </li>

      <li @click="router.push('/edital/adocao')">Adote um Amigo</li>
      <li @click="router.push('/login')">Login</li>

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

  <div class="noticias-page">
    <div class="header-content">
      <h1>Notícias</h1>
      <p>Fique por dentro de todas as novidades e informações importantes</p>
    </div>

    <button class="btn-voltar" @click="$router.go(-1)">
      ← Voltar
    </button>

    <section class="filtros-section">
      <div class="filtros-container">
        <input
          v-model="filtros.busca"
          type="text"
          class="search-input"
          placeholder="Buscar notícias..."
        />
      </div>
    </section>

    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando notícias...</p>
    </div>

    <main class="noticias-container" v-else>
      <div v-if="noticiasFiltradas.length === 0" class="empty-state">
        <h3>Nenhuma notícia encontrada</h3>
        <p>Tente ajustar os filtros ou volte mais tarde.</p>
      </div>

      <div v-else class="noticias-grid">
        <article
          v-for="noticia in noticiasFiltradas"
          :key="noticia.id"
          class="noticia-card"
          @click="verNoticia(noticia.id)"
        >
          <div class="card-badge">
            <span class="badge-noticia">Notícia</span>
          </div>

          <div class="card-image">
            <img :src="getImagem(noticia)" :alt="getTitulo(noticia)" />
          </div>

          <div class="card-content">
            <h3>{{ getTitulo(noticia) }}</h3>
            <p class="resumo">{{ noticia.resumo }}</p>
          </div>

          <div class="card-footer">
            <span>{{ noticia.autor || 'Sistema' }}</span>
            <span>{{ formatarData(noticia.dataPublicacao) }}</span>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNoticias } from '@/data/noticiasData.js'
import { useEditais } from '@/data/editaisData.js'
import vete from '@/assets/img/vete.jpg'
import zoo from '@/assets/img/zoo.png'

const router = useRouter()
const { noticias, carregando, carregarNoticias } = useNoticias()
const { todosItens: todasNoticias, carregarTodos: carregarNoticiasEditais } = useEditais()

const filtros = ref({ busca: '' })
const menuAberto = ref(false)

const campanhasAtivasDropdown = computed(() =>
  todasNoticias.value.filter(i => i.tipo?.toLowerCase() === 'campanha')
)

const noticiasDropdown = computed(() =>
  todasNoticias.value.filter(i => i.tipo?.toLowerCase() === 'noticia')
)

onMounted(async () => {
  await Promise.all([
    carregarNoticias(),
    carregarNoticiasEditais()
  ])
})

const noticiasFiltradas = computed(() => {
  let resultado = [...noticias.value]

  if (filtros.value.busca.trim()) {
    const termo = filtros.value.busca.toLowerCase()
    resultado = resultado.filter(n => {
      const titulo = getTitulo(n).toLowerCase()
      const resumo = (n.resumo || '').toLowerCase()
      return titulo.includes(termo) || resumo.includes(termo)
    })
  }

  return resultado
})

function getTitulo(noticia) {
  return noticia.nomeNoticia || noticia.titulo
}

function getImagem(noticia) {
  return noticia.urlImagemNoticia || noticia.imagem || vete
}

function formatarData(data) {
  if (!data) return ''
  return new Date(data).toLocaleDateString('pt-BR')
}

function verNoticia(id) {
  router.push(`/edital/${id}`)
}
</script>

<style scoped>
.noticias-page {
  background: linear-gradient(135deg, #effff7, #cffaff, #93c5fd);
  width: 100%;
  margin-right: auto;
  align-items: flex-start;
  justify-content: center;
  margin-top: 20px;
  max-width: 10000px;
  flex: 1;
  zoom: 1.1;
  padding-top: 100px; /* espaço para a navbar */
  min-height: 100vh;
  margin-left: auto;
}

/* NAVBAR igual adoção */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 90px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 3rem;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.08);
  z-index: 200;

}

.navbar-logo .logo {
  height: 180px;
  width: auto;
  transition: transform 0.3s ease;
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
   font-size: 1.4rem;
  color: #64748b;
  margin: 0 auto;
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
  top: 90px;
  right: 0;
  background: white;
  color: #333;
  width: 220px;
  list-style: none;
  padding: 12px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  .navbar-links {
    display: none;
  }
  .navbar-toggle {
    display: block;
  }
}

/* HEADER igual vibe adoção */
.header-content {
  text-align: center;
  position: relative;
  padding: 40px 20px 25px;
  margin: 0 auto 40px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 1900px;
  border-radius: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.header-content h1 {
  font-size: 2.8rem;
  color: #0ea5e9;
  margin-bottom: 6px;
}

.header-content p {
  font-size: 1.4rem;
  color: #64748b;
  margin: 0 auto;
}

.btn-voltar {
  position: absolute;
  left: 30px;
  top: 100px;
  background: transparent;
  border: none;
  color: #0ea5e9;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 6px 1px;
  font-weight: 600;
  z-index: 300;
}

.btn-voltar:hover {
  color: #0284c7;
}

/* FILTROS / INPUT */
.filtros-section {
  max-width: 900px;
  margin: 0 auto 2rem;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 1.3rem;
  border: 1px solid #dbeafe;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.loading-container {
  text-align: center;
  padding: 4rem 2rem;
  color: #0ea5e9;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* LISTAGEM */
.noticias-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 0 6rem;
}

.noticias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(550px, 1fr));
  gap: 2rem;
}

.noticia-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  border: 1px solid transparent;
}

.noticia-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: #0ea5e9;
}

.card-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
}

.badge-noticia {
  padding: 6px 34px;
  border-radius: 20px;
  font-size: 0.999rem;
  font-weight: 500;
  background: linear-gradient(135deg, #b0d5ff, #6488ff, #93c5fd);
  color: #ebebeb;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.card-image {
  height: 300px;
  overflow: hidden;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.noticia-card:hover .card-image img {
  transform: scale(1.08);
}

.card-content {
  padding: 1rem;
}

.card-content h3 {
  font-size: 2rem;
  font-weight: 450;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
}

.resumo {
  color: #64748b;
  line-height: 1.3;
  font-size: 1.1rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #a5d2ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #feffff;
  font-size: 0.95rem;
  color: #64748b;
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-state h3 {
  font-size: 2rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
}

@media (max-width: 768px) {
  .noticias-grid {
    grid-template-columns: 1fr;
  }

  .header-content h1 {
    font-size: 2rem;
  }

  .noticias-page {
    zoom: 1; /* pra não zoar no mobile */
  }
}
</style>
