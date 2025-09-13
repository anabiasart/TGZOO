// src/data/noticiasData.js

import { ref, onMounted } from "vue"

export const noticiasSeed = [
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
  },
  {
    id: 2,
    titulo: "Mutirão de Adoção",
    resumo: "Evento especial para adoção de cães e gatos.",
    detalhes: {
      data: "25/08/2025",
      horario: "09h às 16h",
      local: "Praça Central",
      publico: "Aberto à comunidade",
      contato: "(11) 98888-1111"
    }
  },
  {
    id: 3,
    titulo: "Novos Horários de Atendimento",
    resumo: "Atendimento ampliado para os sábados.",
    detalhes: {
      data: "A partir de 01/09/2025",
      horario: "Sábados, das 08h às 12h",
      local: "Centro Veterinário Municipal",
      publico: "População em geral",
      contato: "(11) 97777-2222"
    }
  },
  {
    id: 4,
    titulo: "SEJA UM VOLUNTÁRIO - Ajude a comunidade!",
    resumo: "Se torne parte da nossa causa.",
    detalhes: {
      data: "A partir de 01/09/2025",
      horario: "Sábados, das 08h às 12h",
      local: "Centro Veterinário Municipal",
      publico: "População em geral",
      contato: "(11) 97777-2222"
    }
  }
]

export const noticiasData = noticiasSeed 


const STORAGE_KEY = "noticias"
const noticias = ref([])

function carregarNoticias() {
  const salvas = localStorage.getItem(STORAGE_KEY)
  if (salvas) {
    noticias.value = JSON.parse(salvas)
  } else {
    noticias.value = [...noticiasSeed]
    salvarNoticias()
  }
}

function salvarNoticias() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(noticias.value))
}

function adicionarNoticia(nova) {
  const novaComId = {
    ...nova,
    id: noticias.value.length ? noticias.value[noticias.value.length - 1].id + 1 : 1
  }
  noticias.value.push(novaComId)
  salvarNoticias()
}

function removerNoticia(index) {
  noticias.value.splice(index, 1)
  salvarNoticias()
}


export function useNoticias() {
  return {
    noticias,
    carregarNoticias,
    salvarNoticias,
    adicionarNoticia,
    removerNoticia
  }
}
