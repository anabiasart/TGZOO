<template>
  <div class="campanhas-page">
    <!-- Header -->
    <header class="page-header">
      <button class="btn-voltar" @click="$router.go(-1)">
        ← Voltar
      </button>
      <div class="header-content">
        <h1>📢 Campanhas</h1>
        <p>Confira todas as campanhas ativas e programadas</p>
      </div>
    </header>

    <!-- Filtros -->
    <section class="filtros-section">
      <div class="filtros-container">
        <div class="search-box">
          <input 
            v-model="filtros.busca" 
            type="text"
            placeholder="🔍 Buscar campanhas..."
            @input="aplicarFiltros"
          />
        </div>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando campanhas...</p>
    </div>

    <!-- Lista de campanhas -->
    <main class="campanhas-container" v-else>
      <div v-if="campanhasFiltradas.length === 0" class="empty-state">
        <span class="empty-icon">📢</span>
        <h3>Nenhuma campanha encontrada</h3>
        <p>Não há campanhas ativas no momento. Volte mais tarde!</p>
      </div>

      <div v-else class="campanhas-grid">
        <article 
          v-for="campanha in campanhasFiltradas" 
          :key="campanha.id"
          class="campanha-card"
          @click="verCampanha(campanha.id)"
        >
          <!-- Badge -->
          <div class="card-badge">
            <span class="badge-campanha">📢 Campanha</span>
          </div>

          <!-- Imagem -->
          <div class="card-image">
            <img :src="getImagem(campanha)" :alt="getTitulo(campanha)" />
          </div>

          <!-- Conteúdo -->
          <div class="card-content">
            <h3>{{ getTitulo(campanha) }}</h3>
            
            <!-- Info de Campanha -->
            <div class="campanha-info">
              <div class="info-item" v-if="campanha.dataInicioCampanha">
                <span class="icon">📅</span>
                <span>{{ campanha.dataInicioCampanha }} até {{ campanha.dataFimCampanha }}</span>
              </div>
              <div class="info-item" v-if="campanha.horarioCampanha">
                <span class="icon">🕐</span>
                <span>{{ campanha.horarioCampanha }}</span>
              </div>
              <div class="info-item" v-if="campanha.localCampanha">
                <span class="icon">📍</span>
                <span>{{ campanha.localCampanha }}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="card-footer">
            <div class="meta-info">
              <span class="meta-item">
                <span class="icon">👤</span>
                {{ campanha.autor || 'Sistema' }}
              </span>
              <span class="meta-item">
                <span class="icon">📅</span>
                {{ formatarData(campanha.dataPublicacao) }}
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
  busca: ''
})

onMounted(() => {
  carregarNoticias()
})

// Computed - Filtra apenas campanhas
const campanhasFiltradas = computed(() => {
  let resultado = noticias.value.filter(n => n.tipo === 'campanha')
  
  // Filtro de busca
  if (filtros.value.busca.trim()) {
    const termo = filtros.value.busca.toLowerCase()
    resultado = resultado.filter(n => {
      const titulo = getTitulo(n).toLowerCase()
      return titulo.includes(termo)
    })
  }
  
  return resultado
})

// Funções
function getTitulo(campanha) {
  return campanha.nomeCampanha || campanha.titulo
}

function getImagem(campanha) {
  return campanha.urlImagem || vete
}

function formatarData(data) {
  if (!data) return ''
  return new Date(data).toLocaleDateString('pt-BR')
}

function verCampanha(id) {
  router.push(`/edital/${id}`)
}

function aplicarFiltros() {
  // Os filtros são aplicados automaticamente pelo computed
}
</script>

<style scoped>
.campanhas-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd); 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.btn-voltar {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 0.166rem 0.25rem 0rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.3rem;
  margin-bottom: 0rem;
  transition: background 0.2s;
}

.btn-voltar:hover {
  background: #0284c7;
}

.page-header {
   background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  position: relative;
  
}

.header-content h1 {
  font-size: 2.5rem;
  color: #0ea5e9;
  margin: 0 1rem 0rem;
  text-align: center;
}

.header-content p {
  font-size: 1.5rem;
  color: #64748b;
  margin: 0;
  text-align: center;

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
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
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

.campanhas-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 0rem 20rem;
}

.campanhas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(470px, 1fr));
  gap:2rem;
}

.campanha-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  border: 2px solid transparent;
}

.campanha-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.2);
  border-color: #0ea5e9;
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

.badge-campanha {
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
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.campanha-card:hover .card-image img {
  transform: scale(1.08);
}

.card-content {
  padding:0.999rem;
  flex:0.9rem;
}

.card-content h3 {
  font-size: 2rem;
  font-weight: 450;
  color: #1e293b;
  margin: 0 0 2rem 0;
  line-height: 1;
}

.campanha-info {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  padding: 1rem;
  border-radius: 10px;
  border: 0px solid #93c5fd;
}

.info-item {
  display: flex;
  align-items: left;
  gap: 0.3rem;
  margin-bottom: 0.2rem;
  font-size: 1.558rem;
  color: #1e40af;
  font-weight: 600;
}

.info-item:last-child {
  margin-bottom: 10px;
}


.card-footer {
  padding: 1rem 2rem;
  border-top: 1px solid #a5d2ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
}

.meta-info {
  display: flex;
  gap: 1rem;
  font-size: 0.813rem;
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
  flex-grow: 1;
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
}

.btn-ver-mais:hover {
  background: #0284c7;
  transform: translateX(3px);
}

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

@media (max-width: 768px) {
  .campanhas-grid {
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