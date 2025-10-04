// zoonose/src/data/noticiasData.js
import { ref } from 'vue'

const noticias = ref([])
const carregando = ref(false)
const erro = ref(null)

const API_URL = 'http://localhost:8080/api/news'

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
  
  const dataMatch = content.match(/Data:\s*(.+?)(?:\n|$)/i)
  const horarioMatch = content.match(/Horário:\s*(.+?)(?:\n|$)/i)
  const localMatch = content.match(/Local:\s*(.+?)(?:\n|$)/i)
  const publicoMatch = content.match(/Público:\s*(.+?)(?:\n|$)/i) || 
                       content.match(/Público-alvo:\s*(.+?)(?:\n|$)/i)
  const contatoMatch = content.match(/Contato:\s*(.+?)(?:\n|$)/i)
  const inscricoesMatch = content.match(/Inscrições:\s*(.+?)(?:\n|$)/i)
  
  if (dataMatch) detalhes.data = dataMatch[1].trim()
  if (horarioMatch) detalhes.horario = horarioMatch[1].trim()
  if (localMatch) detalhes.local = localMatch[1].trim()
  if (publicoMatch) detalhes.publico = publicoMatch[1].trim()
  if (contatoMatch) detalhes.contato = contatoMatch[1].trim()
  if (inscricoesMatch) detalhes.inscricoes = inscricoesMatch[1].trim()
  
  return detalhes
}

// Remover detalhes do conteúdo
const removerDetalhesDoConteudo = (content) => {
  if (!content) return ''
  
  return content
    .replace(/\n\nData:.*$/gim, '')
    .replace(/\nHorário:.*$/gim, '')
    .replace(/\nLocal:.*$/gim, '')
    .replace(/\nPúblico(-alvo)?:.*$/gim, '')
    .replace(/\nContato:.*$/gim, '')
    .replace(/\nInscrições:.*$/gim, '')
    .trim()
}

// Mapear backend -> frontend
const mapBackendToFrontend = (backendNews) => {
  const detalhes = extrairDetalhes(backendNews.content)
  const resumoLimpo = removerDetalhesDoConteudo(backendNews.content)
  
  return {
    id: backendNews.id,
    titulo: backendNews.title,
    resumo: resumoLimpo || backendNews.content,
    imagem: backendNews.imageUrl,
    categoria: 'geral',
    status: 'ativo',
    autor: backendNews.user?.name || 'Sistema',
    dataPublicacao: backendNews.createdAt,
    detalhes: detalhes
  }
}

// Mapear frontend -> backend
const mapFrontendToBackend = (frontendNews) => {
  let content = frontendNews.resumo || ''
  
  if (frontendNews.detalhes) {
    const det = frontendNews.detalhes
    let detalhesTexto = ''
    
    if (det.data) detalhesTexto += `\n\nData: ${det.data}`
    if (det.horario) detalhesTexto += `\nHorário: ${det.horario}`
    if (det.local) detalhesTexto += `\nLocal: ${det.local}`
    if (det.publico) detalhesTexto += `\nPúblico: ${det.publico}`
    if (det.contato) detalhesTexto += `\nContato: ${det.contato}`
    if (det.inscricoes) detalhesTexto += `\nInscrições: ${det.inscricoes}`
    
    content += detalhesTexto
  }
  
  return {
    title: frontendNews.titulo,
    content: content,
    imageUrl: frontendNews.imagem || undefined
  }
}

export function useNoticias() {
  
  // Carregar todas as notícias
  const carregarNoticias = async () => {
    carregando.value = true
    erro.value = null
    
    try {
      const response = await fetch(`${API_URL}?size=100&sort=createdAt,desc`, {
        method: 'GET',
        headers: getAuthHeaders(),
        mode: 'cors',
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      noticias.value = data.content.map(mapBackendToFrontend)
      
    } catch (error) {
      erro.value = `Erro ao carregar notícias: ${error.message}`
      console.error('Erro ao carregar notícias:', error)
      noticias.value = [] // Lista vazia em caso de erro
    } finally {
      carregando.value = false
    }
  }

  // Adicionar nova notícia
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
        throw new Error(errorText || 'Erro ao criar notícia')
      }
      
      const novaNoticia = await response.json()
      noticias.value.unshift(mapBackendToFrontend(novaNoticia))
      
    } catch (error) {
      erro.value = error.message
      console.error('Erro ao adicionar notícia:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  // Editar notícia (apenas localmente)
  const editarNoticia = async (id, noticiaForm) => {
    const index = noticias.value.findIndex(n => n.id === id)
    if (index !== -1) {
      noticias.value[index] = {
        ...noticias.value[index],
        ...noticiaForm,
        id: noticias.value[index].id,
        dataPublicacao: noticias.value[index].dataPublicacao
      }
    }
  }

  // Remover notícia (apenas localmente)
  const removerNoticiaPorId = async (id) => {
    noticias.value = noticias.value.filter(n => n.id !== id)
  }

  // Alterar status (apenas localmente)
  const alterarStatusNoticia = async (id, novoStatus) => {
    const index = noticias.value.findIndex(n => n.id === id)
    if (index !== -1) {
      noticias.value[index].status = novoStatus
    }
  }

  // Buscar notícia por ID
  const buscarNoticiaPorId = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        headers: getAuthHeaders(),
        mode: 'cors',
        credentials: 'include'
      })
      
      if (!response.ok) return null
      
      const noticia = await response.json()
      return mapBackendToFrontend(noticia)
      
    } catch (error) {
      console.error('Erro ao buscar notícia:', error)
      return null
    }
  }

  // Limpar erro
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