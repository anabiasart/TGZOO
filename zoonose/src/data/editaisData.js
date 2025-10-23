import { ref, computed } from 'vue'
import { useNoticias } from './noticiasData.js'
import { useCampanhas } from './campanhasData.js'

export function useEditais() {
  const { 
    noticias, 
    carregando: carregandoNoticias, 
    erro: erroNoticias,
    carregarNoticias,
    adicionarNoticia,
    editarNoticia,
    removerNoticiaPorId,
    alterarStatusNoticia,
    buscarNoticiaPorId
  } = useNoticias()

  const { 
    campanhas, 
    carregando: carregandoCampanhas, 
    erro: erroCampanhas,
    carregarCampanhas,
    adicionarCampanha,
    editarCampanha,
    removerCampanha,
    alterarStatusCampanha,
    buscarCampanhaPorId
  } = useCampanhas()

  // Estados unificados
  const carregando = computed(() => carregandoNoticias.value || carregandoCampanhas.value)
  const erro = computed(() => erroNoticias.value || erroCampanhas.value)

  const todosItens = computed(() => {
    const itens = [...noticias.value, ...campanhas.value]
    return itens.sort((a, b) => new Date(b.dataPublicacao || 0) - new Date(a.dataPublicacao || 0))
  })

  const carregarTodos = async () => {
    await Promise.all([
      carregarNoticias(),
      carregarCampanhas()
    ])
  }

  const adicionarItem = async (itemForm) => {
    if (itemForm.tipo === 'campanha') {
      return await adicionarCampanha(itemForm)
    } else {
      return await adicionarNoticia(itemForm)
    }
  }

  const editarItem = async (id, itemForm) => {
    if (itemForm.tipo === 'campanha') {
      return await editarCampanha(id, itemForm)
    } else {
      return await editarNoticia(id, itemForm)
    }
  }

  const removerItem = async (id, tipo) => {
    if (tipo === 'campanha') {
      return await removerCampanha(id)
    } else {
      return await removerNoticiaPorId(id)
    }
  }

  // 🔥 FUNÇÃO CORRIGIDA - SEM LOGS CONFUSOS
  const buscarItemPorId = async (id) => {
    try {
      console.log('🔍 Buscando item por ID:', id)
      
      // 1. Primeiro verifica se já está carregado na memória
      const itemNaMemoria = todosItens.value.find(item => item.id == id)
      if (itemNaMemoria) {
        console.log('✅ Item encontrado na memória:', itemNaMemoria.tipo)
        return itemNaMemoria
      }

      // 2. Se não encontrou, carrega todos os dados
      console.log('📡 Carregando todos os dados...')
      await carregarTodos()
      
      // 3. Verifica novamente após carregar
      const itemCarregado = todosItens.value.find(item => item.id == id)
      if (itemCarregado) {
        console.log('✅ Item encontrado após carregamento:', itemCarregado.tipo)
        return itemCarregado
      }

      // 4. Se ainda não encontrou, tenta buscar individualmente
      console.log('🔍 Tentando buscar como notícia...')
      let item = await buscarNoticiaPorId(id)
      if (item) {
        console.log('✅ Encontrado como notícia')
        return item
      }

      console.log('🔍 Tentando buscar como campanha...')
      item = await buscarCampanhaPorId(id)
      if (item) {
        console.log('✅ Encontrado como campanha')
        return item
      }

      console.log('❌ Item não encontrado')
      return null
      
    } catch (error) {
      console.error('❌ Erro ao buscar item:', error)
      return null
    }
  }

  const alterarStatus = async (id, novoStatus, tipo) => {
    if (tipo === 'campanha') {
      return await alterarStatusCampanha(id, novoStatus)
    } else {
      return await alterarStatusNoticia(id, novoStatus)
    }
  }

  const limparErro = () => {
    // Função vazia - pode implementar lógica se necessário
  }

  return {
    todosItens,
    noticias,
    campanhas,
    carregando,
    erro,

    carregarTodos,
    adicionarItem,
    editarItem,
    removerItem,
    buscarItemPorId,
    alterarStatus,
    limparErro,

    carregarNoticias,
    carregarCampanhas,
    adicionarNoticia,
    adicionarCampanha,
    editarNoticia,
    editarCampanha,
    removerNoticiaPorId,
    removerCampanha,
    buscarNoticiaPorId,
    buscarCampanhaPorId
  }
}