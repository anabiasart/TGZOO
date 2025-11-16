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

  noticias.value = noticias.value.map(n => ({
    ...n,
    tipo: n.tipo || 'noticia'
  }))

  campanhas.value = campanhas.value.map(c => ({
    ...c,
    tipo: c.tipo || 'campanha'
  }))
}


  const adicionarItem = async (itemForm) => {
    if (itemForm.tipo === 'campanha') {
      const nova = await adicionarCampanha(itemForm)
      return nova
    } else {
      const nova = await adicionarNoticia(itemForm)
      return nova
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
    try {
      const item = todosItens.value.find(i => i.id === id)
      const tipoDefinido = tipo || item?.tipo

      if (!tipoDefinido) {
        return await removerNoticiaPorId(id)
      }

      if (tipoDefinido === 'campanha') {
        return await removerCampanha(id)
      } else {
        return await removerNoticiaPorId(id)
      }
    } catch (error) {
      throw error
    }
  }

  const buscarItemPorId = async (id) => {
    try {

      const itemNaMemoria = todosItens.value.find(item => item.id == id)
      if (itemNaMemoria) return itemNaMemoria

      await carregarTodos()
      const itemCarregado = todosItens.value.find(item => item.id == id)
      if (itemCarregado) return itemCarregado

      let item = await buscarNoticiaPorId(id)
      if (item) return { ...item, tipo: 'noticia' }

      item = await buscarCampanhaPorId(id)
      if (item) return { ...item, tipo: 'campanha' }

      return null
    } catch (error) {
      console.error('Erro ao buscar item unificado:', error)
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
    erro.value = null
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
