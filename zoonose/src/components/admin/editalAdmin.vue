<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1>
          <span class="icon">📰</span>
          Gerenciar Editais
        </h1>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-number">{{ noticias.length }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-item success">
            <span class="stat-number">{{ campanhas.length }}</span>
            <span class="stat-label">Campanhas</span>
          </div>
          <div class="stat-item info">
            <span class="stat-number">{{ noticiasGerais.length }}</span>
            <span class="stat-label">Notícias</span>
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
            placeholder="🔍 Buscar..."
            @input="aplicarFiltros"
            class="search-input"
          />
        </div>
        
        <div class="filter-group">
          <select 
            v-model="filtros.tipo" 
            @change="aplicarFiltros"
            class="filter-select"
          >
            <option value="">Todos os tipos</option>
            <option value="campanha">📢 Campanhas</option>
            <option value="noticia">📝 Notícias</option>
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
          Novo Item
        </button>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando...</p>
    </div>

    <!-- Error State -->
    <div v-if="erro" class="error-container">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <p>{{ erro }}</p>
        <button @click="limparErro" class="btn-secondary">Fechar</button>
      </div>
    </div>

    <!-- Lista de Itens -->
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
            <span class="badge" :class="`badge-${noticia.tipo || 'noticia'}`">
              {{ getTipoLabel(noticia.tipo) }}
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
          <h3 class="card-title">{{ getTitulo(noticia) }}</h3>
          
          <!-- Conteúdo Campanha -->
          <div v-if="noticia.tipo === 'campanha'" class="card-details campanha-details">
            <div class="detail-row" v-if="noticia.dataInicioCampanha">
              <span class="detail-icon">📅</span>
              <span class="detail-text">{{ noticia.dataInicioCampanha }} até {{ noticia.dataFimCampanha }}</span>
            </div>
            <div class="detail-row" v-if="noticia.horarioCampanha">
              <span class="detail-icon">🕐</span>
              <span class="detail-text">{{ noticia.horarioCampanha }}</span>
            </div>
          </div>

          <!-- Conteúdo Notícia -->
          <p v-else class="card-description">{{ cortarTexto(noticia.resumo, 120) }}</p>
          
          <!-- Imagem Preview -->
          <div v-if="getImagem(noticia)" class="card-image">
            <img :src="getImagem(noticia)" :alt="getTitulo(noticia)" />
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
              👁️ Ver
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
          <h3>Nenhum item encontrado</h3>
          <p v-if="temFiltrosAtivos">Tente ajustar os filtros ou criar um novo item.</p>
          <p v-else>Comece criando seu primeiro item!</p>
          <button @click="abrirModalNoticia()" class="btn-primary">
            ➕ Criar Primeiro Item
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
              {{ modoEdicao ? '✏️ Editar Item' : '➕ Novo Item' }}
            </h2>
            <button @click="fecharModal" class="btn-close">✕</button>
          </div>

          <div class="modal-body">
            <!-- Seletor de Tipo -->
            <div class="form-section">
              <h3>📋 Tipo de Publicação</h3>
              <div class="form-group">
                <div class="radio-group">
                  <label class="radio-label" :class="{ 'radio-active': noticiaForm.tipo === 'campanha' }">
                    <input 
                      type="radio" 
                      v-model="noticiaForm.tipo" 
                      value="campanha"
                      class="radio-input"
                    />
                    <span class="radio-text">📢 Campanha</span>
                  </label>
                  <label class="radio-label" :class="{ 'radio-active': noticiaForm.tipo === 'noticia' }">
                    <input 
                      type="radio" 
                      v-model="noticiaForm.tipo" 
                      value="noticia"
                      class="radio-input"
                    />
                    <span class="radio-text">📝 Notícia</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Formulário CAMPANHA -->
            <div v-if="noticiaForm.tipo === 'campanha'" class="form-section">
              <h3>📢 Dados da Campanha</h3>
              
              <div class="form-group">
                <label for="nomeCampanha">Nome da Campanha *</label>
                <input 
                  id="nomeCampanha"
                  v-model="noticiaForm.nomeCampanha" 
                  type="text"
                  placeholder="Ex: Vacinação Antirrábica 2024"
                  required
                  maxlength="100"
                />
                <small>{{ noticiaForm.nomeCampanha?.length || 0 }}/100 caracteres</small>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="dataInicioCampanha">Data Início *</label>
                  <input 
                    id="dataInicioCampanha"
                    v-model="noticiaForm.dataInicioCampanha" 
                    type="date"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="dataFimCampanha">Data Fim *</label>
                  <input 
                    id="dataFimCampanha"
                    v-model="noticiaForm.dataFimCampanha" 
                    type="date"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="horarioCampanha">Horário da Campanha *</label>
                <input 
                  id="horarioCampanha"
                  v-model="noticiaForm.horarioCampanha" 
                  type="text"
                  placeholder="Ex: 08:00 às 17:00"
                  required
                />
              </div>

              <div class="form-group">
                <label for="urlImagem">URL da Imagem</label>
                <input 
                  id="urlImagem"
                  v-model="noticiaForm.urlImagem" 
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <!-- Preview da Imagem -->
              <div v-if="noticiaForm.urlImagem" class="image-preview">
                <img :src="noticiaForm.urlImagem" alt="Preview" @error="imagemComErro = true" />
                <p v-if="imagemComErro" class="error-text">⚠️ Não foi possível carregar a imagem</p>
              </div>
            </div>

            <!-- Formulário NOTÍCIA -->
            <div v-else class="form-section">
              <h3>📝 Dados da Notícia</h3>
              
              <div class="form-group">
                <label for="nomeNoticia">Nome da Notícia *</label>
                <input 
                  id="nomeNoticia"
                  v-model="noticiaForm.nomeNoticia" 
                  type="text"
                  placeholder="Ex: Novo Centro de Adoção Inaugurado"
                  required
                  maxlength="100"
                />
                <small>{{ noticiaForm.nomeNoticia?.length || 0 }}/100 caracteres</small>
              </div>

              <div class="form-group">
                <label for="resumo">Resumo *</label>
                <textarea 
                  id="resumo"
                  v-model="noticiaForm.resumo" 
                  placeholder="Escreva um resumo da notícia"
                  rows="4"
                  maxlength="500"
                  required
                ></textarea>
                <small>{{ noticiaForm.resumo?.length || 0 }}/500 caracteres</small>
              </div>

              <div class="form-group">
                <label for="urlImagemNoticia">URL da Imagem *</label>
                <input 
                  id="urlImagemNoticia"
                  v-model="noticiaForm.urlImagemNoticia" 
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  required
                />
              </div>

              <!-- Preview da Imagem -->
              <div v-if="noticiaForm.urlImagemNoticia" class="image-preview">
                <img :src="noticiaForm.urlImagemNoticia" alt="Preview" @error="imagemComErro = true" />
                <p v-if="imagemComErro" class="error-text">⚠️ Não foi possível carregar a imagem</p>
              </div>
            </div>

            <!-- Informações Adicionais -->
            <div class="form-section">
              <h3>ℹ️ Informações Adicionais</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="autor">Autor</label>
                  <input 
                    id="autor"
                    v-model="noticiaForm.autor" 
                    type="text"
                    placeholder="Nome do autor"
                  />
                </div>
                
                <div class="form-group">
                  <label for="status">Status</label>
                  <select id="status" v-model="noticiaForm.status">
                    <option value="ativo">✅ Ativo</option>
                    <option value="rascunho">📝 Rascunho</option>
                    <option value="arquivado">📦 Arquivado</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="modal-actions">
              <button type="button" @click="fecharModal" class="btn-secondary">
                Cancelar
              </button>
              <button @click="salvarNoticia" class="btn-primary" :disabled="salvando">
                {{ salvando ? 'Salvando...' : (modoEdicao ? 'Salvar Alterações' : 'Criar Item') }}
              </button>
            </div>
          </div>
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
            <p>Tem certeza que deseja excluir permanentemente:</p>
            <strong>"{{ getTitulo(modalExclusao.noticia) }}"</strong>
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
import { ref, computed, onMounted } from "vue"
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
  tipo: '',
  status: ''
})

// Modal de exclusão
const modalExclusao = ref({
  aberto: false,
  noticia: null
})

// Form da notícia
const noticiaForm = ref({
  tipo: 'campanha',
  // Campos Campanha
  nomeCampanha: '',
  dataInicioCampanha: '',
  dataFimCampanha: '',
  horarioCampanha: '',
  urlImagem: '',
  // Campos Notícia
  nomeNoticia: '',
  urlImagemNoticia: '',
  resumo: '',
  // Comuns
  autor: 'Administrador',
  status: 'ativo',
  dataPublicacao: new Date().toISOString().split('T')[0]
})

// Computed properties
const campanhas = computed(() => 
  noticias.value.filter(n => n.tipo === 'campanha')
)

const noticiasGerais = computed(() => 
  noticias.value.filter(n => n.tipo === 'noticia' || !n.tipo)
)

const noticiasFiltradas = computed(() => {
  let resultado = [...noticias.value]
  
  // Filtro por busca
  if (filtros.value.busca.trim()) {
    const termo = filtros.value.busca.toLowerCase()
    resultado = resultado.filter(n => {
      const titulo = getTitulo(n).toLowerCase()
      const resumo = (n.resumo || '').toLowerCase()
      const autor = (n.autor || '').toLowerCase()
      return titulo.includes(termo) || resumo.includes(termo) || autor.includes(termo)
    })
  }
  
  // Filtro por tipo
  if (filtros.value.tipo) {
    resultado = resultado.filter(n => (n.tipo || 'noticia') === filtros.value.tipo)
  }
  
  // Filtro por status
  if (filtros.value.status) {
    resultado = resultado.filter(n => (n.status || 'ativo') === filtros.value.status)
  }
  
  return resultado.sort((a, b) => new Date(b.dataPublicacao || 0) - new Date(a.dataPublicacao || 0))
})

const temFiltrosAtivos = computed(() => 
  filtros.value.busca || filtros.value.tipo || filtros.value.status
)

// Métodos
function resetarForm() {
  noticiaForm.value = {
    tipo: 'campanha',
    nomeCampanha: '',
    dataInicioCampanha: '',
    dataFimCampanha: '',
    horarioCampanha: '',
    urlImagem: '',
    nomeNoticia: '',
    urlImagemNoticia: '',
    resumo: '',
    autor: 'Administrador',
    status: 'ativo',
    dataPublicacao: new Date().toISOString().split('T')[0]
  }
  imagemComErro.value = false
  modoEdicao.value = false
  noticiaEditandoId.value = null
}

function abrirModalNoticia(noticia = null) {
  if (noticia) {
    noticiaForm.value = JSON.parse(JSON.stringify(noticia))
    // Garantir que tem o tipo
    if (!noticiaForm.value.tipo) {
      noticiaForm.value.tipo = 'noticia'
    }
    modoEdicao.value = true
    noticiaEditandoId.value = noticia.id
  } else {
    resetarForm()
  }
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
  setTimeout(resetarForm, 300)
}

async function salvarNoticia() {
  try {
    salvando.value = true
    
    // Preparar dados conforme o tipo
    const dadosParaSalvar = {
      ...noticiaForm.value,
      dataPublicacao: noticiaForm.value.dataPublicacao || new Date().toISOString().split('T')[0]
    }
    
    if (modoEdicao.value) {
      if (!confirm('⚠️ ATENÇÃO: O backend não suporta edição. As alterações serão salvas apenas localmente e serão perdidas ao recarregar a página. Deseja continuar?')) {
        salvando.value = false
        return
      }
      await editarNoticiaData(noticiaEditandoId.value, dadosParaSalvar)
    } else {
      await adicionarNoticia(dadosParaSalvar)
    }
    
    fecharModal()
    
  } catch (error) {
    console.error('Erro ao salvar:', error)
    alert('Erro ao salvar: ' + error.message)
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
    ...noticia
  }
  
  // Ajustar título conforme o tipo
  if (noticia.tipo === 'campanha') {
    noticiaClone.nomeCampanha = `${noticia.nomeCampanha} (Cópia)`
  } else {
    noticiaClone.nomeNoticia = `${noticia.nomeNoticia || noticia.titulo} (Cópia)`
  }
  
  delete noticiaClone.id
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
    if (!confirm('⚠️ ATENÇÃO: O backend não suporta exclusão. O item será removido apenas localmente e reaparecerá ao recarregar a página. Deseja continuar?')) {
      return
    }
    
    await removerNoticiaPorId(modalExclusao.value.noticia.id)
    cancelarExclusao()
  } catch (error) {
    console.error('Erro ao excluir:', error)
    alert('Erro ao excluir: ' + error.message)
  }
}

function toggleMenuCard(id) {
  menuAberto.value = menuAberto.value === id ? null : id
}

function aplicarFiltros() {
  menuAberto.value = null
}

// Utility functions
function getTipoLabel(tipo) {
  const labels = {
    campanha: '📢 Campanha',
    noticia: '📝 Notícia'
  }
  return labels[tipo] || '📝 Notícia'
}

function getStatusLabel(status) {
  const labels = {
    ativo: '✅ Ativo',
    rascunho: '📝 Rascunho',
    arquivado: '📦 Arquivado'
  }
  return labels[status] || '✅ Ativo'
}

function getTitulo(noticia) {
  if (!noticia) return ''
  if (noticia.tipo === 'campanha') {
    return noticia.nomeCampanha || noticia.titulo || 'Sem título'
  }
  return noticia.nomeNoticia || noticia.titulo || 'Sem título'
}

function getImagem(noticia) {
  if (!noticia) return ''
  if (noticia.tipo === 'campanha') {
    return noticia.urlImagem || noticia.imagem
  }
  return noticia.urlImagemNoticia || noticia.imagem
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
  document.addEventListener('click', () => {
    menuAberto.value = null
  })
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
    background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.dashboard-header {
  background: linear-gradient(135deg, #3b6e54, #a5f3fc, #81b7f6);
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

.stat-item.info {
  background: #dbeafe;
  color: #1e40af;
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



.warning-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #92400e;
}

.warning-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

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
      background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd);

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

.noticias-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

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
  padding: 0.3rem 0.85rem;
  border-radius: 20px;
  font-size: 0.813rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-campanha { 
  background: #dbeafe; 
  color: #1e40af; 
}

.badge-noticia { 
  background: #f1f5f9; 
  color: #475569; 
}

.badge-status-ativo { 
  background: #dcfce7; 
  color: #166534; 
}

.badge-status-rascunho { 
  background: #fef3c7; 
  color: #92400e; 
}

.badge-status-arquivado { 
  background: #f1f5f9; 
  color: #6b7280; 
}

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

.card-menu {
  position: relative;
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
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.card-description {
  color: #64748b;
  line-height: 1.6;
  font-size: 0.938rem;
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

.campanha-details {
  background: #eff6ff;
  border: 1px solid #dbeafe;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.938rem;
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
  font-size: 0.813rem;
  color: #64748b;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-actions {
  display: flex;
  gap: 0.4rem;
}

.card-actions .btn-sm {
  padding: 0.35rem 0.65rem;
  font-size: 0.75rem;
  min-width: auto;
}

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
  padding: 0.4rem 0.75rem;
  font-size: 0.813rem;
  white-space: nowrap;
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

.modal-actions {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

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
  margin-bottom: 1rem;
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
  width: 100%;
  box-sizing: border-box;
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

.radio-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 150px;
}

.radio-label:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.radio-label.radio-active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.radio-input {
  cursor: pointer;
}

.radio-text {
  font-weight: 500;
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

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-stats {
    justify-content: center;
  }

  .warning-banner {
    padding: 1rem;
  }

  .warning-content {
    font-size: 0.875rem;
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

  .modal-content {
    margin: 1rem;
    max-width: none;
  }

  .modal-header,
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

  .radio-group {
    flex-direction: column;
  }

  .radio-label {
    min-width: auto;
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