<template>
  <nav class="navbar">
    <div class="navbar-logo" @click="router.push('/')">
      <img :src="zoo" alt="ZoonoSys Logo" class="logo" />
    </div>

    <ul class="navbar-links">
      <li @click="router.push('/')">Início</li>

      <!-- NOTÍCIAS -->
      <li class="relative group">
        <span class="cursor-pointer" @click.stop="router.push('/edital/noticias')">
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

          <li v-if="noticiasDropdown.length === 0" class="px-4 py-2 text-gray-500 text-sm">
            Nenhuma notícia encontrada
          </li>
        </ul>
      </li>

      <!-- CAMPANHAS -->
      <li class="relative group">
        <span class="cursor-pointer" @click.stop="router.push('/edital/campanhas')">
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

          <li v-if="campanhasAtivasDropdown.length === 0" class="px-4 py-2 text-gray-500 text-sm">
            Nenhuma campanha encontrada
          </li>
        </ul>
      </li>

      <li @click="router.push('/edital/adocao')">Adote um Amigo</li>
      <li @click="router.push('/login')">Login</li>

    </ul>
  </nav>

  <div class="campanhas-page">

    <div class="page-header">
      <div class="header-content">
        <h1>Campanhas</h1>
        <p>Confira todas as campanhas ativas e programadas</p>
      </div>
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
          placeholder="Buscar campanhas..."
        />
      </div>
    </section>

    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando campanhas...</p>
    </div>

    <main class="campanhas-container" v-else>
      <div v-if="campanhasFiltradas.length === 0" class="empty-state">
        <h3>Nenhuma campanha encontrada</h3>
        <p>Tente ajustar os filtros ou volte mais tarde.</p>
      </div>

      <div v-else class="campanhas-grid">
        <article
          v-for="campanha in campanhasFiltradas"
          :key="campanha.id"
          class="campanha-card"
          @click="verCampanha(campanha.id)"
        >
          <div class="card-badge">
            <span class="badge-campanha">Campanha</span>
          </div>

          <div class="card-image">
            <img :src="getImagem(campanha)" />
          </div>

          <div class="card-content">
            <h3>{{ getTitulo(campanha) }}</h3>
            <p class="resumo">{{ getResumo(campanha) }}</p>

            <div class="campanha-info">
              <div class="info-item" v-if="campanha.dataInicioCampanha">
                <span>{{ campanha.dataInicioCampanha }} até {{ campanha.dataFimCampanha }}</span>
              </div>

              <div class="info-item" v-if="campanha.horarioCampanha">
                <span>{{ campanha.horarioCampanha }}</span>
              </div>

              <div class="info-item" v-if="campanha.localCampanha">
                <span>{{ campanha.localCampanha }}</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <span>{{ campanha.autor || 'Sistema' }}</span>
            <span>{{ formatarData(campanha.dataPublicacao) }}</span>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>



<script setup>
import { formatDataBR, formatHoraBR } from '@/utils/datetime'

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEditais } from '@/data/editaisData.js'
import { useCampanhas } from '@/data/campanhasData.js'
import zoo from '@/assets/img/zoo.png'
import vete from '@/assets/img/vete.jpg'

const router = useRouter()
const { 
  campanhas, 
  carregando, 
  carregarCampanhas 
} = useCampanhas()
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


const campanhasFiltradas = computed(() => {
  let resultado = [...campanhas.value] 
  
  if (filtros.value.busca.trim()) {
    const termo = filtros.value.busca.toLowerCase()
    resultado = resultado.filter(campanha => {
      const titulo = getTitulo(campanha).toLowerCase()
              return titulo.includes(termo) || resumo.includes(termo)

    })
  }
  
  return resultado
})
  
function getTitulo(campanha) {
  return campanha.nomeCampanha || campanha.titulo
}

function getImagem(campanha) {
  return campanha.urlImagem || vete
}

function getResumo(campanha) {
  if (campanha.resumo) {
    return cortarTexto(campanha.resumo, 120)
  }
  
  if (campanha.description) {
    return cortarTexto(campanha.description, 120)
  }
  
  let resumo = `Campanha ${campanha.nomeCampanha || 'sem nome'}`
  if (campanha.dataInicioCampanha) {
    resumo += ` agendada para ${campanha.dataInicioCampanha}`
  }
  return resumo
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

function formatarPeriodo(campanha) {
  if (!campanha.dataInicioCampanha) return ''
  
  const inicio = campanha.dataInicioCampanha
  const fim = campanha.dataFimCampanha
  
  if (!fim || fim === inicio) {
    return inicio
  }
  
  return `${inicio} até ${fim}`
}

function formatarData(data) {
  if (!data) return ''
  return new Date(data).toLocaleDateString('pt-BR')
}

function verCampanha(id) {
  router.push(`/edital/${id}`)
}



function aplicarFiltros() {
}
</script>

<style scoped>
.campanhas-page {
  background: linear-gradient(135deg, #effff7, #cffaff, #93c5fd);
  width: 100%;
  margin-right: auto;
  align-items: flex-start;
  justify-content: center;
  margin-top: 20px;
  max-width: 10000px;
  flex: 1;
  zoom: 1.1;
  padding-top: 70px; /* espaço para a navbar */
  min-height: 100vh;
  margin-left: auto;
  
}

.btn-voltar {
  position: fixed;
  top: 90px; 
  left: 20px;
  background: none;
  border: none;
  color: #0ea5e9;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  z-index: 500;
}

.btn-voltar:hover {
  color: #0284c7;
}
.page-header {
  text-align: center;
  padding: 2rem 1rem;
  border-radius: 0 60px 0 0;
  margin-bottom: 30px;
}
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
  margin: 0 auto;}

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
.resumo {
    color: #64748b;
    line-height: 1;
    font-size: 1.5rem;
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
  border: 0px solid rgb(217, 242, 255);
   background: linear-gradient(135deg, white, #bfdbfe7e);
  border-radius: 12px;
  font-size: 1.5rem;
  transition: all 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
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