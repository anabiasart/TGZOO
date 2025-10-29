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

    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="toast.mostrar" class="toast" :class="toast.tipo">
        <span class="toast-icon">{{ toast.tipo === 'success' ? '✅' : '❌' }}</span>
        <span class="toast-message">{{ toast.mensagem }}</span>
      </div>
    </transition>

    <!-- Controles e Filtros -->
    <section class="controls-section">
      <div class="search-filters">
        <div class="search-box">
          <input 
            v-model="filtros.busca" 
            type="text"
            placeholder="🔍 Buscar por título, autor..."
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
            </div>
            <div class="card-badges-left">
            <span class="badge" :class="`badge-status-${noticia.status || 'ativo'}`">
              {{ getStatusLabel(noticia.status) }}
            </span>
          </div>
          <div class="card-menu">
            <div v-if="menuAberto === noticia.id" class="dropdown-menu">
              <button @click="editarNoticia(noticia)">
                <span class="menu-icon">✏️</span>
                Editar
              </button>
              <button @click="duplicarNoticia(noticia)">
                <span class="menu-icon">📋</span>
                Duplicar
              </button>
              <button v-if="noticia.status === 'ativo'" @click="alterarStatus(noticia.id, 'arquivado')">
                <span class="menu-icon">📦</span>
                Arquivar
              </button>
              <button v-else @click="alterarStatus(noticia.id, 'ativo')">
                <span class="menu-icon">✅</span>
                Ativar
              </button>
              <hr>
              <button @click="confirmarExclusao(noticia)" class="btn-danger">
                <span class="menu-icon">🗑️</span>
                Excluir
              </button>
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
              <span class="detail-text">{{formatDataBR(noticia.dataInicioCampanha) }} até {{ formatDataBR(noticia.dataFimCampanha) }}</span>
            </div>
            <div class="detail-row" v-if="noticia.horarioCampanha">
              <span class="detail-icon">🕐</span>
              <span class="detail-text">{{formatHoraBR(noticia.horaInicioCampanha) }} às {{formatHoraBR(noticia.horaFimCampanha) }}</span>
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
              {{(noticia.dataPublicacao) }}
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
      <transition name="modal">
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
                    placeholder="Ex: Vacinação Antirrábica 2025"
                    required
                    maxlength="100"
                  />
                  <small>{{ noticiaForm.nomeCampanha?.length || 0 }}/100 caracteres</small>
                </div>

                <!-- Campos de Data e Hora Início -->
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
    <label for="horaInicioCampanha">Hora Início *</label>
    <input 
      id="horaInicioCampanha"
      v-model="noticiaForm.horaInicioCampanha" 
      type="time"
      required
    />
  </div>
</div>

<!-- Campos de Data e Hora Fim -->
<div class="form-row">
  <div class="form-group">
    <label for="dataFimCampanha">Data Fim *</label>
    <input 
      id="dataFimCampanha"
      v-model="noticiaForm.dataFimCampanha" 
      type="date"
      required
    />
  </div>
  
  <div class="form-group">
    <label for="horaFimCampanha">Hora Fim *</label>
    <input 
      id="horaFimCampanha"
      v-model="noticiaForm.horaFimCampanha" 
      type="time"
      required
    />
  </div>
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
                <div class="modal-actions-left">
                  <button 
                    v-if="modoEdicao" 
                    type="button" 
                    @click="excluirDoModal" 
                    class="btn-danger"
                  >
                    🗑️ Excluir
                  </button>
                </div>
                <div class="modal-actions-right">
                  <button type="button" @click="fecharModal" class="btn-secondary">
                    Cancelar
                  </button>
                  <button @click="salvarNoticia" class="btn-primary" :disabled="salvando">
                    <span v-if="salvando" class="spinner-small"></span>
                    {{ salvando ? 'Salvando...' : (modoEdicao ? 'Salvar Alterações' : 'Criar Item') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Modal de Confirmação de Exclusão -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="modalExclusao.aberto" class="modal-overlay" @click="cancelarExclusao">
          <div class="modal-content modal-small" @click.stop>
            <div class="modal-header">
              <h2>🗑️ Confirmar Exclusão</h2>
            </div>
            
            <div class="modal-body">
              <p>Tem certeza que deseja excluir permanentemente:</p>
              <strong class="item-destaque">"{{ getTitulo(modalExclusao.noticia) }}"</strong>
              <p class="warning-text">⚠️ Esta ação não pode ser desfeita!</p>
            </div>
            
            <div class="modal-actions">
              <button @click="cancelarExclusao" class="btn-secondary">
                Cancelar
              </button>
              <button @click="confirmarExclusaoFinal" class="btn-danger" :disabled="excluindo">
                <span v-if="excluindo" class="spinner-small"></span>
                {{ excluindo ? 'Excluindo...' : 'Sim, Excluir' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useEditais } from "@/data/editaisData.js"
import { formatDataBR, formatHoraBR, parseBackendTs, toBackendTimestamp } from '@/utils/datetime'

const {
  todosItens: noticias,
  carregando,
  erro,
  carregarTodos: carregarNoticias,
  adicionarItem: adicionarNoticia,
  editarItem: editarNoticiaData,
  removerItem: removerNoticiaPorId,
  alterarStatus: alterarStatusNoticia,
  limparErro
} = useEditais()

const modalAberto = ref(false)
const modoEdicao = ref(false)
const noticiaEditandoId = ref(null)
const salvando = ref(false)
const excluindo = ref(false)
const imagemComErro = ref(false)
const menuAberto = ref(null)

const toast = ref({
  mostrar: false,
  tipo: 'success',
  mensagem: ''
})

const filtros = ref({
  busca: '',
  tipo: '',
  status: ''
})

const modalExclusao = ref({
  aberto: false,
  noticia: null
})

const noticiaForm = ref({
  tipo: 'campanha',
  nomeCampanha: '',
  dataInicioCampanha: '',
  horaInicioCampanha: '',
  dataFimCampanha: '',
  horaFimCampanha: '',
  urlImagem: '',
  nomeNoticia: '',
  urlImagemNoticia: '',
  resumo: '',
  autor: 'Administrador',
  status: 'ativo',
  dataPublicacao: new Date().toISOString().split('T')[0]
})


function resetarForm() {
  noticiaForm.value = {
    tipo: 'campanha',
    nomeCampanha: '',
    dataInicioCampanha: '',
    horaInicioCampanha: '',
    dataFimCampanha: '',
    horaFimCampanha: '',
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

const campanhas = computed(() =>
  noticias.value.filter(n => n.tipo === 'campanha')
)

const noticiasGerais = computed(() =>
  noticias.value.filter(n => n.tipo === 'noticia')
)

const noticiasFiltradas = computed(() => {
  let resultado = [...noticias.value]

  if (filtros.value.busca.trim()) {
    const termo = filtros.value.busca.toLowerCase()
    resultado = resultado.filter(n => {
      const titulo = getTitulo(n).toLowerCase()
      const resumo = (n.resumo || '').toLowerCase()
      const autor = (n.autor || '').toLowerCase()
      return titulo.includes(termo) || resumo.includes(termo) || autor.includes(termo)
    })
  }

  if (filtros.value.tipo) {
    resultado = resultado.filter(n => (n.tipo || 'noticia') === filtros.value.tipo)
  }

  if (filtros.value.status) {
    resultado = resultado.filter(n => (n.status || 'ativo') === filtros.value.status)
  }

  return resultado.sort((a, b) =>
    new Date(b.dataPublicacao || 0) - new Date(a.dataPublicacao || 0)
  )
})

const temFiltrosAtivos = computed(() =>
  filtros.value.busca || filtros.value.tipo || filtros.value.status
)

function mostrarToast(tipo, mensagem) {
  toast.value = { mostrar: true, tipo, mensagem }
  setTimeout(() => {
    toast.value.mostrar = false
  }, 3000)
}

function ajustarDataParaInput(ts) {
  const d = parseBackendTs(ts);
  return d ? d.toISOString().split('T')[0] : '';
}


function prepararDatasParaSalvar() {
  if (noticiaForm.value.tipo !== 'campanha') return

  noticiaForm.value.dataInicioCampanha =
    toBackendTimestamp(noticiaForm.value.dataInicioCampanha)

  noticiaForm.value.dataFimCampanha =
    toBackendTimestamp(noticiaForm.value.dataFimCampanha)
}



function abrirModalNoticia(noticia = null) {
  if (noticia) {
    noticiaForm.value = JSON.parse(JSON.stringify(noticia))
    modoEdicao.value = true
    noticiaEditandoId.value = noticia.id

    if (!noticiaForm.value.tipo) noticiaForm.value.tipo = 'noticia'

    if (noticiaForm.value.tipo === 'campanha') {
      noticiaForm.value.dataInicioCampanha = ajustarDataParaInput(noticia.dataInicioCampanha)
      noticiaForm.value.dataFimCampanha = ajustarDataParaInput(noticia.dataFimCampanha)
    }
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
    
    const dadosParaSalvar = {
      ...noticiaForm.value,
      dataPublicacao: noticiaForm.value.dataPublicacao || new Date().toISOString().split('T')[0]
    }
    
    if (noticiaForm.value.tipo === 'campanha') {
      dadosParaSalvar.startDateTime = `${noticiaForm.value.dataInicioCampanha} ${noticiaForm.value.horaInicioCampanha}:00`
      
      if (noticiaForm.value.dataFimCampanha && noticiaForm.value.horaFimCampanha) {
        dadosParaSalvar.endDateTime = `${noticiaForm.value.dataFimCampanha} ${noticiaForm.value.horaFimCampanha}:00`
      }
      
      delete dadosParaSalvar.dataInicioCampanha
      delete dadosParaSalvar.horaInicioCampanha
      delete dadosParaSalvar.dataFimCampanha
      delete dadosParaSalvar.horaFimCampanha
    }
    
    if (modoEdicao.value) {
      await editarNoticiaData(noticiaEditandoId.value, dadosParaSalvar)
      mostrarToast('success', '✅ Item atualizado com sucesso!')
    } else {
      await adicionarNoticia(dadosParaSalvar)
      mostrarToast('success', '✅ Item criado com sucesso!')
    }
    
    fecharModal()
    
  } catch (error) {
    console.error('Erro ao salvar:', error)
    mostrarToast('error', '❌ ' + error.message)
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

  const clone = {
    ...noticia,
    nomeCampanha: noticia.nomeCampanha ? `${noticia.nomeCampanha} (Cópia)` : '',
    nomeNoticia: noticia.nomeNoticia ? `${noticia.nomeNoticia} (Cópia)` : '',
  }

  delete clone.id
  abrirModalNoticia(clone)
}

async function alterarStatus(id, novoStatus) {
  try {
    const item = noticias.value.find(n => n.id === id)
    await alterarStatusNoticia(id, novoStatus, item?.tipo || 'noticia')
    mostrarToast('success', `Status: ${novoStatus}`)
    menuAberto.value = null
  } catch (err) {
    mostrarToast('error', '❌ Falha ao mudar status')
  }
}

// ✅ Exclusão
function confirmarExclusao(noticia) {
  modalExclusao.value = { aberto: true, noticia }
}

function excluirDoModal() {
  confirmarExclusao({ id: noticiaEditandoId.value })
  fecharModal()
}

function cancelarExclusao() {
  modalExclusao.value.aberto = false
  modalExclusao.value.noticia = null
}

async function confirmarExclusaoFinal() {
  try {
    excluindo.value = true
    await removerNoticiaPorId(modalExclusao.value.noticia.id)
    mostrarToast('success', '🗑️ Deletado!')
  } catch {
    mostrarToast('error', '❌ Falha ao excluir!')
  } finally {
    cancelarExclusao()
    excluindo.value = false
  }
}

function toggleMenuCard(id) {
  menuAberto.value = menuAberto.value === id ? null : id
}

function aplicarFiltros() {
  menuAberto.value = null
}

function getTipoLabel(tipo) {
  return tipo === 'campanha' ? '📢 Campanha' : '📝 Notícia'
}

function getStatusLabel(status) {
  const map = {
    ativo: '✅ Ativo',
    rascunho: '📝 Rascunho',
    arquivado: '📦 Arquivado'
  }
  return map[status] || map.ativo
}

function getTitulo(noticia) {
  return noticia.tipo === 'campanha'
    ? noticia.nomeCampanha || 'Sem título'
    : noticia.nomeNoticia || 'Sem título'
}

function getImagem(noticia) {
  return noticia.urlImagemNoticia || noticia.urlImagem || null
}

function cortarTexto(txt, limit) {
  return txt && txt.length > limit ? txt.slice(0, limit) + '...' : txt
}

onMounted(() => {
  carregarNoticias()
  document.addEventListener('click', () => (menuAberto.value = null))
})
</script>


<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd); 
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.dashboard-header {
   background: linear-gradient(150deg, white, #a5f3fc); 
  backdrop-filter: blur(100px);
  padding: 2rem;
  border-radius: 0rem 10rem 0rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 0.9rem 2.5rem;
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
  font-size: 2.5rem;
  font-weight: 700;
}

.stat-label {
  display: block;
  font-size: 0.999rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0px;
}

/* Toast Notifications */
.toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;
  min-width: 300px;
  border-left: 4px solid;
}

.toast.success {
  border-left-color: #10b981;
}

.toast.error {
  border-left-color: #ef4444;
}

.toast-icon {
  font-size: 1.5rem;
}

.toast-message {
  font-weight: 500;
  color: #374151;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
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
  min-width: 150px;
  align-items: last baseline;

}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 0px solid white;
   background: linear-gradient(135deg, white, #bfdbfe7e);
  border-radius: 12px;
  font-size: 1.5rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-group {
  display: flex;
  gap: 1.75rem;
}

.filter-select {
  padding: 0.9rem 1.5rem;
  border: 0px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  font-size: 1.2rem;
  min-width: 150px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:hover {
  border-color: #cbd5e1;
}

.filter-select:focus {
  outline: none;
  border-color: #bfdbfe;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  margin-right: 0.5rem;
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

.error-icon {
  font-size: 1.5rem;
}

.noticias-grid {
  max-width: 1300px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 2fr));
  gap: 0.999rem;
}

.noticia-card {
  background: white;
  border-radius: 20px;
  border: 2px solid transparent;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  height: 100%;
  transition: all 0.3s ease;
   cursor: pointer;
  position: relative;
  justify-content: space-between;

}

.noticia-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
}

.noticia-card.status-rascunho {
  border-left: 4px solid #f59e0b;
}

.noticia-card.status-arquivado {
  opacity: 0.7;
  border-left: 4px solid #6b7280;
}

.card-header {
  padding: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 3px solid #f1f5f9;
}

.card-badges {
  display: inline-flex;
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}


.card-badges-left {
  display: inline-flex;
  position: absolute;
  top: 12px;
  left: 12px; 
  z-index: 10;
}

.badge {
  padding: 3px 14px;
  border-radius: 20px;
  font-size: 0.999rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.badge-campanha { 
  background: linear-gradient(135deg, #b0d5ff, #6488ff, #93c5fd); 
  color: rgb(235, 235, 235);
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
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  font-size: 1.25rem;
  transition: all 0.2s;
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
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  min-width: 160px;
  z-index: 10;
  overflow: hidden;
}

.dropdown-menu button {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
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

.menu-icon {
  width: 20px;
  text-align: center;
}

.card-content {
  padding:0.999rem;
  overflow: hidden;
  }

.card-title {
  font-size: 2rem;
  font-weight: 200;
  color: #1e293b;
  margin: 0.5rem 1rem 1.2rem;
  line-height: 1.2;
}

.card-description {
  color: #64748b;
  line-height: 1.2;
  font-size: 1.5rem;
  margin: 0 auto;
  padding: 0rem 0rem 0rem;

}

.card-image {
  margin: 1rem 0 0;
  border-radius: 6px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s;
   height: 250px;
  overflow: hidden;
}

.noticia-card:hover .card-image img {
  transform: scale(1.05);
}

.card-details {
  background: #f8fafc;
  padding: 0.999rem;
  border-radius: 8px;
  margin: 0.75rem 0;
}

.campanha-details {
  background: #eff6ff;
  border: 2px solid transparent;
} 

.detail-row {
  display: flex;
  align-items: normal;
 gap: 1rem;
  font-size: 1.1rem;
  font-weight: 350;
   margin:0;
  color: #475569;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-icon {
   width:25px;
  text-align: flex;
  flex-grow: 1;
}

.card-footer {
 padding: 1rem 2rem;
  border-top: 1px solid #a5d2ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
}

.card-meta {
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

.card-actions {
  display: flex;
  gap: 1.5rem;
  
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
  opacity: 0.5;
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
  border-radius: 5px;
  padding: 0.5rem 2rem;
  font-weight: 550;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 0.5rem;
  font-size: 1.2rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
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
  border-color: #cbd5e1;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.btn-danger:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.813rem;
  white-space: nowrap;
}

.btn-close {
  background: none;
  color: #6b7280;
  padding: 0.5rem;
  font-size: 1.5rem;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
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
  padding: 2rem;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: white;
  border-radius: 36px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-small {
  max-width: 450px;
}

.modal-header {
  padding: 1.9rem 1.9rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.modal-header h2 {
  margin: 0;
  font-size: 2.5rem;
  color: #1f2937;
}

.modal-body {
  padding: 2rem 2rem;
}

.modal-actions {
  padding: 1rem 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  position: sticky;
  bottom: 0;
  background: white;
}

.modal-actions-left {
  flex: 0;
}

.modal-actions-right {
  display: flex;
  gap: 1rem;
  margin-left: auto;
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.9rem;
  color: #374151;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  font-size: 1.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1.2rem;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
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
  border: 2px solid #e5e7eb;
}

.image-preview img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.error-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0.5rem 0;
  text-align: center;
  padding: 0.5rem;
  background: #fef2f2;
  border-radius: 6px;
}

.warning-text {
  color: #d97706;
  font-size: 0.938rem;
  margin: 1rem 0;
  padding: 0.75rem;
  background: #fef3c7;
  border-radius: 8px;
  text-align: center;
}

.item-destaque {
  display: block;
  color: #1f2937;
  margin: 1rem 0;
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 1.125rem;
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

  .modal-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .modal-actions-left,
  .modal-actions-right {
    width: 100%;
  }

  .modal-actions-right {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .modal-actions button {
    width: 100%;
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

  .toast {
    right: 1rem;
    left: 1rem;
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

  .dashboard-header h1 {
    font-size: 1.5rem;
  }

  .stat-item {
    min-width: 70px;
    padding: 0.5rem 0.75rem;
  }

  .stat-number {
    font-size: 1.25rem;
  }

  .header-stats {
    gap: 1rem;
  }
}
</style>