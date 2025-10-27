import { ref } from 'vue'

const API_URL = "/news?page=0&size=50&sort=createdAt,desc"

export function useNoticias() {
  const noticias = ref([])
  const carregando = ref(false)
  const erro = ref(null)

  async function carregarNoticias() {
    carregando.value = true
    try {
      const resp = await fetch(API_URL)
      if (!resp.ok) throw new Error("Falha ao carregar notícias")

      const dados = await resp.json()
      noticias.value = Array.isArray(dados.content) ? dados.content : []
      console.log("📰 Notícias carregadas:", noticias.value)

    } catch (e) {
      console.error("Erro em carregarNoticias:", e)
      erro.value = e
    } finally {
      carregando.value = false
    }
  }

  return { noticias, carregando, erro, carregarNoticias }
}
