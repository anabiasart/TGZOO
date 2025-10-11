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
  console.log('🔑 Token encontrado:', token ? 'SIM ✅' : 'NÃO ❌')
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    console.log('📤 Authorization header:', headers['Authorization'].substring(0, 20) + '...')
  } else {
    console.warn('⚠️ Nenhum token encontrado! Você precisa fazer login primeiro.')
  }
  
  return headers
}

// Função para detectar se é campanha ou notícia baseado no conteúdo
const detectarTipo = (content, title) => {
  if (!content) return 'noticia'
  
  // Se tem campos de campanha, é campanha
  const temCamposCampanha = /Data Início:|Data Fim:|Horário da Campanha:/i.test(content)
  const temTituloCampanha = /campanha|vacinação|mutirão/i.test(title || '')
  
  return (temCamposCampanha || temTituloCampanha) ? 'campanha' : 'noticia'
}

// Função para extrair dados de CAMPANHA
const extrairDadosCampanha = (content, title) => {
  const dataInicioMatch = content.match(/Data Início:\s*(.+?)(?:\n|$)/i)
  const dataFimMatch = content.match(/Data Fim:\s*(.+?)(?:\n|$)/i)
  const horarioMatch = content.match(/Horário da Campanha:\s*(.+?)(?:\n|$)/i)
  
  return {
    tipo: 'campanha',
    nomeCampanha: title,
    dataInicioCampanha: dataInicioMatch ? dataInicioMatch[1].trim() : '',
    dataFimCampanha: dataFimMatch ? dataFimMatch[1].trim() : '',
    horarioCampanha: horarioMatch ? horarioMatch[1].trim() : '',
    urlImagem: null
  }
}

// Função para extrair dados de NOTÍCIA
const extrairDadosNoticia = (content, title) => {
  return {
    tipo: 'noticia',
    nomeNoticia: title,
    urlImagemNoticia: null,
    resumo: content
  }
}

// Função para limpar o conteúdo de metadados
const limparConteudo = (content) => {
  if (!content) return ''
  
  return content
    .replace(/\n\nData Início:.*$/gim, '')
    .replace(/\nData Fim:.*$/gim, '')
    .replace(/\nHorário da Campanha:.*$/gim, '')
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
  const tipo = detectarTipo(backendNews.content, backendNews.title)
  const conteudoLimpo = limparConteudo(backendNews.content)
  
  let dadosEspecificos = {}
  
  if (tipo === 'campanha') {
    dadosEspecificos = extrairDadosCampanha(backendNews.content, backendNews.title)
    dadosEspecificos.urlImagem = backendNews.imageUrl
  } else {
    dadosEspecificos = extrairDadosNoticia(conteudoLimpo, backendNews.title)
    dadosEspecificos.urlImagemNoticia = backendNews.imageUrl
    dadosEspecificos.resumo = conteudoLimpo
  }
  
  return {
    id: backendNews.id,
    tipo: tipo,
    ...dadosEspecificos,
    // Campos comuns
    titulo: backendNews.title, // Mantém para compatibilidade
    categoria: tipo === 'campanha' ? 'campanha' : 'geral',
    status: 'ativo',
    autor: backendNews.user?.name || 'Sistema',
    dataPublicacao: backendNews.createdAt
  }
}

// Mapear frontend -> backend
const mapFrontendToBackend = (frontendNews) => {
  let content = ''
  let title = ''
  let imageUrl = ''
  
  if (frontendNews.tipo === 'campanha') {
    title = frontendNews.nomeCampanha
    imageUrl = frontendNews.urlImagem
    
    // Montar conteúdo da campanha
    content = `Campanha: ${frontendNews.nomeCampanha}`
    if (frontendNews.dataInicioCampanha) {
      content += `\n\nData Início: ${frontendNews.dataInicioCampanha}`
    }
    if (frontendNews.dataFimCampanha) {
      content += `\nData Fim: ${frontendNews.dataFimCampanha}`
    }
    if (frontendNews.horarioCampanha) {
      content += `\nHorário da Campanha: ${frontendNews.horarioCampanha}`
    }
  } else {
    title = frontendNews.nomeNoticia
    imageUrl = frontendNews.urlImagemNoticia
    content = frontendNews.resumo || ''
  }
  
  return {
    title: title,
    content: content,
    imageUrl: imageUrl || undefined
  }
}

export function useNoticias() {

  const carregarNoticias = async () => {
    carregando.value = true
    erro.value = null
    
    try {
      // GET /news é público, não precisa de token
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

  // Adicionar nova notícia ou campanha
  const adicionarNoticia = async (noticiaForm) => {
    carregando.value = true
    erro.value = null
    
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('Você precisa estar autenticado como administrador')
      }

      const payload = mapFrontendToBackend(noticiaForm)
      console.log('📤 Enviando payload:', payload)
      
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
        throw new Error(errorText || 'Erro ao criar item')
      }
      
      const novoItem = await response.json()
      noticias.value.unshift(mapBackendToFrontend(novoItem))
      
      console.log('✅ Notícia criada com sucesso:', novoItem.id)
      
    } catch (error) {
      erro.value = error.message
      console.error('❌ Erro ao adicionar:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  // ✨ EDITAR notícia - AGORA COM INTEGRAÇÃO REAL
  const editarNoticia = async (id, noticiaForm) => {
    carregando.value = true
    erro.value = null
    
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('Você precisa estar autenticado como administrador')
      }

      const payload = mapFrontendToBackend(noticiaForm)
      console.log('📝 Editando notícia ID:', id)
      console.log('📤 Enviando payload:', payload)
      
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
        throw new Error(errorText || 'Erro ao atualizar item')
      }
      
      const itemAtualizado = await response.json()
      
      // Atualizar na lista local
      const index = noticias.value.findIndex(n => n.id === id)
      if (index !== -1) {
        noticias.value[index] = mapBackendToFrontend(itemAtualizado)
      }
      
      console.log('✅ Notícia atualizada com sucesso:', id)
      
    } catch (error) {
      erro.value = error.message
      console.error('❌ Erro ao editar:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  // ✨ REMOVER notícia - AGORA COM INTEGRAÇÃO REAL
  const removerNoticiaPorId = async (id) => {
    carregando.value = true
    erro.value = null
    
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('Você precisa estar autenticado como administrador')
      }

      console.log('🗑️ Removendo notícia ID:', id)
      
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
        throw new Error(errorText || 'Erro ao excluir item')
      }
      
      // Remover da lista local
      noticias.value = noticias.value.filter(n => n.id !== id)
      
      console.log('✅ Notícia removida com sucesso:', id)
      
    } catch (error) {
      erro.value = error.message
      console.error('❌ Erro ao remover:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  // Alterar status (apenas localmente - backend não tem este campo)
  const alterarStatusNoticia = async (id, novoStatus) => {
    const index = noticias.value.findIndex(n => n.id === id)
    if (index !== -1) {
      noticias.value[index].status = novoStatus
    }
  }

  // Buscar notícia por ID
  const buscarNoticiaPorId = async (id) => {
    try {
      // GET /news/{id} é público também, não precisa de token
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