<template>
  <div class="edital-page">
    <!-- Loading State -->
    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando notícia...</p>
    </div>

    <!-- Notícia Encontrada -->
    <template v-else-if="noticia">
      <header class="edital-header">
        <button class="btn-voltar" @click="$router.go(-1)">
          ← Voltar
        </button>
        <div class="header-content">
          <h1>{{ noticia.titulo }}</h1>
          <p class="orgao">Prefeitura Municipal • Secretaria de Saúde • Centro Veterinário</p>
          <div class="metadata">
            <span class="data-publicacao">📅 Publicado em: {{ formatarData(noticia.dataPublicacao) }}</span>
            <span v-if="noticia.autor" class="autor">👤 Por: {{ noticia.autor }}</span>
          </div>
        </div>
      </header>

      <!-- Imagem da Notícia (se existir) -->
      <div v-if="noticia.imagem" class="imagem-container">
        <img :src="noticia.imagem" :alt="noticia.titulo" class="imagem-noticia" />
      </div>

      <main class="conteudo">
        <section class="resumo">
          <h2>📄 Conteúdo</h2>
          <div class="conteudo-texto" v-html="formatarConteudo(noticia.resumo)"></div>
        </section>

        <!-- Detalhes do Edital -->
        <section v-if="temDetalhes" class="detalhes">
          <h2>📋 Informações Detalhadas</h2>
          <div class="grid-detalhes">
            <div v-if="noticia.detalhes.data" class="detalhe-item">
              <strong>📅 Data:</strong>
              <span>{{ noticia.detalhes.data }}</span>
            </div>
            <div v-if="noticia.detalhes.horario" class="detalhe-item">
              <strong>🕐 Horário:</strong>
              <span>{{ noticia.detalhes.horario }}</span>
            </div>
            <div v-if="noticia.detalhes.local" class="detalhe-item">
              <strong>📍 Local:</strong>
              <span>{{ noticia.detalhes.local }}</span>
            </div>
            <div v-if="noticia.detalhes.publico" class="detalhe-item">
              <strong>👥 Público-alvo:</strong>
              <span>{{ noticia.detalhes.publico }}</span>
            </div>
            <div v-if="noticia.detalhes.contato" class="detalhe-item">
              <strong>📞 Contato:</strong>
              <span>{{ noticia.detalhes.contato }}</span>
            </div>
            <div v-if="noticia.detalhes.inscricoes" class="detalhe-item">
              <strong>📝 Inscrições:</strong>
              <span>{{ noticia.detalhes.inscricoes }}</span>
            </div>
          </div>
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

    <!-- Notícia Não Encontrada -->
    <div v-else class="erro-container">
      <div class="erro-content">
        <h2>😔 Notícia não encontrada</h2>
        <p>A notícia que você está procurando pode ter sido removida ou não existe.</p>
        <button class="btn-home" @click="$router.push('/')">
          🏠 Voltar ao Início
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"

const noticia = ref(null)
const carregando = ref(true)
const route = useRoute()
const router = useRouter()

const API_URL = 'http://localhost:8080/api/news'

// Função para extrair detalhes do conteúdo
const extrairDetalhes = (content) => {
  const detalhes = {
    data: '',
    horario: '',
    local: '',
    publico: '',
    contato: '',
    inscricoes: ''
  }
  
  if (!content) return detalhes
  
  // Buscar padrões no texto (case insensitive)
  const dataMatch = content.match(/Data:\s*(.+?)(?:\n|$)/i)
  const horarioMatch = content.match(/Horário:\s*(.+?)(?:\n|$)/i)
  const localMatch = content.match(/Local:\s*(.+?)(?:\n|$)/i)
  const publicoMatch = content.match(/Público:\s*(.+?)(?:\n|$)/i) || 
                       content.match(/Público-alvo:\s*(.+?)(?:\n|$)/i)
  const contatoMatch = content.match(/Contato:\s*(.+?)(?:\n|$)/i)
  const inscricoesMatch = content.match(/Inscrições:\s*(.+?)(?:\n|$)/i) ||
                          content.match(/Informações de Inscrição:\s*(.+?)(?:\n|$)/i)
  
  if (dataMatch) detalhes.data = dataMatch[1].trim()
  if (horarioMatch) detalhes.horario = horarioMatch[1].trim()
  if (localMatch) detalhes.local = localMatch[1].trim()
  if (publicoMatch) detalhes.publico = publicoMatch[1].trim()
  if (contatoMatch) detalhes.contato = contatoMatch[1].trim()
  if (inscricoesMatch) detalhes.inscricoes = inscricoesMatch[1].trim()
  
  return detalhes
}

// Função para remover os detalhes do conteúdo principal
const removerDetalhesDoConteudo = (content) => {
  if (!content) return ''
  
  // Remove as linhas com os detalhes
  return content
    .replace(/\n\nData:.*$/gim, '')
    .replace(/\nHorário:.*$/gim, '')
    .replace(/\nLocal:.*$/gim, '')
    .replace(/\nPúblico(-alvo)?:.*$/gim, '')
    .replace(/\nContato:.*$/gim, '')
    .replace(/\nInscrições:.*$/gim, '')
    .replace(/\nInformações de Inscrição:.*$/gim, '')
    .trim()
}

// Computed para verificar se tem detalhes válidos
const temDetalhes = computed(() => {
  if (!noticia.value?.detalhes) return false
  const detalhes = noticia.value.detalhes
  return detalhes.data || detalhes.horario || detalhes.local || 
         detalhes.publico || detalhes.contato || detalhes.inscricoes
})

onMounted(async () => {
  try {
    const id = parseInt(route.params.id, 10)
    
    if (isNaN(id)) {
      carregando.value = false
      return
    }
    
    // Buscar notícia diretamente da API
    const response = await fetch(`${API_URL}/${id}`)
    
    if (!response.ok) {
      throw new Error('Notícia não encontrada')
    }
    
    const data = await response.json()
    
    // Extrair detalhes do conteúdo
    const detalhes = extrairDetalhes(data.content)
    const conteudoLimpo = removerDetalhesDoConteudo(data.content)
    
    // Mapear dados do backend
    noticia.value = {
      id: data.id,
      titulo: data.title,
      resumo: conteudoLimpo || data.content,
      imagem: data.imageUrl,
      dataPublicacao: data.createdAt,
      autor: data.user?.name || 'Sistema',
      detalhes: detalhes
    }
    
  } catch (error) {
    console.error('Erro ao carregar notícia:', error)
    noticia.value = null
  } finally {
    carregando.value = false
  }
})

// Funções utilitárias
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
  // Converter quebras de linha em parágrafos
  return texto
    .split('\n\n')
    .map(paragrafo => `<p>${paragrafo.replace(/\n/g, '<br>')}</p>`)
    .join('')
}

function compartilhar() {
  if (navigator.share) {
    navigator.share({
      title: noticia.value.titulo,
      text: noticia.value.resumo.substring(0, 200),
      url: window.location.href
    }).catch(err => {
      console.log('Erro ao compartilhar:', err)
    })
  } else {
    // Fallback para navegadores que não suportam Web Share API
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

.resumo, .detalhes, .acoes {
  background: white;
  margin-bottom: 2rem;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.resumo h2, .detalhes h2 {
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

.detalhe-item {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #059669;
}

.detalhe-item strong {
  display: block;
  color: #059669;
  margin-bottom: 0.25rem;
  font-size: 0.95em;
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
  
  .resumo, .detalhes, .acoes {
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
  
  .resumo, .detalhes {
    box-shadow: none;
    border: 1px solid #e5e7eb;
  }
}
</style>