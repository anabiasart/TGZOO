import { toBackendTimestamp } from '@/utils/datetime'
import { ref } from 'vue'

const campanhas = ref([])
const carregando = ref(false)
const erro = ref(null)

const API_URL = 'http://localhost:8080/api/campaigns'

const getAuthToken = () => {
  return localStorage.getItem('token')
}

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

const mapBackendToFrontend = (backendCampaign) => {
  const dataInicio = formatarDataParaExibicao(backendCampaign.startDateTime)
  const dataFim = formatarDataParaExibicao(backendCampaign.endDateTime)
  const horario = extractTimeFromDateTime(backendCampaign.startDateTime, backendCampaign.endDateTime)
  
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
    resumo: descricaoResumo, 
    localCampanha: backendCampaign.location || '', 
    
    titulo: backendCampaign.name,
    categoria: 'campanha',
    status: 'ativo',
    autor: backendCampaign.user?.name || 'Sistema',
    dataPublicacao: backendCampaign.createdAt || new Date().toBackendTimestamp(new Date())
  }
}

const mapFrontendToBackend = (frontendCampaign) => {
  const formatarData = (data) => {
    if (!data) return null
    if (data.match(/^\d{4}-\d{2}-\d{2}$/)) return data
    if (data.includes('/')) {
      const [dia, mes, ano] = data.split('/')
      return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
    }
    return data
  }

  const dataInicio = formatarData(frontendCampaign.dataInicioCampanha)
  const dataFim = formatarData(frontendCampaign.dataFimCampanha)

  // 🔒 Garante sempre um timestamp completo no formato ISO
  const startDateTime = createDateTime(dataInicio, frontendCampaign.horaInicioCampanha || '00:00')
  const endDateTime = dataFim ? createDateTime(dataFim, frontendCampaign.horaFimCampanha || '00:00') : null

  console.log('🕒 Enviando startDateTime:', startDateTime)
  console.log('🕒 Enviando endDateTime:', endDateTime)

  return {
    name: frontendCampaign.nomeCampanha,
    description: frontendCampaign.description || `Campanha: ${frontendCampaign.nomeCampanha}`,
    startDateTime,
    endDateTime,
    imageUrl: frontendCampaign.urlImagem || undefined,
    animalId: frontendCampaign.animalId || null // pronto pra integração futura
  }
}

const createDateTime = (date, time) => {
  if (!date) return null

  // Converte formato BR (dd/MM/yyyy → yyyy-MM-dd)
  if (date.includes('/')) {
    const [dia, mes, ano] = date.split('/')
    date = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
  }

  const [hora, minuto] = (time || '00:00').split(':')
  
  // Cria a data em horário local e corrige para UTC (para evitar shift no backend)
  const localDate = new Date(`${date}T${hora.padStart(2, '0')}:${minuto.padStart(2, '0')}:00`)
  const offset = localDate.getTimezoneOffset() * 60000 // diferença do fuso em ms
  const adjusted = new Date(localDate.getTime() - offset)
  
  return adjusted.toISOString().slice(0, 19) // corta o 'Z' no final
}


export function useCampanhas() {

  const carregarCampanhas = async () => {
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
      campanhas.value = data.content.map(mapBackendToFrontend)

    } catch (error) {
      erro.value = `Erro ao carregar campanhas: ${error.message}`
      campanhas.value = []
    } finally {
      carregando.value = false
    }
  }

  const adicionarCampanha = async (campanhaForm) => {
    carregando.value = true
    erro.value = null
    
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('Você precisa estar autenticado como administrador')
      }

      const payload = mapFrontendToBackend(campanhaForm)
      
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

  const alterarStatusCampanha = async (id, novoStatus) => {
    const index = campanhas.value.findIndex(c => c.id === id)
    if (index !== -1) {
      campanhas.value[index].status = novoStatus
    }
  }

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