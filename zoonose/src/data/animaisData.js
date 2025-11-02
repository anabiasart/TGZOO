import { ref } from 'vue'

const animais = ref([])
const carregando = ref(false)
const erro = ref(null)

const API_URL = 'http://localhost:8080/api/animals'

const getAuthToken = () => localStorage.getItem('token')

const getAuthHeaders = () => {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`
  return headers
}

const mapBackendToFrontend = (animal) => ({
  id: animal.id,
  name: animal.name,
  breed: animal.breed,
  description: animal.description || '',
  imageUrl: animal.imageUrl,
  isVaccinated: animal.isVaccinated,
  isNeutered: animal.isNeutered,
  species: animal.species,
  size: animal.size,
  gender: animal.gender,
  createdAt: animal.createdAt,
  updatedAt: animal.updatedAt,
  userName: animal.user?.name || 'Sistema'
})

const mapFrontendToBackend = (animal) => ({
  name: animal.name,
  breed: animal.breed || 'SRD',
  description: animal.description || '',
  imageUrl: animal.imageUrl || null,
  isVaccinated: !!animal.isVaccinated,
  isNeutered: !!animal.isNeutered,
  species: animal.species,
  size: animal.size,
  gender: animal.gender
})

export function useAnimais() {

  const carregarAnimais = async () => {
    carregando.value = true
    erro.value = null
    try {
      const response = await fetch(`${API_URL}?size=100&sort=createdAt,desc`, {
        method: 'GET',
        headers: getAuthHeaders(),
        mode: 'cors'
      })

      if (!response.ok) throw new Error(`Erro HTTP ${response.status}`)

      const data = await response.json()
      animais.value = (data.content || data).map(mapBackendToFrontend)
      console.log('Animais carregados:', animais.value.length)
    } catch (e) {
      erro.value = 'Erro ao carregar animais: ' + e.message
      console.error(erro.value)
    } finally {
      carregando.value = false
    }
  }

  // 🔍 Listar animais disponíveis para adoção (público)
  const carregarAnimaisAdocao = async () => {
    carregando.value = true
    erro.value = null
    try {
      const response = await fetch(`${API_URL}/adocao`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors'
      })
      if (!response.ok) throw new Error(`Erro HTTP ${response.status}`)
      const data = await response.json()
      animais.value = (data.content || data).map(mapBackendToFrontend)
      console.log('Animais para adoção carregados:', animais.value.length)
    } catch (e) {
      erro.value = 'Erro ao carregar animais para adoção: ' + e.message
      console.error(erro.value)
    } finally {
      carregando.value = false
    }
  }

  const adicionarAnimal = async (animalForm) => {
    carregando.value = true
    erro.value = null
    try {
      const payload = mapFrontendToBackend(animalForm)
      console.log('📦 Enviando novo animal:', payload)

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        mode: 'cors',
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Erro ao cadastrar animal (${response.status}): ${text}`)
      }

      const novoAnimal = await response.json()
      animais.value.unshift(mapBackendToFrontend(novoAnimal))
      console.log('✅ Animal cadastrado com sucesso:', novoAnimal.id)
    } catch (e) {
      erro.value = e.message
      console.error('❌ Erro ao adicionar animal:', e)
      throw e
    } finally {
      carregando.value = false
    }
  }

  const atualizarAnimal = async (id, animalForm) => {
    carregando.value = true
    erro.value = null
    try {
      const payload = mapFrontendToBackend(animalForm)
      console.log('📝 Atualizando animal ID:', id, payload)

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        mode: 'cors',
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Erro ao atualizar animal (${response.status}): ${text}`)
      }

      const atualizado = await response.json()
      const index = animais.value.findIndex(a => a.id === id)
      if (index !== -1) animais.value[index] = mapBackendToFrontend(atualizado)

      console.log('✅ Animal atualizado:', id)
    } catch (e) {
      erro.value = e.message
      console.error('❌ Erro ao atualizar animal:', e)
      throw e
    } finally {
      carregando.value = false
    }
  }

  const removerAnimal = async (id) => {
    carregando.value = true
    erro.value = null
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        mode: 'cors'
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Erro ao excluir animal (${response.status}): ${text}`)
      }

      animais.value = animais.value.filter(a => a.id !== id)
      console.log('🗑️ Animal removido:', id)
    } catch (e) {
      erro.value = e.message
      console.error('❌ Erro ao remover animal:', e)
      throw e
    } finally {
      carregando.value = false
    }
  }

  return {
    animais,
    carregando,
    erro,
    carregarAnimais,
    carregarAnimaisAdocao,
    adicionarAnimal,
    atualizarAnimal,
    removerAnimal
  }
}
