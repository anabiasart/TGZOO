<template>
  <div class="noticias-page">
    <!-- Header -->
    <header class="page-header">
      <button class="btn-voltar" @click="$router.go(-1)">
        ← Voltar
      </button>
      <div class="header-content">
        <h1>📰 Notícias & Campanhas</h1>
        <p>Fique por dentro de todas as novidades, campanhas e informações importantes</p>
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
        
        <select v-model="filtros.tipo" @change="aplicarFiltros" class="filter-select">
          <option value="">📋 Todos os tipos</option>
          <option value="campanha">📢 Campanhas</option>
          <option value="noticia">📝 Notícias</option>
        </select>
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
        <span class="empty-icon">📰</span>
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
          <!-- Badge de tipo -->
          <div class="card-badge">
            <span :class="noticia.tipo === 'campanha' ? 'badge-campanha' : 'badge-noticia'">
              {{ noticia.tipo === 'campanha' ? '📢 Campanha' : '📝 Notícia' }}
            </span>
          </div>

          <!-- Imagem -->
          <div class="card-image">
            <img :src="getImagem(noticia)" :alt="getTitulo(noticia)" />
          </div>

          <!-- Conteúdo -->
          <div class="card-content">
            <h3>{{ getTitulo(noticia) }}</h3>
            
            <!-- Info de Campanha -->
            <div v-if="noticia.tipo === 'campanha'" class="campanha-info">
              <div class="info-item" v-if="noticia.dataInicioCampanha">
                <span class="icon">📅</span>
                <span>{{ noticia.dataInicioCampanha }} até {{ noticia.dataFimCampanha }}</span>
              </div>
              <div class="info-item" v-if="noticia.horarioCampanha">
                <span class="icon">🕐</span>
                <span>{{ noticia.horarioCampanha }}</span>
              </div>
            </div>
            
            <!-- Resumo de Notícia -->
            <p v-else class="resumo">{{ cortarTexto(noticia.resumo, 120) }}</p>
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
            
            <button class="btn-ver-mais">
              Ver detalhes →
            </button>
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
  busca: '',
  tipo: ''
})

onMounted(() => {
  carregarNoticias()
})

// Computed
const noticiasFiltradas = computed(() => {
  let resultado = [...noticias.value]
  
  // Filtro de busca
  if (filtros.value.busca.trim()) {
    const termo = filtros.value.busca.toLowerCase()
    resultado = resultado.filter(n => {
      const titulo = getTitulo(n).toLowerCase()
      const resumo = (n.resumo || '').toLowerCase()
      return titulo.includes(termo) || resumo.includes(termo)
    })
  }
  
  // Filtro de tipo
  if (filtros.value.tipo) {
    resultado = resultado.filter(n => (n.tipo || 'noticia') === filtros.value.tipo)
  }
  
  return resultado
})

// Funções
function getTitulo(noticia) {
  if (noticia.tipo === 'campanha') {
    return noticia.nomeCampanha || noticia.titulo
  }
  return noticia.nomeNoticia || noticia.titulo
}

function getImagem(noticia) {
  if (noticia.tipo === 'campanha') {
    return noticia.urlImagem || vete
  }
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
  background: #059669;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  transition: background 0.2s;
}

.btn-voltar:hover {
  background: #047857;
}

/* Header */
.page-header {
  margin-top: 70px;
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

/* Filtros */
.filtros-section {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.filtros-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
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
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  font-size: 1rem;
  min-width: 200px;
  cursor: pointer;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 4rem 2rem;
  color: #059669;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #059669;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Notícias Grid */
.noticias-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

.noticias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.noticia-card {
  background: #f8fafc;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
}

.noticia-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.card-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
}

.card-badge span {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.badge-campanha {
  background: rgba(14, 165, 233, 0.95);
  color: white;
}

.badge-noticia {
  background: rgba(249, 115, 22, 0.95);
  color: white;
}

.card-image {
  height: 180px;
  overflow: hidden;
  background: #e2e8f0;
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
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-content h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.campanha-info {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  padding: 0.875rem;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  border: 1px solid #93c5fd;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.813rem;
  color: #1e40af;
  font-weight: 500;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .icon {
  width: 16px;
  text-align: center;
  font-size: 0.875rem;
}

.resumo {
  color: #64748b;
  line-height: 1.5;
  margin: 0;
  font-size: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  background: white;
}

.meta-info {
  display: flex;
  gap: 1rem;
  font-size: 0.688rem;
  color: #94a3b8;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
}

.meta-item .icon {
  font-size: 0.75rem;
}

.btn-ver-mais {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-size: 0.813rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.btn-ver-mais:hover {
  background: #0284c7;
  transform: translateX(3px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  grid-column: 1 / -1;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0;
}

/* Footer */
.page-footer {
  background: white;
  padding: 2rem;
  text-align: center;
  color: #64748b;
  margin-top: 2rem;
}

/* Responsivo */
@media (max-width: 1024px) {
  .noticias-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 2rem 1rem;
  }
  
  .header-content h1 {
    font-size: 1.875rem;
  }
  
  .header-content p {
    font-size: 0.938rem;
  }
  
  .filtros-section {
    padding: 1rem;
  }
  
  .filtros-container {
    flex-direction: column;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .noticias-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .noticias-container {
    padding: 0 1rem 2rem;
  }
  
  .card-image {
    height: 160px;
  }
  
  .card-footer {
    flex-direction: column;
    gap: 0.875rem;
    align-items: stretch;
  }
  
  .meta-info {
    justify-content: space-between;
    width: 100%;
  }
  
  .btn-ver-mais {
    width: 100%;
    justify-content: center;
  }
  
  .navbar-logo .logo {
    height: 120px;
  }
}

@media (max-width: 480px) {
  .header-content h1 {
    font-size: 1.5rem;
  }
  
  .card-content h3 {
    font-size: 1rem;
  }
  
  .card-content {
    padding: 1rem;
  }
  
  .card-footer {
    padding: 0.875rem 1rem;
  }
}
</style>