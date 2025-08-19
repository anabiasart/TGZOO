<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">🩺 Atendimentos</h1>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" @click="novoAtendimento">
        ➕ Novo Atendimento
      </button>
    </div>

    <!-- Busca -->
    <div class="flex gap-2 mb-4">
      <input
        v-model="filtro"
        type="text"
        placeholder="Buscar por animal ou tutor..."
        class="border rounded px-3 py-2 w-1/3"
      />
      <select v-model="filtroStatus" class="border rounded px-3 py-2">
        <option value="">Todos status</option>
        <option value="Agendado">Agendado</option>
        <option value="Concluído">Concluído</option>
        <option value="Cancelado">Cancelado</option>
      </select>
    </div>

    <!-- Tabela -->
    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-2">Data</th>
            <th class="p-2">Animal</th>
            <th class="p-2">Tutor</th>
            <th class="p-2">Tipo</th>
            <th class="p-2">Veterinário</th>
            <th class="p-2">Status</th>
            <th class="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in atendimentosFiltrados" :key="a.id" class="border-b hover:bg-gray-50">
            <td class="p-2">{{ a.data }}</td>
            <td class="p-2">{{ a.animal }}</td>
            <td class="p-2">{{ a.tutor }}</td>
            <td class="p-2">{{ a.tipo }}</td>
            <td class="p-2">{{ a.veterinario }}</td>
            <td class="p-2">{{ a.status }}</td>
            <td class="p-2 flex gap-2">
              <button class="text-blue-600 hover:underline" @click="editarAtendimento(a)">Editar</button>
              <button class="text-red-600 hover:underline" @click="excluirAtendimento(a)">Excluir</button>
              <button class="text-green-600 hover:underline" @click="verDetalhes(a)">Detalhes</button>
            </td>
          </tr>
          <tr v-if="atendimentosFiltrados.length === 0">
            <td colspan="7" class="p-4 text-center text-gray-500">Nenhum atendimento encontrado</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

const atendimentos = ref([
  { id: 1, data: "18/08/2025", animal: "Rex", tutor: "João", tipo: "Vacinação", veterinario: "Dr. Silva", status: "Concluído" },
  { id: 2, data: "20/08/2025", animal: "Mia", tutor: "Maria", tipo: "Consulta", veterinario: "Dra. Ana", status: "Agendado" }
])

const filtro = ref("")
const filtroStatus = ref("")

const atendimentosFiltrados = computed(() =>
  atendimentos.value.filter(a => {
    const busca = filtro.value.toLowerCase()
    const statusOk = !filtroStatus.value || a.status === filtroStatus.value
    return (
      statusOk &&
      (a.animal.toLowerCase().includes(busca) || a.tutor.toLowerCase().includes(busca))
    )
  })
)

function novoAtendimento() {
  alert("Abrir modal para novo atendimento")
}
function editarAtendimento(a) {
  alert("Editar atendimento de " + a.animal)
}
function excluirAtendimento(a) {
  if (confirm(`Excluir atendimento de ${a.animal}?`)) {
    atendimentos.value = atendimentos.value.filter(x => x.id !== a.id)
  }
}
function verDetalhes(a) {
  alert("Abrir detalhes do atendimento de " + a.animal)
}
</script>
