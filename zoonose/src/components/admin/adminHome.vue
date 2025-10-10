  <template>
    <div class="adminHome">
      <Header :usuario="nomeUsuario" />

      <div class="container">
        <!-- Atalhos Rápidos -->
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

        <!-- Resumo -->
        <section class="resumo">
          <h2>Resumo</h2>
          <div class="cards-grid">
            <div class="card-resumo">
              <div class="icon">👤</div>
              <p class="label">Total de Usuários</p>
              <p class="valor">120</p>
            </div>
            <div class="card-resumo">
              <div class="icon">📅</div>
              <p class="label">Atendimentos Hoje</p>
              <p class="valor">8</p>
            </div>
            <div class="card-resumo">
              <div class="icon">⚠️</div>
              <p class="label">Pendências</p>
              <p class="valor">3</p>
            </div>
          </div>
        </section>

        <!-- NOVA SEÇÃO: Lista de Usuários -->
        <section class="lista-usuarios">
          <h2>👥 Usuários Cadastrados</h2>
          
          <div class="usuarios-container">
            <!-- Administradores -->
            <div class="usuarios-card">
              <div class="card-header admin-header">
                <h3>🔑 Administradores</h3>
                <span class="badge-count">{{ administradores.length }}</span>
              </div>
              <div class="usuarios-lista">
                <div 
                  v-for="admin in administradores" 
                  :key="admin.id" 
                  class="usuario-item"
                >
                  <div class="usuario-avatar">
                    {{ admin.nome.charAt(0).toUpperCase() }}
                  </div>
                  <div class="usuario-info">
                    <p class="usuario-nome">{{ admin.nome }}</p>
                    <p class="usuario-email">{{ admin.email }}</p>
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
                <h3>👤 Usuários Comuns</h3>
                <span class="badge-count">{{ usuariosComuns.length }}</span>
              </div>
              <div class="usuarios-lista">
                <div 
                  v-for="user in usuariosComuns" 
                  :key="user.id" 
                  class="usuario-item"
                >
                  <div class="usuario-avatar">
                    {{ user.nome.charAt(0).toUpperCase() }}
                  </div>
                  <div class="usuario-info">
                    <p class="usuario-nome">{{ user.nome }}</p>
                    <p class="usuario-email">{{ user.email }}</p>
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

  <script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import { userAPI } from '@/services/api'

export default {
  name: 'adminHome',
  components: {
    Header
  },
  setup() {
    const router = useRouter()
    const nomeUsuario = ref('Admin')
    const administradores = ref([])
    const usuariosComuns = ref([])

    async function carregarUsuarios() {
      try {
        const token = localStorage.getItem('token')
        
        console.log('🔑 Token:', token ? 'Presente' : 'Ausente')

        if (!token) {
          console.error('❌ Token não encontrado')
          router.push('/login')
          return
        }

        console.log('📡 Carregando usuários...')
        
        const response = await userAPI.getAllUsers()

        console.log('✅ Usuários recebidos:', response.data)
        console.log('📊 Total:', response.data.length)

        // Log para debug - ver estrutura dos usuários
        if (response.data.length > 0) {
          console.log('🔍 Primeiro usuário (estrutura):', response.data[0])
        }

        const usuarios = response.data
        
        administradores.value = usuarios.filter(u => {
          
          const roleString = u.role || (u.roles && u.roles[0]?.name) || (u.roles && u.roles[0])
          const isAdmin = roleString === 'ADMINISTRATOR' || 
                         roleString === 'ROLE_ADMINISTRATOR' ||
                         (u.roles && u.roles.some(r => 
                           r === 'ADMINISTRATOR' || 
                           r === 'ROLE_ADMINISTRATOR' ||
                           r.name === 'ADMINISTRATOR' ||
                           r.name === 'ROLE_ADMINISTRATOR'
                         ))
          
          console.log(`👤 ${u.name || u.email}:`, roleString, '→ Admin?', isAdmin)
          return isAdmin
        })
        
        usuariosComuns.value = usuarios.filter(u => {
          const roleString = u.role || (u.roles && u.roles[0]?.name) || (u.roles && u.roles[0])
          const isCustomer = roleString === 'CUSTOMER' || 
                            roleString === 'ROLE_CUSTOMER' ||
                            (u.roles && u.roles.some(r => 
                              r === 'CUSTOMER' || 
                              r === 'ROLE_CUSTOMER' ||
                              r.name === 'CUSTOMER' ||
                              r.name === 'ROLE_CUSTOMER'
                            ))
          
          console.log(`👤 ${u.name || u.email}:`, roleString, '→ Customer?', isCustomer)
          return isCustomer
        })

        console.log('👑 Administradores encontrados:', administradores.value.length)
        console.log('👤 Usuários Comuns encontrados:', usuariosComuns.value.length)

        // Se ainda estiver zerado, mostrar estrutura completa
        if (administradores.value.length === 0 && usuariosComuns.value.length === 0) {
          console.warn('⚠️ Nenhum usuário classificado! Estrutura completa:')
          console.log(JSON.stringify(usuarios, null, 2))
        }

      } catch (error) {
        console.error('❌ Erro ao carregar usuários:', error)
        
        if (error.response?.status === 401) {
          localStorage.clear()
          router.push('/login')
        }
      }
    }

    onMounted(() => {
      console.log('🚀 AdminHome montado')
      carregarUsuarios()
    })

    return {
      router,
      nomeUsuario,
      administradores,
      usuariosComuns
    }
  }
}
</script>
  <style scoped>
  .adminHome {
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
    color: #3b6e54;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  /* Atalhos Rápidos */
  .atalhos-rapidos .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .card {
    background: white;
    padding: 2rem;
    border-radius: 16px;
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
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .card p {
    color: #666;
    font-size: 0.95rem;
  }

  /* Resumo */
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

  /* Lista de Usuários */
  .lista-usuarios {
    margin-top: 3rem;
  }

  .usuarios-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 2rem;
  }

  .usuarios-card {
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
    font-size: 0.9rem;
  }

  .usuarios-lista {
    max-height: 400px;
    overflow-y: auto;
    padding: 1rem;
  }

  .usuario-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 12px;
    transition: background 0.2s ease;
    margin-bottom: 0.5rem;
  }

  .usuario-item:hover {
    background: #f8fafc;
  }

  .usuario-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .usuario-info {
    flex: 1;
  }

  .usuario-nome {
    font-weight: 600;
    color: #333;
    margin: 0;
    font-size: 1rem;
  }

  .usuario-email {
    color: #666;
    font-size: 0.85rem;
    margin: 0.2rem 0 0 0;
  }

  .usuario-badge {
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.75rem;
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
    padding: 3rem 1rem;
    color: #999;
  }

  .empty-state p {
    margin: 0;
    font-style: italic;
  }

  /* Scrollbar personalizada */
  .usuarios-lista::-webkit-scrollbar {
    width: 8px;
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

  /* Responsivo */
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
  }
  </style>