import { ref } from 'vue'

const noticias = ref([])
const carregando = ref(false)
const erro = ref(null)

const API_URL = 'http://localhost:8080/api/news'

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
  } else {
    console.warn(' Nenhum token encontrado! Você precisa fazer login primeiro.')
  }
  
  return headers
}

const mapBackendToFrontend = (backendNews) => {
  return {
    id: backendNews.id,
    tipo: 'noticia',
    nomeNoticia: backendNews.title,
    urlImagemNoticia: backendNews.imageUrl,
    resumo: backendNews.content,
    // Campos comuns
    titulo: backendNews.title, 
    categoria: 'geral',
    status: 'ativo',
    autor: backendNews.user?.name || 'Sistema',
    dataPublicacao: backendNews.createdAt
  }
}

const mapFrontendToBackend = (frontendNews) => {
  return {
    title: frontendNews.nomeNoticia,
    content: frontendNews.resumo || '',
    imageUrl: frontendNews.urlImagemNoticia || undefined
  }
}

export function useNoticias() {

  const carregarNoticias = async () => {
    carregando.value = true
    erro.value = null
    
    try {
      const response = await fetch(`${API_URL}?size=100&sort=createdAt,desc`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      })
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      noticias.value = data.content.map(mapBackendToFrontend)
      
      
    } catch (error) {
      erro.value = `Erro ao carregar notícias: ${error.message}`
      console.error('Erro ao carregar notícias:', error)
      noticias.value = []
    } finally {
      carregando.value = false
    }
  }

  const adicionarNoticia = async (noticiaForm) => {
    carregando.value = true
    erro.value = null
    
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('Você precisa estar autenticado como administrador')
      }

      const payload = mapFrontendToBackend(noticiaForm)
      
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        if (response.status === 401) {
          throw new Error('Não autorizado. Faça login novamente.')
        }
        if (response.status === 403) {
          throw new Error('Sem permissão. Apenas administradores podem criar notícias.')
        }
        throw new Error(errorText || 'Erro ao criar notícia')
      }
      
      const novaNoticia = await response.json()
      noticias.value.unshift(mapBackendToFrontend(novaNoticia))
      
      
    } catch (error) {
      erro.value = error.message
      console.error('❌ Erro ao adicionar notícia:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  const editarNoticia = async (id, noticiaForm) => {
    carregando.value = true
    erro.value = null
    
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('Você precisa estar autenticado como administrador')
      }

      const payload = mapFrontendToBackend(noticiaForm)
      
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        if (response.status === 401) {
          throw new Error('Não autorizado. Faça login novamente.')
        }
        if (response.status === 403) {
          throw new Error('Sem permissão. Apenas administradores podem editar notícias.')
        }
        if (response.status === 404) {
          throw new Error('Notícia não encontrada.')
        }
        throw new Error(errorText || 'Erro ao atualizar notícia')
      }
      
      const noticiaAtualizada = await response.json()
      
      const index = noticias.value.findIndex(n => n.id === id)
      if (index !== -1) {
        noticias.value[index] = mapBackendToFrontend(noticiaAtualizada)
      }
      
      
    } catch (error) {
      erro.value = error.message
      console.error(' Erro ao editar notícia:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  const removerNoticiaPorId = async (id) => {
    carregando.value = true
    erro.value = null
    
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('Você precisa estar autenticado como administrador')
      }

      
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        mode: 'cors',
        credentials: 'include'
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        if (response.status === 401) {
          throw new Error('Não autorizado. Faça login novamente.')
        }
        if (response.status === 403) {
          throw new Error('Sem permissão. Apenas administradores podem excluir notícias.')
        }
        if (response.status === 404) {
          throw new Error('Notícia não encontrada.')
        }
        throw new Error(errorText || 'Erro ao excluir notícia')
      }
      
      noticias.value = noticias.value.filter(n => n.id !== id)
      
      
    } catch (error) {
      erro.value = error.message
      console.error('❌ Erro ao remover notícia:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  const buscarNoticiaPorId = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      })
      
      if (!response.ok) {
        console.error(`Erro ao buscar notícia: ${response.status}`)
        return null
      }
      
      const noticia = await response.json()
      return mapBackendToFrontend(noticia)
      
    } catch (error) {
      console.error('Erro ao buscar notícia:', error)
      return null
    }
  }

  const alterarStatusNoticia = async (id, novoStatus) => {
    const index = noticias.value.findIndex(n => n.id === id)
    if (index !== -1) {
      noticias.value[index].status = novoStatus
    }
  }

  const limparErro = () => {
    erro.value = null
  }

  return {
    noticias,
    carregando,
    erro,
    carregarNoticias,
    adicionarNoticia,
    editarNoticia,
    removerNoticiaPorId,
    alterarStatusNoticia,
    buscarNoticiaPorId,
    limparErro
  }
}