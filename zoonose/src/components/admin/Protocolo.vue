<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">💉 Protocolos</h1>
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        @click="novoProtocolo"
      >
        ➕ Cadastrar Protocolo
      </button>
    </div>

    <!-- Busca -->
    <div class="mb-4">
      <input
        v-model="filtro"
        type="text"
        placeholder="Buscar por protocolo..."
        class="border rounded px-3 py-2 w-1/3"
      />
    </div>

    <!-- Tabela -->
    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-2">Nome</th>
            <th class="p-2">Tipo</th>
            <th class="p-2">Frequência</th>
            <th class="p-2">Espécie</th>
            <th class="p-2">Ações</th>
          </tr>
        </thead>

        <transition-group
          name="fade"
          tag="tbody"
        >
          <tr
            v-for="p in protocolosFiltrados"
            :key="p.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="p-2">{{ p.nome }}</td>
            <td class="p-2">{{ p.tipo }}</td>
            <td class="p-2">{{ p.frequencia }}</td>
            <td class="p-2">{{ p.especie }}</td>
            <td class="p-2 flex gap-2">
              <button class="text-blue-600 hover:underline" @click="editarProtocolo(p)">Editar</button>
              <button class="text-red-600 hover:underline" @click="excluirProtocolo(p)">Excluir</button>
            </td>
          </tr>

          <tr
            v-if="protocolosFiltrados.length === 0"
            key="empty"
          >
            <td colspan="5" class="p-4 text-center text-gray-500">
              Nenhum protocolo encontrado
            </td>
          </tr>
        </transition-group>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

const protocolos = ref([
  { id: 1, nome: "Antirrábica", tipo: "Vacina", frequencia: "Anual", especie: "Cachorro" },
  { id: 2, nome: "Vermífugo", tipo: "Medicamento", frequencia: "Semestral", especie: "Gato" }
])

const filtro = ref("")

const protocolosFiltrados = computed(() =>
  protocolos.value.filter(p => p.nome.toLowerCase().includes(filtro.value.toLowerCase()))
)

function novoProtocolo() {
  alert("Abrir modal para novo protocolo")
}
function editarProtocolo(p) {
  alert("Editar protocolo: " + p.nome)
}
function excluirProtocolo(p) {
  if (confirm(`Excluir ${p.nome}?`)) {
    protocolos.value = protocolos.value.filter(x => x.id !== p.id)
  }
}
</script>

<style>
/* Transição simples */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
