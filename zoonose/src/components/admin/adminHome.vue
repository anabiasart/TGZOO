<template>
  <div class="adminHome">
<Header :usuario="usuario"/>   
 <div class="container">
      <section class="atalhos-rapidos">
        <h2>Atalhos Rápidos</h2>
        <div class="cards-grid">
          <div class="card" @click="router.push('/usuarios')">
            <h3>Usuários</h3>
            <p>Gerencie cadastros e permissões</p>
          </div>
          <div class="card" @click="router.push('/atendimentos')">
            <h3>Atendimentos</h3>
            <p>Veja solicitações e histórico</p>
          </div>
          <div class="card" @click="router.push('/configuracoes')">
            <h3>Configurações</h3>
            <p>Ajuste preferências do sistema</p>
          </div>
        </div>
      </section>

      <section class="resumo">
        <h2>Resumo</h2>
        <div class="cards-grid">
          <div class="card-resumo">
            <p class="label">Total de Usuários</p>
            <p class="valor">{{ usuarios.length }}</p>
          </div>
          <div class="card-resumo">
            <p class="label">Atendimentos Hoje</p>
            <p class="valor">8</p>
          </div>
          <div class="card-resumo">
            <p class="label">Pendências</p>
            <p class="valor">3</p>
          </div>
        </div>
      </section>

      <div v-if="carregando" class="loading-section">
        <div class="spinner"></div>
        <p>Carregando usuários...</p>
      </div>

      <div v-if="erro" class="error-section">
        <div class="error-content">
          <p>{{ erro }}</p>
          <button @click="limparErro" class="btn-secondary">Fechar</button>
        </div>
      </div>

      <!-- Lista de Usuários -->
      <section class="lista-usuarios" v-if="!carregando">
        <h2> Usuários Cadastrados</h2>
        
        <div class="usuarios-container">
          <!-- Administradores -->
          <div class="usuarios-card">
            <div class="card-header admin-header">
              <h3> Administradores</h3>
              <span class="badge-count">{{ administradores.length }}</span>
            </div>
            <div class="usuarios-lista">
              <div 
                v-for="admin in administradores" 
                :key="admin.id" 
                class="usuario-item"
              >
                <div class="usuario-avatar admin-avatar">
                  {{ getIniciais(admin.name) }}
                </div>
                <div class="usuario-info">
                  <p class="usuario-nome">{{ admin.name }}</p>
                  <p class="usuario-email">{{ admin.email }}</p>
                  <p class="usuario-telefone"> {{ formatarTelefone(admin.phone) }}</p>
                </div>
                <span class="usuario-badge admin">Admin</span>
              </div>

              <!-- Mensagem se não houver administradores -->
              <div v-if="administradores.length === 0" class="empty-state">
                <p>Nenhum administrador cadastrado</p>
              </div>
            </div>
          </div>

          <!-- Usuários Comuns -->
          <div class="usuarios-card">
            <div class="card-header user-header">
              <h3> Usuários Comuns</h3>
              <span class="badge-count">{{ usuariosComuns.length }}</span>
            </div>
            <div class="usuarios-lista">
              <div 
                v-for="user in usuariosComuns" 
                :key="user.id" 
                class="usuario-item"
              >
                <div class="usuario-avatar user-avatar">
                  {{ getIniciais(user.name) }}
                </div>
                <div class="usuario-info">
                  <p class="usuario-nome">{{ user.name }}</p>
                  <p class="usuario-email">{{ user.email }}</p>
                  <p class="usuario-telefone">{{ formatarTelefone(user.phone) }}</p>
                </div>
                <span class="usuario-badge user">Usuário</span>
              </div>

              <!-- Mensagem se não houver usuários -->
              <div v-if="usuariosComuns.length === 0" class="empty-state">
                <p>Nenhum usuário cadastrado</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import { useUsuarios } from '@/data/usuariosData.js'


const router = useRouter()
const usuario = ref("Admin")


onMounted(() => {
  const user = JSON.parse(localStorage.getItem("user"))
  if (user?.name) usuario.value = user.name
})

const { 
  usuarios, 
  carregando, 
  erro,
  carregarUsuarios,
  limparErro
} = useUsuarios()

const administradores = computed(() => 
  usuarios.value.filter(u => u.isAdmin)
)

const usuariosComuns = computed(() => 
  usuarios.value.filter(u => !u.isAdmin)
)

function getIniciais(nome) {
  if (!nome) return '?'
  const partes = nome.trim().split(' ')
  if (partes.length === 1) {
    return partes[0].charAt(0).toUpperCase()
  }
  return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase()
}

function formatarTelefone(telefone) {
  if (!telefone || telefone === 'Não informado') return telefone
  
  const numeros = telefone.replace(/\D/g, '')
  
  if (numeros.length === 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
  }
  if (numeros.length === 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`
  }
  
  return telefone
}

onMounted(async () => {
  console.log('🚀 AdminHome montado')
  await carregarUsuarios()
})
</script>

<style scoped>
.adminHome {
  min-height: 100vh;
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd);
    font-family: 'Helvetica', -apple-system, BlinkMacSystemFont;

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
  color: #3b6e54;
  font-size: 2rem;
  margin-bottom: 1.3rem;
  font-weight: 500;
}

.atalhos-rapidos .cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0.8rem;
}

.card {
  background: white;
  padding: 1rem;
  border-radius: 26px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card h3 {
  color: #0ea5e9;
  font-size: 1.3rem;
  margin-bottom: 0.3rem;
  font-weight: 600;

}

.card p {
  color: #666;
  font-size: 1.3rem;
  font-weight: 500;

}

.resumo .cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.9rem;
}

.card-resumo {
  background: white;
  padding: 1rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-resumo .icon {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.card-resumo .label {
  color: #666;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.card-resumo .valor {
  color: #0ea5e9;
  font-size: 3.5rem;
  font-weight: 600;
}

.loading-section, .error-section {
  text-align: center;
  padding: 2rem;
  margin-bottom: 2rem;
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

.error-content {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  color: #dc2626;
}

.error-icon {
  font-size: 1.5rem;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.lista-usuarios {
  margin-top: 3rem;
}

.usuarios-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(550px, 1fr, 2fr));
  gap: 3rem;
}

.usuarios-card {
  background: white;
  border-radius: 26px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1.3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header {
  background: linear-gradient(135deg, #3b6e54, #5c906e);
  color: white;
}

.user-header {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
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
  font-size: 1rem;
}

.usuarios-lista {
  max-height: 400px;
  overflow-y: auto;
  padding: 1.7rem;
}

.usuario-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.3rem;
  border-radius: 12px;
  transition: background 0.2s ease;
  margin-bottom: 0rem;
}

.usuario-item:hover {
  background: #f8fafc;
}

.usuario-avatar {
  width: 58px;
  height: 58px;
  border-radius: 60%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  flex-shrink: 0;
  font-weight: 500;

}

.admin-avatar {
  background: linear-gradient(135deg, #3b6e54, #5c906e);
}

.user-avatar {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
}

.usuario-info {
  flex: 1;
}

.usuario-nome {
  font-weight: 400;
  color: #333;
  margin: 0;
  font-size: 1.2rem;
}

.usuario-email {
  color: #666;
  font-size: 1.2rem;
  margin: 0.2rem 0;
  font-weight: 700;

}

.usuario-telefone {
  color: #888;
  font-size: 0.8rem;
  margin: 0.2rem 0 0 0;
}

.usuario-badge {
  padding: 0.6rem 0.9rem;
  border-radius: 60px;
  font-size: 1rem;
  font-weight: 600;
}

.usuario-badge.admin {
  background: #dcfce7;
  color: #166534;
}

.usuario-badge.user {
  background: #dbeafe;
  color: #1e40af;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: #999;
}

.empty-state p {
  margin: 0;
  font-style: italic;
}

.usuarios-lista::-webkit-scrollbar {
  width: 10px;
}

.usuarios-lista::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.usuarios-lista::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.usuarios-lista::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media (max-width: 1024px) {
  .usuarios-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .usuarios-lista {
    max-height: 300px;
  }
  
  .usuarios-container {
    grid-template-columns: 1fr,2fr;
  }
}
</style>