<template>
  <div class="p-4">
    <!-- Cabeçalho -->

    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <button @click="voltar" class="px-2 py-1 border rounded">⬅</button>
        <button @click="avancar" class="px-2 py-1 border rounded">➡</button>
        <h2 class="font-semibold text-lg">
          {{ tituloPeriodo }}
        </h2>
      </div>
      <div class="flex gap-2">
        <button 
          @click="modo='semana'" 
          :class="['px-3 py-1 rounded', modo==='semana' ? 'bg-blue-600 text-white' : 'bg-gray-100']">
          Semana
        </button>
        <button 
          @click="modo='mes'" 
          :class="['px-3 py-1 rounded', modo==='mes' ? 'bg-blue-600 text-white' : 'bg-gray-100']">
          Mês
        </button>
      </div>
    </div>

    <!-- SEMANA -->
    <div v-if="modo==='semana'" class="grid grid-cols-[60px_1fr] border">
      <!-- horas -->
      <div class="flex flex-col border-r text-xs">
        <div v-for="h in horas" :key="h" class="h-12 flex items-start justify-end pr-1 text-gray-500">
          {{ h }}
        </div>
      </div>

      <!-- dias -->
      <div class="grid grid-cols-7 border-l">
        <div v-for="dia in diasDaSemanaAtual" :key="dia.toDateString()" class="border-l">
          <!-- cabeçalho -->
          <div class="text-center border-b py-1 bg-gray-100 text-sm font-medium">
            {{ dia.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }) }}
          </div>

          <!-- grade -->
          <div>
            <div v-for="h in horas" :key="h" class="h-12 border-b relative" 
                 @dblclick="abrirModal({ data: dia, hora: h })">
              <!-- eventos -->
              <div 
                v-for="(evento,i) in eventos.filter(e => e.data.toDateString()===dia.toDateString() && e.hora===h)" 
                :key="i"
                class="absolute left-1 right-1 top-1 bg-blue-100 border border-blue-400 text-blue-900 text-xs rounded px-1 py-0.5 cursor-pointer"
                @click.stop="abrirModal(evento)"
              >
                {{ evento.titulo }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MÊS -->
    <div v-else class="grid grid-cols-7 border">
      <!-- cabeçalho -->
      <div v-for="d in diasSemana" :key="d" class="text-center border-b py-1 bg-gray-100 font-medium text-sm">
        {{ d }}
      </div>

      <!-- dias -->
      <div v-for="dia in diasDoMes" :key="dia.toDateString()" class="h-24 border p-1 text-xs relative cursor-pointer"
           @dblclick="abrirModal({ data: dia, hora: '08:00' })">
        <div class="font-medium text-gray-600">{{ dia.getDate() }}</div>
        <div v-for="(evento,i) in eventos.filter(e => e.data.toDateString()===dia.toDateString())" 
             :key="i"
             class="bg-green-100 text-green-800 px-1 rounded mb-1 truncate cursor-pointer"
             @click.stop="abrirModal(evento)">
          {{ evento.hora }} - {{ evento.titulo }}
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="modalAberto" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div class="bg-white rounded-lg p-4 w-80 shadow-lg">
        <h3 class="text-lg font-semibold mb-3">
          {{ eventoEditando.id ? 'Editar evento' : 'Novo evento' }}
        </h3>

        <label class="block mb-2 text-sm">Título</label>
        <input v-model="eventoEditando.titulo" class="w-full border rounded px-2 py-1 mb-3" />

        <label class="block mb-2 text-sm">Hora</label>
        <input type="time" v-model="eventoEditando.hora" class="w-full border rounded px-2 py-1 mb-3" />

        <div class="flex justify-end gap-2">
          <button class="px-3 py-1 bg-gray-200 rounded" @click="fecharModal">Cancelar</button>
          <button v-if="eventoEditando.id" class="px-3 py-1 bg-red-500 text-white rounded" @click="excluirEvento">Excluir</button>
          <button class="px-3 py-1 bg-blue-600 text-white rounded" @click="salvarEvento">Salvar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { addDays, startOfWeek, addWeeks, addMonths, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"





const modo = ref("semana")
const dataAtual = ref(new Date())
const modalAberto = ref(false)
const eventoEditando = ref({})

const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
const horas = Array.from({ length: 12 }, (_, i) => `${(i+8).toString().padStart(2,'0')}:00`)

const eventos = ref([
  { id: 1, data: new Date(2025, 7, 18), hora: "08:00", titulo: "Vacinação - Rex" },
  { id: 2, data: new Date(2025, 7, 20), hora: "14:00", titulo: "Consulta - Mia" },
  { id: 3, data: new Date(2025, 7, 22), hora: "10:00", titulo: "Castração - Bob" }
])

// Semana
const diasDaSemanaAtual = computed(() => {
  const inicio = startOfWeek(dataAtual.value, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) => addDays(inicio, i))
})

// Mês
const diasDoMes = computed(() => {
  const inicio = startOfMonth(dataAtual.value)
  const fim = endOfMonth(dataAtual.value)
  return eachDayOfInterval({ start: inicio, end: fim })
})

const tituloPeriodo = computed(() => {
  if (modo.value === "semana") {
    const inicio = diasDaSemanaAtual.value[0]
    const fim = diasDaSemanaAtual.value[6]
    return `${inicio.toLocaleDateString('pt-BR')} - ${fim.toLocaleDateString('pt-BR')}`
  } else {
    return dataAtual.value.toLocaleDateString('pt-BR', { month: "long", year: "numeric" })
  }
})

// Navegação
function avancar() {
  if (modo.value === "semana") dataAtual.value = addWeeks(dataAtual.value, 1)
  else dataAtual.value = addMonths(dataAtual.value, 1)
}
function voltar() {
  if (modo.value === "semana") dataAtual.value = addWeeks(dataAtual.value, -1)
  else dataAtual.value = addMonths(dataAtual.value, -1)
}

// CRUD
function abrirModal(eventoOuNovo) {
  if (eventoOuNovo.id) {
    eventoEditando.value = { ...eventoOuNovo } // cópia
  } else {
    eventoEditando.value = {
      id: null,
      data: eventoOuNovo.data,
      hora: eventoOuNovo.hora,
      titulo: ""
    }
  }
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
  eventoEditando.value = {}
}

function salvarEvento() {
  if (eventoEditando.value.id) {
    // editar
    const idx = eventos.value.findIndex(e => e.id === eventoEditando.value.id)
    if (idx > -1) eventos.value[idx] = { ...eventoEditando.value }
  } else {
    // novo
    eventoEditando.value.id = Date.now()
    eventos.value.push({ ...eventoEditando.value })
  }
  fecharModal()
}

function excluirEvento() {
  eventos.value = eventos.value.filter(e => e.id !== eventoEditando.value.id)
  fecharModal()
}
</script>
