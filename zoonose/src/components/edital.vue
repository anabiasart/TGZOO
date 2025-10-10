<template>
  <div class="edital-page">
    <!-- Loading State -->
    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando...</p>
    </div>

    <!-- Item Encontrado -->
    <template v-else-if="item">
      <header class="edital-header">
        <button class="btn-voltar" @click="$router.go(-1)">
          ← Voltar
        </button>
        <div class="header-content">
          <div class="header-badge">
            <span :class="item.tipo === 'campanha' ? 'badge-campanha' : 'badge-noticia'">
              {{ item.tipo === 'campanha' ? '📢 Campanha' : '📝 Notícia' }}
            </span>
          </div>
          <h1>{{ getTitulo() }}</h1>
          <p class="orgao">Prefeitura Municipal • Secretaria de Saúde • Centro Veterinário</p>
          <div class="metadata">
            <span class="data-publicacao">📅 Publicado em: {{ formatarData(item.dataPublicacao) }}</span>
            <span v-if="item.autor" class="autor">👤 Por: {{ item.autor }}</span>
          </div>
        </div>
      </header>

      <!-- Imagem -->
      <div v-if="getImagem()" class="imagem-container">
        <img :src="getImagem()" :alt="getTitulo()" class="imagem-noticia" />
      </div>

      <main class="conteudo">
        <!-- Conteúdo CAMPANHA -->
        <section v-if="item.tipo === 'campanha'" class="campanha-info">
          <h2>📢 Informações da Campanha</h2>
          <div class="grid-detalhes campanha-grid">
            <div v-if="item.nomeCampanha" class="detalhe-item destaque">
              <strong>📋 Nome da Campanha:</strong>
              <span>{{ item.nomeCampanha }}</span>
            </div>
            <div v-if="item.dataInicioCampanha" class="detalhe-item">
              <strong>📅 Data Início:</strong>
              <span>{{ item.dataInicioCampanha }}</span>
            </div>
            <div v-if="item.dataFimCampanha" class="detalhe-item">
              <strong>📅 Data Fim:</strong>
              <span>{{ item.dataFimCampanha }}</span>
            </div>
            <div v-if="item.horarioCampanha" class="detalhe-item">
              <strong>🕐 Horário:</strong>
              <span>{{ item.horarioCampanha }}</span>
            </div>
          </div>
        </section>

        <!-- Conteúdo NOTÍCIA -->
        <section v-else class="resumo">
          <h2>📄 Conteúdo</h2>
          <div class="conteudo-texto" v-html="formatarConteudo(item.resumo)"></div>
        </section>

        <!-- Ações -->
        <section class="acoes">
          <button class="btn-compartilhar" @click="compartilhar">
            📤 Compartilhar
          </button>
          <button class="btn-imprimir" @click="imprimir">
            🖨️ Imprimir
          </button>
        </section>
      </main>
    </template>

    <!-- Item Não Encontrado -->
    <div v-else class="erro-container">
      <div class="erro-content">
        <h2>😔 Item não encontrado</h2>
        <p>O item que você está procurando pode ter sido removido ou não existe.</p>
        <button class="btn-home" @click="$router.push('/')">
          🏠 Voltar ao Início
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useNoticias } from "@/data/noticiasData.js"

const item = ref(null)
const carregando = ref(true)
const route = useRoute()
const { noticias: todasNoticias, carregarNoticias, buscarNoticiaPorId } = useNoticias()



onMounted(async () => {
  try {
    const id = parseInt(route.params.id, 10)
    
    if (isNaN(id)) {
      carregando.value = false
      return
    }
    
    // Garantir que as notícias estão carregadas
    if (todasNoticias.value.length === 0) {
      await carregarNoticias()
    }
    
    // Buscar do backend (GET /news/{id} é público)
    const resultado = await buscarNoticiaPorId(id)
    
    if (resultado) {
      item.value = resultado
    } else {
      console.error('Notícia não encontrada')
    }
    
  } catch (error) {
    console.error('Erro ao carregar:', error)
    item.value = null
  } finally {
    carregando.value = false
  }
})

// Funções utilitárias
function getTitulo() {
  if (!item.value) return ''
  if (item.value.tipo === 'campanha') {
    return item.value.nomeCampanha || item.value.titulo
  }
  return item.value.nomeNoticia || item.value.titulo
}

function getImagem() {
  if (!item.value) return ''
  if (item.value.tipo === 'campanha') {
    return item.value.urlImagem || item.value.imagem
  }
  return item.value.urlImagemNoticia || item.value.imagem
}

function formatarData(data) {
  if (!data) return 'Data não disponível'
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function formatarConteudo(texto) {
  if (!texto) return ''
  return texto
    .split('\n\n')
    .map(paragrafo => `<p>${paragrafo.replace(/\n/g, '<br>')}</p>`)
    .join('')
}

function compartilhar() {
  if (navigator.share) {
    navigator.share({
      title: getTitulo(),
      text: item.value.resumo?.substring(0, 200) || '',
      url: window.location.href
    }).catch(err => {
      console.log('Erro ao compartilhar:', err)
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Link copiado para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar:', err))
  }
}

function imprimir() {
  window.print()
}
</script>

<style scoped>
.edital-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd);
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: #059669;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #059669;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Header */
.edital-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  position: relative;
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

.header-badge {
  margin-bottom: 1rem;
}

.header-badge span {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
}

.badge-campanha {
  background: #dbeafe;
  color: #1e40af;
}

.badge-noticia {
  background: #f1f5f9;
  color: #475569;
}

.header-content h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5em;
  color: #059669;
  line-height: 1.2;
}

.orgao {
  color: #6b7280;
  font-size: 1.1em;
  margin: 0.5rem 0;
}

.metadata {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.data-publicacao,
.autor {
  color: #6b7280;
  font-size: 0.9em;
}

/* Imagem */
.imagem-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 2rem;
}

.imagem-noticia {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Conteúdo */
.conteudo {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 2rem 4rem;
}

.resumo, .campanha-info, .acoes {
  background: white;
  margin-bottom: 2rem;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.resumo h2, .campanha-info h2 {
  margin: 0 0 1rem 0;
  color: #059669;
  font-size: 1.5em;
}

.conteudo-texto {
  color: #374151;
  line-height: 1.8;
  font-size: 1.05em;
}

.conteudo-texto :deep(p) {
  margin: 1rem 0;
}

.conteudo-texto :deep(p:first-child) {
  margin-top: 0;
}

.conteudo-texto :deep(p:last-child) {
  margin-bottom: 0;
}

/* Grid de Detalhes */
.grid-detalhes {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.campanha-grid {
  background: #eff6ff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #dbeafe;
}

.detalhe-item {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #059669;
}

.detalhe-item.destaque {
  grid-column: 1 / -1;
  border-left: 4px solid #1e40af;
  background: #f0f9ff;
}

.detalhe-item strong {
  display: block;
  color: #059669;
  margin-bottom: 0.25rem;
  font-size: 0.95em;
}

.detalhe-item.destaque strong {
  color: #1e40af;
}

.detalhe-item span {
  color: #374151;
  font-size: 1.05em;
}

/* Ações */
.acoes {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-compartilhar, .btn-imprimir {
  background: #059669;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-compartilhar:hover, .btn-imprimir:hover {
  background: #047857;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Erro */
.erro-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
}

.erro-content {
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  max-width: 500px;
}

.erro-content h2 {
  color: #ef4444;
  margin-bottom: 1rem;
}

.erro-content p {
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.btn-home {
  background: #059669;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.btn-home:hover {
  background: #047857;
}

/* Responsivo */
@media (max-width: 768px) {
  .edital-header {
    padding: 1rem;
  }
  
  .header-content h1 {
    font-size: 1.8em;
  }
  
  .metadata {
    gap: 1rem;
  }
  
  .conteudo {
    padding: 0 1rem 2rem;
  }
  
  .resumo, .campanha-info, .acoes {
    padding: 1.5rem;
  }
  
  .grid-detalhes {
    grid-template-columns: 1fr;
  }
  
  .acoes {
    flex-direction: column;
  }
  
  .imagem-container {
    padding: 0 1rem;
  }
  
  .imagem-noticia {
    height: 200px;
  }
}

/* Print styles */
@media print {
  .btn-voltar, .acoes {
    display: none;
  }
  
  .edital-page {
    background: white;
  }
  
  .resumo, .campanha-info {
    box-shadow: none;
    border: 1px solid #e5e7eb;
  }
}
</style>