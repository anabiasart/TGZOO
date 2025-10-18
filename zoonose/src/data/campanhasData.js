// zoonose/src/data/campanhasData.js
import { ref } from 'vue'

const campanhas = ref([])
const carregando = ref(false)
const erro = ref(null)

const API_URL = 'http://localhost:8080/api/campaigns'

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

// Função auxiliar para formatar data ISO para dd/mm/yyyy
const formatarDataParaExibicao = (dataISO) => {
  if (!dataISO) return ''
  try {
    const data = new Date(dataISO)
    return data.toLocaleDateString('pt-BR')
  } catch (error) {
    console.error('Erro ao formatar data:', error)
    return ''
  }
}

// Função auxiliar para extrair horário limpo
const extractTimeFromDateTime = (startDateTime, endDateTime) => {
  if (!startDateTime) return ''
  
  try {
    const startDate = new Date(startDateTime)
    const endDate = endDateTime ? new Date(endDateTime) : null
    
    const startTime = startDate.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    
    if (endDate) {
      const endTime = endDate.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      return `${startTime} às ${endTime}`
    }
    
    return `A partir das ${startTime}`
  } catch (error) {
    console.error('Erro ao extrair horário:', error)
    return ''
  }
}

// Mapear backend -> frontend (VERSÃO CORRIGIDA)
const mapBackendToFrontend = (backendCampaign) => {
  const dataInicio = formatarDataParaExibicao(backendCampaign.startDateTime)
  const dataFim = formatarDataParaExibicao(backendCampaign.endDateTime)
  const horario = extractTimeFromDateTime(backendCampaign.startDateTime, backendCampaign.endDateTime)
  
  // Criar uma descrição resumida se não existir
  let descricaoResumo = backendCampaign.description || ''
  if (!descricaoResumo || descricaoResumo.length < 10) {
    descricaoResumo = `Campanha ${backendCampaign.name} agendada para ${dataInicio}`
    if (dataFim && dataFim !== dataInicio) {
      descricaoResumo += ` até ${dataFim}`
    }
    if (horario) {
      descricaoResumo += `. Horário: ${horario}`
    }
  }
  
  return {
    id: backendCampaign.id,
    tipo: 'campanha',
    nomeCampanha: backendCampaign.name,
    dataInicioCampanha: dataInicio,
    dataFimCampanha: dataFim,
    horarioCampanha: horario,
    urlImagem: backendCampaign.imageUrl,
    description: backendCampaign.description,
    resumo: descricaoResumo, // ✅ Adicionar resumo para exibição
    localCampanha: backendCampaign.location || '', // ✅ Local se existir
    
    // Campos comuns para compatibilidade
    titulo: backendCampaign.name,
    categoria: 'campanha',
    status: 'ativo',
    autor: backendCampaign.user?.name || 'Sistema',
    dataPublicacao: backendCampaign.createdAt || new Date().toISOString()
  }
}

// Mapear frontend -> backend
const mapFrontendToBackend = (frontendCampaign) => {
  // Função para garantir formato de data correto
  const formatarData = (data) => {
    if (!data) return null
    
    // Se já está no formato yyyy-mm-dd, mantém
    if (data.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return data
    }
    
    // Se está no formato dd/mm/yyyy, converte
    if (data.includes('/')) {
      const [dia, mes, ano] = data.split('/')
      return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
    }
    
    // Se é um objeto Date, converte
    if (data instanceof Date) {
      return data.toISOString().split('T')[0]
    }
    
    return data
  }

  const dataInicio = formatarData(frontendCampaign.dataInicioCampanha)
  const dataFim = formatarData(frontendCampaign.dataFimCampanha)
  
  const startDateTime = createDateTime(dataInicio, '08:00:00')
  const endDateTime = createDateTime(dataFim, '17:00:00')
  
  console.log('🔍 Debug formatação:')
  console.log('Data início original:', frontendCampaign.dataInicioCampanha)
  console.log('Data início formatada:', dataInicio)
  console.log('StartDateTime final:', startDateTime)
  console.log('EndDateTime final:', endDateTime)
  
  return {
    name: frontendCampaign.nomeCampanha,
    description: frontendCampaign.description || `Campanha: ${frontendCampaign.nomeCampanha}`,
    startDateTime: startDateTime,
    endDateTime: endDateTime,
    imageUrl: frontendCampaign.urlImagem || undefined
  }
}

const createDateTime = (date, time) => {
  if (!date) return null
  
  // Garantir que a data está no formato yyyy-mm-dd
  let formattedDate = date
  if (date.includes('/')) {
    const [dia, mes, ano] = date.split('/')
    formattedDate = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
  }
  
  const timeToUse = time || '08:00:00'
  
  // Formato ISO 8601 esperado pelo backend: "2025-01-20T08:00:00"
  return `${formattedDate}T${timeToUse}`
}

export function useCampanhas() {

  const carregarCampanhas = async () => {
    carregando.value = true
    erro.value = null
    
    try {
      // GET /campaigns é público, não precisa de token
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
      campanhas.value = data.content.map(mapBackendToFrontend)
      
      console.log('✅ Campanhas carregadas:', campanhas.value.length)
      console.log('📋 IDs das campanhas:', campanhas.value.map(c => c.id))
      
    } catch (error) {
      erro.value = `Erro ao carregar campanhas: ${error.message}`
      console.error('Erro ao carregar campanhas:', error)
      campanhas.value = []
    } finally {
      carregando.value = false
    }
  }

  // Adicionar nova campanha
  const adicionarCampanha = async (campanhaForm) => {
    carregando.value = true
    erro.value = null
    
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('Você precisa estar autenticado como administrador')
      }

      const payload = mapFrontendToBackend(campanhaForm)
      console.log('📤 Enviando payload de campanha:', payload)
      
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
          throw new Error('Sem permissão. Apenas administradores podem criar campanhas.')
        }
        throw new Error(errorText || 'Erro ao criar campanha')
      }
      
      const novaCampanha = await response.json()
      campanhas.value.unshift(mapBackendToFrontend(novaCampanha))
      
      console.log('✅ Campanha criada com sucesso:', novaCampanha.id)
      
    } catch (error) {
      erro.value = error.message
      console.error('❌ Erro ao adicionar campanha:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  // Editar campanha
  const editarCampanha = async (id, campanhaForm) => {
    carregando.value = true
    erro.value = null
    
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('Você precisa estar autenticado como administrador')
      }

      const payload = mapFrontendToBackend(campanhaForm)
      console.log('📝 Editando campanha ID:', id)
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
          throw new Error('Sem permissão. Apenas administradores podem editar campanhas.')
        }
        if (response.status === 404) {
          throw new Error('Campanha não encontrada.')
        }
        throw new Error(errorText || 'Erro ao atualizar campanha')
      }
      
      const campanhaAtualizada = await response.json()
      
      // Atualizar na lista local
      const index = campanhas.value.findIndex(c => c.id === id)
      if (index !== -1) {
        campanhas.value[index] = mapBackendToFrontend(campanhaAtualizada)
      }
      
      console.log('✅ Campanha atualizada com sucesso:', id)
      
    } catch (error) {
      erro.value = error.message
      console.error('❌ Erro ao editar campanha:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  // Remover campanha
  const removerCampanha = async (id) => {
    carregando.value = true
    erro.value = null
    
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('Você precisa estar autenticado como administrador')
      }

      console.log('🗑️ Removendo campanha ID:', id)
      
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
          throw new Error('Sem permissão. Apenas administradores podem excluir campanhas.')
        }
        if (response.status === 404) {
          throw new Error('Campanha não encontrada.')
        }
        throw new Error(errorText || 'Erro ao excluir campanha')
      }
      
      // Remover da lista local
      campanhas.value = campanhas.value.filter(c => c.id !== id)
      
      console.log('✅ Campanha removida com sucesso:', id)
      
    } catch (error) {
      erro.value = error.message
      console.error('❌ Erro ao remover campanha:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  // Buscar campanha por ID
  const buscarCampanhaPorId = async (id) => {
    try {
      console.log('🔍 [campanhasData] Buscando campanha por ID:', id)
      
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      })
      
      console.log('📡 Response status:', response.status)
      
      if (!response.ok) {
        console.error(`❌ Erro ao buscar campanha: ${response.status}`)
        return null
      }
      
      const campanha = await response.json()
      console.log('✅ Campanha bruta do backend:', campanha)
      
      const campanhaFormatada = mapBackendToFrontend(campanha)
      console.log('✅ Campanha formatada:', campanhaFormatada)
      
      return campanhaFormatada
      
    } catch (error) {
      console.error('❌ Erro ao buscar campanha:', error)
      return null
    }
  }

  // Alterar status (apenas localmente - backend não tem este campo)
  const alterarStatusCampanha = async (id, novoStatus) => {
    const index = campanhas.value.findIndex(c => c.id === id)
    if (index !== -1) {
      campanhas.value[index].status = novoStatus
    }
  }

  // Limpar erro
  const limparErro = () => {
    erro.value = null
  }

  return {
    campanhas,
    carregando,
    erro,
    carregarCampanhas,
    adicionarCampanha,
    editarCampanha,
    removerCampanha,
    alterarStatusCampanha,
    buscarCampanhaPorId,
    limparErro
  }
}