<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1>
          <span class="icon">⚙️</span>
          Gerenciar Notícias
        </h1>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-number">{{ noticias.length }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-item success">
            <span class="stat-number">{{ noticiasAtivas.length }}</span>
            <span class="stat-label">Ativas</span>
          </div>
          <div class="stat-item warning">
            <span class="stat-number">{{ noticiasRascunho.length }}</span>
            <span class="stat-label">Rascunhos</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Controles e Filtros -->
    <section class="controls-section">
      <div class="search-filters">
        <div class="search-box">
          <input 
            v-model="filtros.busca" 
            type="text"
            placeholder="🔍 Buscar notícias..."
            @input="aplicarFiltros"
            class="search-input"
          />
        </div>
        
        <div class="filter-group">
          <select 
            v-model="filtros.categoria" 
            @change="aplicarFiltros"
            class="filter-select"
          >
            <option value="">Todas as categorias</option>
            <option value="vacinacao">🏥 Vacinação</option>
            <option value="adocao">🐕 Adoção</option>
            <option value="campanha">📢 Campanha</option>
            <option value="evento">🎪 Evento</option>
            <option value="geral">📝 Geral</option>
          </select>
          
          <select 
            v-model="filtros.status" 
            @change="aplicarFiltros"
            class="filter-select"
          >
            <option value="">Todos os status</option>
            <option value="ativo">✅ Ativo</option>
            <option value="rascunho">📝 Rascunho</option>
            <option value="arquivado">📦 Arquivado</option>
          </select>
        </div>

        <button 
          @click="abrirModalNoticia()" 
          class="btn-primary btn-add"
        >
          <span>➕</span>
          Nova Notícia
        </button>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando notícias...</p>
    </div>

    <!-- Error State -->
    <div v-if="erro" class="error-container">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <p>{{ erro }}</p>
        <button @click="limparErro" class="btn-secondary">Fechar</button>
      </div>
    </div>

    <!-- Lista de Notícias -->
    <section class="noticias-grid" v-if="!carregando">
      <div 
        v-for="noticia in noticiasFiltradas" 
        :key="noticia.id"
        class="noticia-card"
        :class="{ 
          'status-rascunho': noticia.status === 'rascunho',
          'status-arquivado': noticia.status === 'arquivado'
        }"
      >
        <!-- Card Header -->
        <div class="card-header">
          <div class="card-badges">
            <span class="badge" :class="`badge-${noticia.categoria || 'geral'}`">
              {{ getCategoriaLabel(noticia.categoria) }}
            </span>
            <span class="badge" :class="`badge-status-${noticia.status || 'ativo'}`">
              {{ getStatusLabel(noticia.status) }}
            </span>
          </div>
          <div class="card-menu">
            <button @click="toggleMenuCard(noticia.id)" class="btn-menu">⋮</button>
            <div v-if="menuAberto === noticia.id" class="dropdown-menu">
              <button @click="editarNoticia(noticia)">✏️ Editar</button>
              <button @click="duplicarNoticia(noticia)">📋 Duplicar</button>
              <button v-if="noticia.status === 'ativo'" @click="alterarStatus(noticia.id, 'arquivado')">
                📦 Arquivar
              </button>
              <button v-else @click="alterarStatus(noticia.id, 'ativo')">
                ✅ Ativar
              </button>
              <hr>
              <button @click="confirmarExclusao(noticia)" class="btn-danger">🗑️ Excluir</button>
            </div>
          </div>
        </div>

        <!-- Card Content -->
        <div class="card-content">
          <h3 class="card-title">{{ noticia.titulo }}</h3>
          <p class="card-description">{{ cortarTexto(noticia.resumo, 120) }}</p>
          
          <!-- Imagem Preview -->
          <div v-if="noticia.imagem" class="card-image">
            <img :src="noticia.imagem" :alt="noticia.titulo" />
          </div>
          
          <!-- Detalhes do Evento -->
          <div v-if="temDetalhes(noticia)" class="card-details">
            <div class="detail-row" v-if="noticia.detalhes?.data">
              <span class="detail-icon">📅</span>
              <span class="detail-text">{{ noticia.detalhes.data }}</span>
            </div>
            <div class="detail-row" v-if="noticia.detalhes?.local">
              <span class="detail-icon">📍</span>
              <span class="detail-text">{{ noticia.detalhes.local }}</span>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="card-footer">
          <div class="card-meta">
            <span class="meta-item">
              <span class="meta-icon">👤</span>
              {{ noticia.autor || 'Sistema' }}
            </span>
            <span class="meta-item">
              <span class="meta-icon">📅</span>
              {{ formatarData(noticia.dataPublicacao) }}
            </span>
          </div>
          
          <div class="card-actions">
            <router-link 
              :to="`/edital/${noticia.id}`" 
              class="btn-secondary btn-sm"
              target="_blank"
            >
              👁️ Visualizar
            </router-link>
            <button 
              @click="editarNoticia(noticia)" 
              class="btn-primary btn-sm"
            >
              ✏️ Editar
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="noticiasFiltradas.length === 0" class="empty-state">
        <div class="empty-content">
          <span class="empty-icon">📰</span>
          <h3>Nenhuma notícia encontrada</h3>
          <p v-if="temFiltrosAtivos">Tente ajustar os filtros ou criar uma nova notícia.</p>
          <p v-else>Comece criando sua primeira notícia!</p>
          <button @click="abrirModalNoticia()" class="btn-primary">
            ➕ Criar Primeira Notícia
          </button>
        </div>
      </div>
    </section>

    <!-- Modal de Criação/Edição -->
    <teleport to="body">
      <div v-if="modalAberto" class="modal-overlay" @click="fecharModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>
              {{ modoEdicao ? '✏️ Editar Notícia' : '➕ Nova Notícia' }}
            </h2>
            <button @click="fecharModal" class="btn-close">✕</button>
          </div>

          <form @submit.prevent="salvarNoticia" class="modal-form">
            <!-- Informações Básicas -->
            <div class="form-section">
              <h3>📝 Informações Básicas</h3>
              
              <div class="form-row">
                <div class="form-group flex-2">
                  <label for="titulo">Título *</label>
                  <input 
                    id="titulo"
                    v-model="noticiaForm.titulo" 
                    type="text"
                    placeholder="Digite o título da notícia"
                    required 
                    maxlength="100"
                  />
                  <small>{{ noticiaForm.titulo.length }}/100 caracteres</small>
                </div>
                
                <div class="form-group">
                  <label for="categoria">Categoria</label>
                  <select id="categoria" v-model="noticiaForm.categoria">
                    <option value="geral">📝 Geral</option>
                    <option value="vacinacao">🏥 Vacinação</option>
                    <option value="adocao">🐕 Adoção</option>
                    <option value="campanha">📢 Campanha</option>
                    <option value="evento">🎪 Evento</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="resumo">Resumo</label>
                <textarea 
                  id="resumo"
                  v-model="noticiaForm.resumo" 
                  placeholder="Escreva um resumo da notícia"
                  rows="3"
                  maxlength="300"
                ></textarea>
                <small>{{ noticiaForm.resumo.length }}/300 caracteres</small>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="imagem">URL da Imagem</label>
                  <input 
                    id="imagem"
                    v-model="noticiaForm.imagem" 
                    type="url"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
                
                <div class="form-group">
                  <label for="autor">Autor</label>
                  <input 
                    id="autor"
                    v-model="noticiaForm.autor" 
                    type="text"
                    placeholder="Nome do autor"
                  />
                </div>
              </div>

              <!-- Preview da Imagem -->
              <div v-if="noticiaForm.imagem" class="image-preview">
                <img :src="noticiaForm.imagem" alt="Preview" @error="imagemComErro = true" />
                <p v-if="imagemComErro" class="error-text">⚠️ Não foi possível carregar a imagem</p>
              </div>
            </div>

            <!-- Detalhes do Evento -->
            <div class="form-section">
              <h3>📅 Detalhes do Evento</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="data">Data</label>
                  <input 
                    id="data"
                    v-model="noticiaForm.detalhes.data" 
                    type="text"
                    placeholder="Ex: 20/12/2024 ou 20 a 25/12/2024"
                  />
                </div>
                
                <div class="form-group">
                  <label for="horario">Horário</label>
                  <input 
                    id="horario"
                    v-model="noticiaForm.detalhes.horario" 
                    type="text"
                    placeholder="Ex: 08h às 17h"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="local">Local</label>
                <input 
                  id="local"
                  v-model="noticiaForm.detalhes.local" 
                  type="text"
                  placeholder="Ex: Centro Veterinário Municipal"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="publico">Público-alvo</label>
                  <input 
                    id="publico"
                    v-model="noticiaForm.detalhes.publico" 
                    type="text"
                    placeholder="Ex: Pets cadastrados"
                  />
                </div>
                
                <div class="form-group">
                  <label for="contato">Contato</label>
                  <input 
                    id="contato"
                    v-model="noticiaForm.detalhes.contato" 
                    type="text"
                    placeholder="Ex: (11) 99999-0000"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="inscricoes">Informações de Inscrição</label>
                <input 
                  id="inscricoes"
                  v-model="noticiaForm.detalhes.inscricoes" 
                  type="text"
                  placeholder="Ex: Não é necessário agendamento"
                />
              </div>
            </div>

            <!-- Actions -->
            <div class="modal-actions">
              <button type="button" @click="fecharModal" class="btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn-primary" :disabled="salvando">
                {{ salvando ? 'Salvando...' : (modoEdicao ? 'Salvar Alterações' : 'Criar Notícia') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>

    <!-- Modal de Confirmação de Exclusão -->
    <teleport to="body">
      <div v-if="modalExclusao.aberto" class="modal-overlay" @click="cancelarExclusao">
        <div class="modal-content modal-small" @click.stop>
          <div class="modal-header">
            <h2>🗑️ Confirmar Exclusão</h2>
          </div>
          
          <div class="modal-body">
            <p>Tem certeza que deseja excluir permanentemente a notícia:</p>
            <strong>"{{ modalExclusao.noticia?.titulo }}"</strong>
            <p class="warning-text">⚠️ Esta ação não pode ser desfeita!</p>
          </div>
          
          <div class="modal-actions">
            <button @click="cancelarExclusao" class="btn-secondary">
              Cancelar
            </button>
            <button @click="confirmarExclusaoFinal" class="btn-danger">
              Sim, Excluir
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useNoticias } from "@/data/noticiasData.js"

// Composables
const { 
  noticias, 
  carregando, 
  erro,
  carregarNoticias,
  adicionarNoticia,
  editarNoticia: editarNoticiaData,
  removerNoticiaPorId,
  alterarStatusNoticia,
  limparErro
} = useNoticias()

// Estados do componente
const modalAberto = ref(false)
const modoEdicao = ref(false)
const noticiaEditandoId = ref(null)
const salvando = ref(false)
const imagemComErro = ref(false)
const menuAberto = ref(null)

// Estados de filtro
const filtros = ref({
  busca: '',
  categoria: '',
  status: ''
})

// Modal de exclusão
const modalExclusao = ref({
  aberto: false,
  noticia: null
})

// Form da notícia
const noticiaForm = ref({
  titulo: '',
  resumo: '',
  imagem: '',
  categoria: 'geral',
  autor: 'Administrador',
  detalhes: {
    data: '',
    horario: '',
    local: '',
    publico: '',
    contato: '',
    inscricoes: ''
  }
})

// Computed properties
const noticiasAtivas = computed(() => 
  noticias.value.filter(n => n.status === 'ativo' || !n.status)
)

const noticiasRascunho = computed(() => 
  noticias.value.filter(n => n.status === 'rascunho')
)

const noticiasFiltradas = computed(() => {
  let resultado = [...noticias.value]
  
  // Filtro por busca
  if (filtros.value.busca.trim()) {
    const termo = filtros.value.busca.toLowerCase()
    resultado = resultado.filter(n => 
      n.titulo.toLowerCase().includes(termo) ||
      n.resumo.toLowerCase().includes(termo) ||
      (n.autor && n.autor.toLowerCase().includes(termo))
    )
  }
  
  // Filtro por categoria
  if (filtros.value.categoria) {
    resultado = resultado.filter(n => n.categoria === filtros.value.categoria)
  }
  
  // Filtro por status
  if (filtros.value.status) {
    resultado = resultado.filter(n => (n.status || 'ativo') === filtros.value.status)
  }
  
  return resultado.sort((a, b) => new Date(b.dataPublicacao || 0) - new Date(a.dataPublicacao || 0))
})

const temFiltrosAtivos = computed(() => 
  filtros.value.busca || filtros.value.categoria || filtros.value.status
)

// Métodos
function resetarForm() {
  noticiaForm.value = {
    titulo: '',
    resumo: '',
    imagem: '',
    categoria: 'geral',
    autor: 'Administrador',
    detalhes: {
      data: '',
      horario: '',
      local: '',
      publico: '',
      contato: '',
      inscricoes: ''
    }
  }
  imagemComErro.value = false
  modoEdicao.value = false
  noticiaEditandoId.value = null
}

function abrirModalNoticia(noticia = null) {
  if (noticia) {
    // Modo edição
    noticiaForm.value = { ...noticia }
    modoEdicao.value = true
    noticiaEditandoId.value = noticia.id
  } else {
    // Modo criação
    resetarForm()
  }
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
  setTimeout(resetarForm, 300) // Aguarda animação
}

async function salvarNoticia() {
  try {
    salvando.value = true
    
    if (modoEdicao.value) {
      await editarNoticiaData(noticiaEditandoId.value, noticiaForm.value)
    } else {
      await adicionarNoticia(noticiaForm.value)
    }
    
    fecharModal()
    
  } catch (error) {
    console.error('Erro ao salvar notícia:', error)
  } finally {
    salvando.value = false
  }
}

function editarNoticia(noticia) {
  menuAberto.value = null
  abrirModalNoticia(noticia)
}

function duplicarNoticia(noticia) {
  menuAberto.value = null
  const noticiaClone = { 
    ...noticia, 
    titulo: `${noticia.titulo} (Cópia)`,
    id: undefined 
  }
  abrirModalNoticia(noticiaClone)
}

async function alterarStatus(id, novoStatus) {
  try {
    await alterarStatusNoticia(id, novoStatus)
    menuAberto.value = null
  } catch (error) {
    console.error('Erro ao alterar status:', error)
  }
}

function confirmarExclusao(noticia) {
  modalExclusao.value = {
    aberto: true,
    noticia
  }
  menuAberto.value = null
}

function cancelarExclusao() {
  modalExclusao.value = {
    aberto: false,
    noticia: null
  }
}

async function confirmarExclusaoFinal() {
  try {
    await removerNoticiaPorId(modalExclusao.value.noticia.id)
    cancelarExclusao()
  } catch (error) {
    console.error('Erro ao excluir notícia:', error)
  }
}

function toggleMenuCard(id) {
  menuAberto.value = menuAberto.value === id ? null : id
}

function aplicarFiltros() {
  // Os filtros são aplicados automaticamente via computed
  menuAberto.value = null
}

// Utility functions
function getCategoriaLabel(categoria) {
  const labels = {
    vacinacao: '🏥 Vacinação',
    adocao: '🐕 Adoção',
    campanha: '📢 Campanha',
    evento: '🎪 Evento',
    geral: '📝 Geral'
  }
  return labels[categoria] || '📝 Geral'
}

function getStatusLabel(status) {
  const labels = {
    ativo: '✅ Ativo',
    rascunho: '📝 Rascunho',
    arquivado: '📦 Arquivado'
  }
  return labels[status] || '✅ Ativo'
}

function temDetalhes(noticia) {
  const det = noticia.detalhes
  return det && (det.data || det.horario || det.local || det.publico || det.contato)
}

function cortarTexto(texto, limite) {
  if (!texto) return ''
  return texto.length <= limite ? texto : texto.slice(0, limite) + '...'
}

function formatarData(dataISO) {
  if (!dataISO) return 'Data não definida'
  return new Date(dataISO).toLocaleDateString('pt-BR')
}

// Lifecycle
onMounted(() => {
  carregarNoticias()
})

// Fechar menus ao clicar fora
onMounted(() => {
  document.addEventListener('click', () => {
    menuAberto.value = null
  })
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header */
.dashboard-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
  padding: 0.75rem 1rem;
  background: #f1f5f9;
  border-radius: 12px;
  min-width: 80px;
}

.stat-item.success {
  background: #dcfce7;
  color: #166534;
}

.stat-item.warning {
  background: #fef3c7;
  color: #92400e;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Controls */
.controls-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.search-filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-group {
  display: flex;
  gap: 0.75rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  font-size: 0.9rem;
  min-width: 150px;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

/* Loading & Error */
.loading-container {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.error-content {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #dc2626;
}

/* Grid de Notícias */
.noticias-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

/* Card de Notícia */
.noticia-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.noticia-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.noticia-card.status-rascunho {
  border-left: 4px solid #f59e0b;
}

.noticia-card.status-arquivado {
  opacity: 0.7;
  border-left: 4px solid #6b7280;
}

.card-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #f1f5f9;
}

.card-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-vacinacao { background: #dcfce7; color: #166534; }
.badge-adocao { background: #fed7aa; color: #9a3412; }
.badge-campanha { background: #dbeafe; color: #1e40af; }
.badge-evento { background: #fce7f3; color: #be185d; }
.badge-geral { background: #f1f5f9; color: #475569; }

.badge-status-ativo { background: #dcfce7; color: #166534; }
.badge-status-rascunho { background: #fef3c7; color: #92400e; }
.badge-status-arquivado { background: #f1f5f9; color: #6b7280; }

.btn-menu {
  background: none;
  border: none;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  color: #64748b;
  position: relative;
}

.btn-menu:hover {
  background: #f1f5f9;
  color: #334155;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  min-width: 150px;
  z-index: 10;
}

.dropdown-menu button {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
}

.dropdown-menu button:hover {
  background: #f9fafb;
}

.dropdown-menu button.btn-danger {
  color: #dc2626;
}

.dropdown-menu button.btn-danger:hover {
  background: #fef2f2;
}

.dropdown-menu hr {
  margin: 0.25rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

.card-content {
  padding: 1rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.card-description {
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.card-image {
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.card-details {
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: #475569;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-icon {
  width: 16px;
  text-align: center;
}

.card-footer {
  padding: 1rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #64748b;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
}

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-content h3 {
  font-size: 1.5rem;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-content p {
  color: #6b7280;
  margin: 0 0 2rem 0;
}

/* Buttons */
.btn-primary, .btn-secondary, .btn-danger, .btn-close {
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  text-decoration: none;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover {
  background: #b91c1c;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-close {
  background: none;
  color: #6b7280;
  padding: 0.5rem;
  font-size: 1.25rem;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
}

.btn-close:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-small {
  max-width: 400px;
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1f2937;
}

.modal-body {
  padding: 1.5rem 2rem;
}

.modal-form {
  padding: 1.5rem 2rem;
}

.modal-actions {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Form */
.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  color: #374151;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.flex-2 {
  grid-column: span 2;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group small {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.image-preview {
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.image-preview img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.error-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0.5rem 0;
  text-align: center;
}

.warning-text {
  color: #d97706;
  font-size: 0.875rem;
  margin: 1rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-stats {
    justify-content: center;
  }

  .search-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: column;
  }

  .noticias-grid {
    grid-template-columns: 1fr;
    padding: 0 1rem 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-group.flex-2 {
    grid-column: span 1;
  }

  .modal-content {
    margin: 1rem;
    max-width: none;
  }

  .modal-header,
  .modal-form,
  .modal-body,
  .modal-actions {
    padding: 1rem;
  }

  .card-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .card-meta {
    justify-content: space-between;
  }

  .card-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 1rem;
  }

  .controls-section {
    padding: 1rem;
  }

  .btn-add span {
    display: none;
  }
}
</style>