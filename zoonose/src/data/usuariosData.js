import { ref } from 'vue'

const usuarios = ref([])
const carregando = ref(false)
const erro = ref(null)

const API_URL = 'http://localhost:8080/api/users'

const getAuthToken = () => {
  return localStorage.getItem('token')
}

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
      usuarios.value = data.map(user => ({
        id: user.id,
        name: user.name || user.email,
        email: user.email,
        phone: user.phone || 'Não informado',
        role: getRoleString(user),
        isAdmin: checkIfAdmin(user),
        rawRoles: user.roles
      }))
      
    } catch (error) {
      erro.value = `Erro ao carregar usuários: ${error.message}`
      console.error('❌ Erro ao carregar usuários:', error)
      usuarios.value = []
    } finally {
      carregando.value = false
    }
  }

  const checkIfAdmin = (user) => {
    if (!user.roles) {
      return false
    }
    if (typeof user.roles === 'string') {
      const isAdmin = user.roles === 'ROLE_ADMINISTRATOR' || user.roles === 'ADMINISTRATOR'
      return isAdmin
    }
    
    if (Array.isArray(user.roles)) {
      const isAdmin = user.roles.some(role => {
        if (typeof role === 'string') {
          const match = role === 'ROLE_ADMINISTRATOR' || role === 'ADMINISTRATOR'
          return match
        }
        if (typeof role === 'object' && role !== null) {
          if (role.name) {
            const match = role.name === 'ROLE_ADMINISTRATOR' || role.name === 'ADMINISTRATOR'
            return match
          }
          const roleStr = String(role)
          const match = roleStr === 'ROLE_ADMINISTRATOR' || roleStr === 'ADMINISTRATOR'
          return match
        }
        return false
      })
      
      return isAdmin
    }
    
    if (typeof user.roles === 'object' && user.roles.name) {
      const isAdmin = user.roles.name === 'ROLE_ADMINISTRATOR' || user.roles.name === 'ADMINISTRATOR'
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