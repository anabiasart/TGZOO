<template>
  <div class="noticias-page">
    <!-- Header -->
    <header class="page-header">
      <button class="btn-voltar" @click="$router.go(-1)">
        ← Voltar
      </button>
      <div class="header-content">
        <h1>📝 Notícias</h1>
        <p>Fique por dentro de todas as novidades e informações importantes</p>
      </div>
    </header>

    <!-- Filtros -->
    <section class="filtros-section">
      <div class="filtros-container">
        <div class="search-box">
          <input 
            v-model="filtros.busca" 
            type="text"
            placeholder="🔍 Buscar notícias..."
            @input="aplicarFiltros"
          />
        </div>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando notícias...</p>
    </div>

    <!-- Lista de notícias -->
    <main class="noticias-container" v-else>
      <div v-if="noticiasFiltradas.length === 0" class="empty-state">
        <span class="empty-icon">📝</span>
        <h3>Nenhuma notícia encontrada</h3>
        <p>Tente ajustar os filtros ou volte mais tarde para novas publicações.</p>
      </div>

      <div v-else class="noticias-grid">
        <article 
          v-for="noticia in noticiasFiltradas" 
          :key="noticia.id"
          class="noticia-card"
          @click="verNoticia(noticia.id)"
        >
          <!-- Badge -->
          <div class="card-badge">
            <span class="badge-noticia">📝 Notícia</span>
          </div>

          <!-- Imagem -->
          <div class="card-image">
            <img :src="getImagem(noticia)" :alt="getTitulo(noticia)" />
          </div>

          <!-- Conteúdo -->
         <div class="card-content">
  <h3>{{ getTitulo(noticia) }}</h3>
  <p class="resumo">{{ noticia.resumo }}</p>
</div>

          <!-- Footer -->
          <div class="card-footer">
            <div class="meta-info">
              <span class="meta-item">
                <span class="icon">👤</span>
                {{ noticia.autor || 'Sistema' }}
              </span>
              <span class="meta-item">
                <span class="icon">📅</span>  
                {{ formatarData(noticia.dataPublicacao) }}
              </span>
            </div>
            
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
import vete from '@/assets/img/vete.jpg'

const router = useRouter()
const { noticias, carregando, carregarNoticias } = useNoticias()

const filtros = ref({
  busca: ''
})

onMounted(() => {
  carregarNoticias()
})

// Computed - Filtra apenas notícias
const noticiasFiltradas = computed(() => {
  let resultado = noticias.value.filter(n => (n.tipo || 'noticia') === 'noticia')
  
  // Filtro de busca
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

// Funções
function getTitulo(noticia) {
  return noticia.nomeNoticia || noticia.titulo
}

function getImagem(noticia) {
  return noticia.urlImagemNoticia || noticia.imagem || vete
}

function cortarTexto(texto, limite) {
  if (!texto) return ''
  texto = texto.replace(/\s+/g, ' ').trim()
  if (texto.length <= limite) return texto
  const cortado = texto.slice(0, limite + 1)
  const ultimoEspaco = cortado.lastIndexOf(' ')
  if (ultimoEspaco <= 0) return texto.slice(0, limite) + '…'
  return cortado.slice(0, ultimoEspaco) + '…'
}

function formatarData(data) {
  if (!data) return ''
  return new Date(data).toLocaleDateString('pt-BR')
}

function verNoticia(id) {
  router.push(`/edital/${id}`)
}

function aplicarFiltros() {
  // Os filtros são aplicados automaticamente pelo computed
}
</script>

<style scoped>
.noticias-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd); 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.btn-voltar {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  margin: 2rem 2rem 0;
  transition: background 0.2s;
}

.btn-voltar:hover {
  background: #0284c7;
}

.page-header {
  background: white;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.header-content h1 {
  font-size: 2.5rem;
  color: #0ea5e9;
  margin: 0 0 1rem 0;
}

.header-content p {
  font-size: 1.125rem;
  color: #64748b;
  margin: 0;
}

.filtros-section {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.search-box {
  width: 100%;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.loading-container {
  text-align: center;
  padding: 4rem 2rem;
  color: #f97316;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #f97316;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.noticias-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 0rem 20rem;
}
.noticias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(550px, 1fr));
  gap:2rem;
}

.noticia-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  display: grid;
  grid-column: auto;
  height: 100%;
  border: 1px solid transparent;

}

.noticia-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
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
  color: rgb(235, 235, 235);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.card-image {
  height: 300px;
  overflow: hidden;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
}

.card-image img {
  width: 1000%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.noticia-card:hover .card-image img {
  transform: scale(1.08);
}

.card-content {
  padding: 0.999rem;
  flex:1;
}

.card-content h3 {
  font-size: 2rem;
  font-weight: 450;
  color: #1e293b;
  margin: 0 0 1rem 0;
  line-height: 1;
}


.resumo {
  color: #64748b;
  line-height: 1;
  font-size: 1.5rem;
}

.card-footer {
  padding: 1rem 2rem;
  border-top: 1px solid #a5d2ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #feffff;
}

.meta-info {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #94a3b8;
}

.meta-item {
  display:flex;
  align-items:normal;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 350;
   margin:0;
  
}

.meta-item .icon{
  width:25px;
  text-align: flex;
}


.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  grid-column:auto;
}

.empty-icon {
  font-size: 1rem;
  display: block;
  margin-bottom: 13rem;
}

.empty-state h3 {
  font-size: 6.5rem;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0;
}

@media (max-width: 768px) {
  .noticias-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    padding: 2rem 1rem;
  }
  
  .header-content h1 {
    font-size: 2rem;
  }
}
</style>