import { ref } from "vue"

const STORAGE_KEY = "noticias"

const initialData = [
  {
    id: 1,
    titulo: "Campanha de Vacinação Gratuita",
    resumo: "Todos os pets cadastrados poderão receber vacinas gratuitamente.",
    detalhes: {
      data: "20/08/2025 a 30/08/2025",
      horario: "08h às 17h",
      local: "Centro Veterinário Municipal",
      publico: "Pets previamente cadastrados",
      contato: "(11) 99999-0000"
    }
  }
]

const noticias = ref([])

function carregarNoticias() {
  const salvas = localStorage.getItem(STORAGE_KEY)
  if (salvas) {
    noticias.value = JSON.parse(salvas)
  } else {
    noticias.value = [...initialData]
    salvarNoticias()
  }
  return noticias.value
}

function salvarNoticias() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(noticias.value))
}
function adicionarNoticia(nova) {
  const maiorId = noticias.value.reduce((max, n) => n.id > max ? n.id : max, 0)
  const novaComId = {
    ...nova,
    id: maiorId + 1
  }
  noticias.value.push(novaComId)
  salvarNoticias()
}

function removerNoticiaPorId(id) {
  noticias.value = noticias.value.filter(n => n.id !== id)
  salvarNoticias()
}
export function useNoticias() {
  return {
    noticias,
    carregarNoticias,
    salvarNoticias,
    adicionarNoticia,
    removerNoticiaPorId
  }
}
