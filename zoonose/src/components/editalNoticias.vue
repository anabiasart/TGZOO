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
import { useEditais } from '@/data/editaisData.js'
import vete from '@/assets/img/vete.jpg'

const router = useRouter()
const { todosItens, carregarTodos, carregando, erro } = useEditais()

// 🔍 Filtros de busca
const filtros = ref({ busca: '' })

// 🔹 Carrega notícias na montagem
onMounted(async () => {
  try {
    await carregarTodos()
  } catch (e) {
    console.error('❌ Erro ao carregar notícias:', e)
  }
})

// 🔹 Filtra apenas as notícias
const noticiasFiltradas = computed(() => {
  let lista = todosItens.value.filter(i => i.tipo === 'noticia')

  if (filtros.value.busca.trim()) {
    const termo = filtros.value.busca.toLowerCase()
    lista = lista.filter(n =>
      (n.nomeNoticia || n.titulo || '').toLowerCase().includes(termo) ||
      (n.resumo || n.description || '').toLowerCase().includes(termo)
    )
  }

  // ordena por data de publicação
  return lista.sort((a, b) => new Date(b.dataPublicacao || b.createdAt) - new Date(a.dataPublicacao || a.createdAt))
})

// 🔹 Helpers
function getTitulo(n) {
  return n.nomeNoticia || n.titulo || 'Notícia sem título'
}

function getResumo(n) {
  if (!n.resumo) return ''
  const texto = n.resumo.replace(/\s+/g, ' ').trim()
  return texto.length > 160 ? texto.slice(0, 160) + '…' : texto
}

function getImagem(n) {
  return n.urlImagemNoticia || n.imagem || vete
}

function formatarData(d) {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}

function verNoticia(id) {
  router.push(`/edital/${id}`)
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
    padding: 0.166rem 05rem 0rem;
    border-radius: 0rem 10rem 0rem;
    cursor: pointer;
    font-size: 1.3rem;
    margin-bottom: 0rem;
    transition: background 0.2s;
  }


    .btn-voltar:hover {
      background: white;
      color: #9ab1d3;

    }
    .page-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 2rem;
      position: relative;
    border-radius: 0rem 10rem 0rem;

      
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
    border: 0px solid rgb(217, 242, 255);
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