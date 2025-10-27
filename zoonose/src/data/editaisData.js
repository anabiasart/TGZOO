import { ref } from 'vue'

const API_BASE = 'http://localhost:8080/api'
const API_NEWS = `${API_BASE}/news`
const API_CAMPAIGNS = `${API_BASE}/campaigns`

export function useEditais() {
  const todosItens = ref([])
  const carregando = ref(false)
  const erro = ref(null)

  async function carregarTodos() {
    carregando.value = true
    erro.value = null

    try {
      // 🔹 Carrega notícias e campanhas em paralelo
      const [respNoticias, respCampanhas] = await Promise.all([
        fetch(API_NEWS),
        fetch(API_CAMPAIGNS)
      ])

      if (!respNoticias.ok || !respCampanhas.ok) {
        throw new Error('Falha ao carregar notícias ou campanhas')
      }

      const dadosNoticias = await respNoticias.json()
      const dadosCampanhas = await respCampanhas.json()

      // 🔹 Garante que o conteúdo é um array
      const noticias = Array.isArray(dadosNoticias.content)
        ? dadosNoticias.content.map(n => ({
            ...n,
            tipo: 'noticia',
            titulo: n.title || n.nomeNoticia || 'Notícia sem título',
            resumo: n.content || n.resumo || '',
            dataPublicacao: n.createdAt || n.dataPublicacao,
            imagem: n.imageUrl || n.urlImagemNoticia || ''
          }))
        : []

      const campanhas = Array.isArray(dadosCampanhas.content)
        ? dadosCampanhas.content.map(c => ({
            ...c,
            tipo: 'campanha',
            titulo: c.name || c.titulo || 'Campanha sem título',
            resumo: `${c.startDateTime || ''} até ${c.endDateTime || ''}`,
            dataPublicacao: c.createdAt || c.dataPublicacao,
            imagem: c.imageUrl || ''
          }))
        : []

      // 🔹 Une e ordena por data de publicação
      todosItens.value = [...noticias, ...campanhas].sort((a, b) => {
        const dataA = new Date(a.dataPublicacao || 0)
        const dataB = new Date(b.dataPublicacao || 0)
        return dataB - dataA
      })

      console.log('✅ Editais carregados:', todosItens.value)

    } catch (e) {
      console.error('❌ Erro ao carregar editais:', e)
      erro.value = e
    } finally {
      carregando.value = false
    }
  }

  return { todosItens, carregando, erro, carregarTodos }
}
