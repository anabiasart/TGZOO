<template>
  <div class="edital-page">
    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando...</p>
    </div>

    <template v-else-if="item">
      <header class="edital-header">
        <button class="btn-voltar" @click="$router.go(-1)">
          ← Voltar
        </button>
        
        <div class="header-content">
          <div class="header-top">
            <h1>{{ getTitulo() }}</h1>
            <div class="header-badge">
              <span :class="item.tipo === 'campanha' ? 'badge-campanha' : 'badge-noticia'">
                {{ item.tipo === 'campanha' ? 'Campanha' : ' Notícia' }}
              </span>
            </div>
          </div>
          
          <p class="orgao">Prefeitura Municipal • Secretaria de Saúde • Centro Veterinário</p>
          
          <div class="metadata">
            <span class="data-publicacao">
              Publicado em: {{ formatarData(item.dataPublicacao) }}
            </span>
            <span v-if="item.autor" class="autor">
              Por: {{ item.autor }}
            </span>
          </div>
        </div>
      </header>
      <div v-if="getImagem()" class="imagem-container">
        <img :src="getImagem()" :alt="getTitulo()" class="imagem-noticia" />
      </div>

      <main class="conteudo">
        <section v-if="item.tipo === 'campanha' && item.resumo" class="resumo">
  <div class="conteudo-texto" v-html="formatarConteudo(item.resumo)"></div>
</section>
        <section v-if="item.tipo === 'campanha'" class="campanha-info">
          <h2>Informações da Campanha</h2>
          <div class="grid-detalhes campanha-grid">
            <div v-if="item.nomeCampanha" class="detalhe-item destaque">
              <strong> Nome da Campanha</strong>
              <span>{{ item.nomeCampanha }}</span>
            </div>
            <div v-if="item.dataInicioCampanha" class="detalhe-item">
              <strong>Data Início</strong>
              <span>{{ item.dataInicioCampanha }}</span>
            </div>
            <div v-if="item.dataFimCampanha" class="detalhe-item">
              <strong> Data Fim</strong>
              <span>{{ item.dataFimCampanha }}</span>
            </div>
            <div v-if="item.horarioCampanha" class="detalhe-item">
              <strong> Horário</strong>
              <span>{{ item.horarioCampanha }}</span>
            </div>
          </div>
        </section>

        <section v-else class="resumo">
          <h2> Conteúdo</h2>
          <div class="conteudo-texto" v-html="formatarConteudo(item.resumo)"></div>
        </section>

        <section class="acoes">
          <button class="btn-compartilhar" @click="compartilhar">
             Compartilhar
          </button>
          <button class="btn-imprimir" @click="imprimir">
             Imprimir
          </button>
        </section>
      </main>
    </template>

    <!-- Item Não Encontrado -->
    <div v-else class="erro-container">
      <div class="erro-content">
        <h2> Item não encontrado</h2>
        <p>O item que você está procurando pode ter sido removido ou não existe.</p>
        <button class="btn-home" @click="$router.push('/')">
           Voltar ao Início
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDataBR, formatHoraBR } from '@/utils/datetime'

import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useEditais } from "@/data/editaisData.js"

const item = ref(null)
const carregando = ref(true)
const route = useRoute()
const { todosItens: todasNoticias, carregarTodos: carregarNoticias, buscarItemPorId: buscarNoticiaPorId } = useEditais()

onMounted(async () => {
  try {
    const id = parseInt(route.params.id, 10)
    
    if (isNaN(id)) {
      carregando.value = false
      return
    }
    
    if (todasNoticias.value.length === 0) {
      await carregarNoticias()
    }
    
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
  font-family: 'Helvetica', -apple-system, BlinkMacSystemFont;
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: #059669;
}

.spinner {
  width: 50px;
  height: 50px;
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

.edital-header {
  position: flex;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem 2rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  border-radius: 0 0 24px 24px;
  margin-bottom: 1rem;
}

.btn-voltar {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  border: none;
 padding: 0.6rem 03rem 0rem;
  border-radius: 0rem 10rem 0rem;
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-voltar:hover {
  background: linear-gradient(135deg, #0284c7, #0369a1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 1rem;
}

.header-content h1 {
  margin: 0;
  font-size: 2.5rem;
  color: #059669;
  line-height: 1.3;
  font-weight: 700;
  flex: 1;
}

.header-badge {
  flex-shrink: 0;
}

.header-badge span {
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: inline-block;
  white-space: nowrap;
}

.badge-campanha {
  background: linear-gradient(135deg, #dbeafe, #93c5fd);
  color: #1e40af;
}

.badge-noticia {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #475569;
}

.orgao {
  color: #6b7280;
  font-size: 1.6rem;
  margin: 1rem 0;
  font-weight: 300;
}

.metadata {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e5e7eb;
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
}

.data-publicacao,
.autor {
  color: #4b5563;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  font-weight: 500;
}

.metadata .icon {
  font-size: 1.6rem;
}

/* ========== IMAGEM ========== */
.imagem-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.imagem-noticia {
  width: 100%;
  height: 450px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

/* ========== CONTEÚDO ========== */
.conteudo {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem 4rem;
}

.resumo, 
.campanha-info, 
.acoes {
  background: white;
  margin-bottom: 2rem;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.resumo h2, 
.campanha-info h2 {
  margin: 0 0 1.5rem 0;
  color: #059669;
  font-size: 1.75rem;
  font-weight: 700;
}

.conteudo-texto {
  color: #374151;
  line-height: 1.8;
  font-size: 1.1rem;
}

.conteudo-texto :deep(p) {
  margin: 1.2rem 0;
}

.conteudo-texto :deep(p:first-child) {
  margin-top: 0;
}

.conteudo-texto :deep(p:last-child) {
  margin-bottom: 0;
}

/* ========== GRID DE DETALHES ========== */
.grid-detalhes {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.campanha-grid {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #bfdbfe;
}

.detalhe-item {
  background: white;
  padding: 1.25rem;
  border-radius: 10px;
  border-left: 4px solid #10b981;
  transition: all 0.3s ease;
}

.detalhe-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.detalhe-item.destaque {
  grid-column: 1 / -1;
  border-left: 4px solid #3b82f6;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
}

.detalhe-item strong {
  display: block;
  color: #059669;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.detalhe-item.destaque strong {
  color: #2563eb;
}

.detalhe-item span {
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 500;
}

/* ========== AÇÕES ========== */
.acoes {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 2rem;
}

.btn-compartilhar, 
.btn-imprimir {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.btn-compartilhar:hover, 
.btn-imprimir:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(16, 185, 129, 0.4);
}

/* ========== ERRO ========== */
.erro-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
}

.erro-content {
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

.erro-content h2 {
  color: #ef4444;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.erro-content p {
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1.1rem;
}

.btn-home {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.btn-home:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

/* ========== RESPONSIVO ========== */
@media (max-width: 768px) {
  .edital-header {
    padding: 1rem;
    border-radius: 0 0 16px 16px;
  }
  
  .header-top {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-content h1 {
    font-size: 1.75rem;
  }
  
  .header-badge span {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
  }
  
  .metadata {
    gap: 1.5rem;
    flex-direction: column;
  }
  
  .conteudo {
    padding: 0 1rem 2rem;
  }
  
  .resumo, 
  .campanha-info, 
  .acoes {
    padding: 1.5rem;
  }
  
  .grid-detalhes {
    grid-template-columns: 1fr;
  }
  
  .acoes {
    flex-direction: column;
  }
  
  .imagem-noticia {
    height: 250px;
  }
  
  .conteudo-texto {
    font-size: 1rem;
  }
}

/* ========== PRINT ========== */
@media print {
  .btn-voltar, 
  .acoes {
    display: none;
  }
  
  .edital-page {
    background: white;
  }
  
  .resumo, 
  .campanha-info {
    box-shadow: none;
    border: 1px solid #e5e7eb;
  }
}
</style>