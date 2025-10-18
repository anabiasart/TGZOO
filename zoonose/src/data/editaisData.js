// zoonose/src/data/editaisData.js
import { ref, computed } from 'vue'
import { useNoticias } from './noticiasData.js'
import { useCampanhas } from './campanhasData.js'

export function useEditais() {
  // Usar os composables separados
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

  // Lista unificada de todos os itens (noticias + campanhas)
  const todosItens = computed(() => {
    const itens = [...noticias.value, ...campanhas.value]
    return itens.sort((a, b) => new Date(b.dataPublicacao || 0) - new Date(a.dataPublicacao || 0))
  })

  // Carregar todos os dados
  const carregarTodos = async () => {
    await Promise.all([
      carregarNoticias(),
      carregarCampanhas()
    ])
  }

  // Adicionar item (decide automaticamente entre notícia ou campanha)
  const adicionarItem = async (itemForm) => {
    if (itemForm.tipo === 'campanha') {
      return await adicionarCampanha(itemForm)
    } else {
      return await adicionarNoticia(itemForm)
    }
  }

  // Editar item (decide automaticamente entre notícia ou campanha)
  const editarItem = async (id, itemForm) => {
    if (itemForm.tipo === 'campanha') {
      return await editarCampanha(id, itemForm)
    } else {
      return await editarNoticia(id, itemForm)
    }
  }

  // Remover item (decide automaticamente entre notícia ou campanha)
  const removerItem = async (id, tipo) => {
    if (tipo === 'campanha') {
      return await removerCampanha(id)
    } else {
      return await removerNoticiaPorId(id)
    }
  }

  const buscarItemPorId = async (id) => {
  console.log('🔍 Buscando item por ID:', id)
  
  try {
    // Primeiro, verificar se o item já está carregado na memória
    const itemNaMemoria = todosItens.value.find(item => item.id == id)
    if (itemNaMemoria) {
      console.log('✅ Item encontrado na memória:', itemNaMemoria)
      return itemNaMemoria
    }

    // Se não está na memória, carregar todos os dados primeiro
    console.log('📥 Carregando todos os dados...')
    await carregarTodos()
    
    // Verificar novamente após carregar
    const itemCarregado = todosItens.value.find(item => item.id == id)
    if (itemCarregado) {
      console.log('✅ Item encontrado após carregamento:', itemCarregado)
      return itemCarregado
    }

    // Se ainda não encontrou, tentar buscar individualmente
    console.log('🔄 Tentando busca individual...')
    
    // Tenta buscar como notícia primeiro
    console.log('📝 Tentando buscar como notícia...')
    let item = await buscarNoticiaPorId(id)
    if (item) {
      console.log('✅ Encontrado como notícia:', item)
      return item
    }

    // Se não encontrou, tenta como campanha
    console.log('📢 Tentando buscar como campanha...')
    item = await buscarCampanhaPorId(id)
    if (item) {
      console.log('✅ Encontrado como campanha:', item)
      return item
    }

    console.log('❌ Item não encontrado em nenhuma API')
    return null
  } catch (error) {
    console.error('❌ Erro ao buscar item:', error)
    return null
  }
}
// Alterar status (decide automaticamente)
const alterarStatus = async (id, novoStatus, tipo) => {
  if (tipo === 'campanha') {
    return await alterarStatusCampanha(id, novoStatus)
  } else {
    return await alterarStatusNoticia(id, novoStatus)
  }
}


  // Limpar erros
  const limparErro = () => {
    // Note: você precisaria implementar limparErro nos composables individuais
    console.log('Limpando erros...')
  }

  return {
    // Dados unificados
    todosItens,
    noticias,
    campanhas,
    carregando,
    erro,

    // Funções unificadas
    carregarTodos,
    adicionarItem,
    editarItem,
    removerItem,
    buscarItemPorId,
    alterarStatus,
    limparErro,

    // Funções específicas (caso precise)
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