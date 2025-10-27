import { ref } from 'vue'

const API_URL = "/campaigns?page=0&size=50&sort=createdAt,desc"

export function useCampanhas() {
  const campanhas = ref([])
  const carregando = ref(false)
  const erro = ref(null)

  async function carregarCampanhas() {
    carregando.value = true
    try {
      const resp = await fetch(API_URL)
      if (!resp.ok) throw new Error("Falha ao carregar campanhas")

      const dados = await resp.json()
      campanhas.value = Array.isArray(dados.content) ? dados.content : []
      console.log("📢 Campanhas carregadas:", campanhas.value)

    } catch (e) {
      console.error("Erro em carregarCampanhas:", e)
      erro.value = e
    } finally {
      carregando.value = false
    }
  }

  return { campanhas, carregando, erro, carregarCampanhas }
}
