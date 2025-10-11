// src/data/usuariosData.js
import { ref } from 'vue'

const usuarios = ref([])
const carregando = ref(false)
const erro = ref(null)

const API_URL = 'http://localhost:8080/api/users'

// Função para obter o token JWT
const getAuthToken = () => {
  return localStorage.getItem('token')
}

// Função para configurar headers
const getAuthHeaders = () => {
  const token = getAuthToken()
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`
  }
  
  return headers
}

export function useUsuarios() {
  
  const carregarUsuarios = async () => {
    carregando.value = true
    erro.value = null
    
    try {
      const token = getAuthToken()
      
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.')
      }

      console.log('📡 Carregando usuários da API...')
      
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: getAuthHeaders(),
        mode: 'cors'
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Não autorizado. Token inválido ou expirado.')
        }
        if (response.status === 403) {
          throw new Error('Sem permissão. Apenas administradores podem ver usuários.')
        }
        throw new Error(`Erro HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      
      console.log('✅ Usuários recebidos:', data.length)
      console.log('📊 Estrutura do primeiro usuário:', data.length > 0 ? data[0] : 'Nenhum')
      
      // Log detalhado das roles do primeiro usuário para debug
      if (data.length > 0 && data[0].roles) {
        console.log('🔍 Roles do primeiro usuário:', data[0].roles)
        console.log('🔍 Tipo das roles:', typeof data[0].roles)
        console.log('🔍 É array?', Array.isArray(data[0].roles))
        if (Array.isArray(data[0].roles) && data[0].roles.length > 0) {
          console.log('🔍 Primeira role:', data[0].roles[0])
          console.log('🔍 Tipo da primeira role:', typeof data[0].roles[0])
          console.log('🔍 Propriedades:', Object.keys(data[0].roles[0]))
        }
      }
      
      // Mapear para formato consistente
      usuarios.value = data.map(user => ({
        id: user.id,
        name: user.name || user.email,
        email: user.email,
        phone: user.phone || 'Não informado',
        role: getRoleString(user),
        isAdmin: checkIfAdmin(user),
        rawRoles: user.roles
      }))
      
      console.log('👥 Total de usuários:', usuarios.value.length)
      console.log('👑 Administradores:', usuarios.value.filter(u => u.isAdmin).length)
      console.log('👤 Usuários comuns:', usuarios.value.filter(u => !u.isAdmin).length)
      
    } catch (error) {
      erro.value = `Erro ao carregar usuários: ${error.message}`
      console.error('❌ Erro ao carregar usuários:', error)
      usuarios.value = []
    } finally {
      carregando.value = false
    }
  }

  // Verificar se o usuário é admin
  const checkIfAdmin = (user) => {
    // Caso 1: roles não existe
    if (!user.roles) {
      console.log('⚠️ Usuário sem roles:', user.name || user.email)
      return false
    }
    
    console.log('🔍 Verificando roles de:', user.name || user.email, '→', user.roles)
    
    // Caso 2: roles é uma string direta
    if (typeof user.roles === 'string') {
      const isAdmin = user.roles === 'ROLE_ADMINISTRATOR' || user.roles === 'ADMINISTRATOR'
      console.log('  String direta:', user.roles, '→', isAdmin ? 'ADMIN ✅' : 'USER')
      return isAdmin
    }
    
    // Caso 3: roles é um array
    if (Array.isArray(user.roles)) {
      const isAdmin = user.roles.some(role => {
        if (typeof role === 'string') {
          const match = role === 'ROLE_ADMINISTRATOR' || role === 'ADMINISTRATOR'
          console.log('  Array[String]:', role, '→', match)
          return match
        }
        if (typeof role === 'object' && role !== null) {
          // Verifica se tem a propriedade 'name'
          if (role.name) {
            const match = role.name === 'ROLE_ADMINISTRATOR' || role.name === 'ADMINISTRATOR'
            console.log('  Array[Object].name:', role.name, '→', match)
            return match
          }
          // Caso especial: pode ser um objeto enum direto
          const roleStr = String(role)
          const match = roleStr === 'ROLE_ADMINISTRATOR' || roleStr === 'ADMINISTRATOR'
          console.log('  Array[Object].toString:', roleStr, '→', match)
          return match
        }
        return false
      })
      
      console.log('  ✅ Resultado final:', isAdmin ? 'ADMIN' : 'USER')
      return isAdmin
    }
    
    // Caso 4: roles é um objeto com propriedade 'name'
    if (typeof user.roles === 'object' && user.roles.name) {
      const isAdmin = user.roles.name === 'ROLE_ADMINISTRATOR' || user.roles.name === 'ADMINISTRATOR'
      console.log('  Object.name:', user.roles.name, '→', isAdmin ? 'ADMIN ✅' : 'USER')
      return isAdmin
    }
    
    console.log('  ⚠️ Formato de roles não reconhecido')
    return false
  }

  // Obter string da role
  const getRoleString = (user) => {
    if (!user.roles || user.roles.length === 0) return 'ROLE_CUSTOMER'
    
    const firstRole = user.roles[0]
    
    if (typeof firstRole === 'string') {
      return firstRole
    }
    if (typeof firstRole === 'object' && firstRole !== null) {
      if (firstRole.name) {
        return firstRole.name
      }
      // Tentar converter para string
      return String(firstRole)
    }
    
    return 'ROLE_CUSTOMER'
  }

  // Buscar usuário por ID
  const buscarUsuarioPorId = async (id) => {
    try {
      const response = await fetch(`${API_URL}/list/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        mode: 'cors'
      })
      
      if (!response.ok) {
        console.error(`Erro ao buscar usuário: ${response.status}`)
        return null
      }
      
      const user = await response.json()
      
      return {
        id: user.id,
        name: user.name || user.email,
        email: user.email,
        phone: user.phone || 'Não informado',
        role: getRoleString(user),
        isAdmin: checkIfAdmin(user)
      }
      
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      return null
    }
  }

  // Limpar erro
  const limparErro = () => {
    erro.value = null
  }

  return {
    usuarios,
    carregando,
    erro,
    carregarUsuarios,
    buscarUsuarioPorId,
    limparErro
  }
}