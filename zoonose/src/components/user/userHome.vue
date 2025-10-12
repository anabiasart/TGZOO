<template>
  <div class="userHome">
    <Header :usuario="nomeUsuario" />

    <div class="container">
      <!-- Atalhos Rápidos -->
      <section class="atalhos-rapidos">
        <h2>Atalhos Rápidos</h2>
        <div class="cards-grid">
          <div class="card" @click="router.push('/perfil')">
            <div class="card-icon">👤</div>
            <h3>Meu Perfil</h3>
            <p>Visualize e edite suas informações</p>
          </div>
          <div class="card" @click="router.push('/meus-atendimentos')">
            <div class="card-icon">📋</div>
            <h3>Meus Atendimentos</h3>
            <p>Consulte seu histórico</p>
          </div>
          <div class="card" @click="router.push('/agendar')">
            <div class="card-icon">📅</div>
            <h3>Agendar</h3>
            <p>Solicite um novo atendimento</p>
          </div>
          <div class="card" @click="router.push('/configuracoes')">
            <div class="card-icon">⚙️</div>
            <h3>Configurações</h3>
            <p>Ajuste suas preferências</p>
          </div>
        </div>
      </section>

      <!-- Resumo do Usuário -->
      <section class="resumo">
        <h2>Meu Resumo</h2>
        <div class="cards-grid">
          <div class="card-resumo">
            <div class="icon">📋</div>
            <p class="label">Total de Atendimentos</p>
            <p class="valor">{{ totalAtendimentos }}</p>
          </div>
          <div class="card-resumo">
            <div class="icon">⏳</div>
            <p class="label">Pendentes</p>
            <p class="valor">{{ atendimentosPendentes }}</p>
          </div>
          <div class="card-resumo">
            <div class="icon">✅</div>
            <p class="label">Concluídos</p>
            <p class="valor">{{ atendimentosConcluidos }}</p>
          </div>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="carregando" class="loading-section">
        <div class="spinner"></div>
        <p>Carregando notícias...</p>
      </div>

      <!-- Últimas Notícias e Campanhas -->
      <section class="noticias-campanhas" v-if="!carregando">
        <h2>📰 Últimas Notícias e Campanhas</h2>
        
        <div class="noticias-container">
          <!-- Campanhas Ativas -->
          <div class="noticias-card campanhas-card">
            <div class="card-header campanhas-header">
              <h3>📢 Campanhas Ativas</h3>
              <span class="badge-count">{{ campanhas.length }}</span>
            </div>
            <div class="noticias-lista">
              <div 
                v-for="campanha in campanhas" 
                :key="campanha.id" 
                class="noticia-item campanha-item"
                @click="verDetalhes(campanha)"
              >
                <div class="noticia-icon campanha-icon">📢</div>
                <div class="noticia-info">
                  <p class="noticia-titulo">{{ campanha.titulo }}</p>
                  <p class="noticia-data">📅 {{ formatarData(campanha.data) }}</p>
                  <p class="noticia-descricao">{{ campanha.descricao }}</p>
                </div>
                <span class="noticia-badge campanha-badge">Campanha</span>
              </div>

              <!-- Mensagem se não houver campanhas -->
              <div v-if="campanhas.length === 0" class="empty-state">
                <p>Nenhuma campanha ativa no momento</p>
              </div>
            </div>
          </div>

          <!-- Notícias Recentes -->
          <div class="noticias-card">
            <div class="card-header noticias-header">
              <h3>📝 Notícias Recentes</h3>
              <span class="badge-count">{{ noticias.length }}</span>
            </div>
            <div class="noticias-lista">
              <div 
                v-for="noticia in noticias" 
                :key="noticia.id" 
                class="noticia-item"
                @click="verDetalhes(noticia)"
              >
                <div class="noticia-icon noticia-icon-news">📰</div>
                <div class="noticia-info">
                  <p class="noticia-titulo">{{ noticia.titulo }}</p>
                  <p class="noticia-data">📅 {{ formatarData(noticia.data) }}</p>
                  <p class="noticia-descricao">{{ noticia.descricao }}</p>
                </div>
                <span class="noticia-badge noticia-badge-news">Notícia</span>
              </div>

              <!-- Mensagem se não houver notícias -->
              <div v-if="noticias.length === 0" class="empty-state">
                <p>Nenhuma notícia disponível</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Acesso Rápido -->
      <section class="acesso-rapido">
        <h2>🔗 Links Úteis</h2>
        <div class="links-grid">
          <a href="#" class="link-card">
            <span class="link-icon">📞</span>
            <span class="link-texto">Contato</span>
          </a>
          <a href="#" class="link-card">
            <span class="link-icon">❓</span>
            <span class="link-texto">FAQ</span>
          </a>
          <a href="#" class="link-card">
            <span class="link-icon">📖</span>
            <span class="link-texto">Guia</span>
          </a>
          <a href="#" class="link-card">
            <span class="link-icon">🏥</span>
            <span class="link-texto">Unidades</span>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'

const router = useRouter()
const nomeUsuario = ref('Usuário')
const carregando = ref(true)

// Dados do usuário
const totalAtendimentos = ref(12)
const atendimentosPendentes = ref(2)
const atendimentosConcluidos = ref(10)


// Métodos
function formatarData(data) {
  if (!data) return 'Data não disponível'
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function verDetalhes(item) {
  router.push(`/noticia/${item.id}`)
}

// Lifecycle
onMounted(() => {
  // Simular carregamento
  setTimeout(() => {
    carregando.value = false
  }, 1000)
})
</script>

<style scoped>
.userHome {
  min-height: 100vh;
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd);
}

.container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

section {
  margin-bottom: 3rem;
}

h2 {
  color: #0ea5e9;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

/* ========== ATALHOS RÁPIDOS ========== */
.atalhos-rapidos .cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card h3 {
  color: #0ea5e9;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.card p {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

/* ========== RESUMO ========== */
.resumo .cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.card-resumo {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card-resumo:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.card-resumo .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card-resumo .label {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.card-resumo .valor {
  color: #0ea5e9;
  font-size: 2.5rem;
  font-weight: bold;
}

/* ========== LOADING ========== */
.loading-section {
  text-align: center;
  padding: 2rem;
  margin-bottom: 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ========== NOTÍCIAS E CAMPANHAS ========== */
.noticias-campanhas {
  margin-top: 3rem;
}

.noticias-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 2rem;
}

.noticias-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.campanhas-header {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
}

.noticias-header {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: white;
}

.badge-count {
  background: rgba(255, 255, 255, 0.3);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.noticias-lista {
  max-height: 450px;
  overflow-y: auto;
  padding: 1rem;
}

.noticia-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.noticia-item:hover {
  background: #f8fafc;
  transform: translateX(4px);
}

.noticia-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.campanha-icon {
  background: linear-gradient(135deg, #dbeafe, #93c5fd);
}

.noticia-icon-news {
  background: linear-gradient(135deg, #e9d5ff, #c084fc);
}

.noticia-info {
  flex: 1;
}

.noticia-titulo {
  font-weight: 600;
  color: #333;
  margin: 0 0 0.3rem 0;
  font-size: 1rem;
}

.noticia-data {
  color: #888;
  font-size: 0.8rem;
  margin: 0 0 0.3rem 0;
}

.noticia-descricao {
  color: #666;
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.4;
}

.noticia-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.campanha-badge {
  background: #dbeafe;
  color: #1e40af;
}

.noticia-badge-news {
  background: #e9d5ff;
  color: #7e22ce;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
}

.empty-state p {
  margin: 0;
  font-style: italic;
}

/* ========== ACESSO RÁPIDO ========== */
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.link-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  color: inherit;
}

.link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
}

.link-icon {
  font-size: 2rem;
}

.link-texto {
  color: #0ea5e9;
  font-weight: 600;
  font-size: 0.95rem;
}

/* ========== SCROLLBAR ========== */
.noticias-lista::-webkit-scrollbar {
  width: 8px;
}

.noticias-lista::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.noticias-lista::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.noticias-lista::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* ========== RESPONSIVO ========== */
@media (max-width: 1024px) {
  .noticias-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .atalhos-rapidos .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .noticias-lista {
    max-height: 300px;
  }
  
  .noticias-container {
    grid-template-columns: 1fr;
  }
  
  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>