<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">🐕 Espécies</h1>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" @click="novaEspecie">
        ➕ Cadastrar Espécie
      </button>
    </div>

    <!-- Busca -->
    <div class="mb-4">
      <input
        v-model="filtro"
        type="text"
        placeholder="Buscar por espécie..."
        class="border rounded px-3 py-2 w-1/3"
      />
    </div>

    <!-- Tabela -->
    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-2">Espécie</th>
            <th class="p-2">Descrição</th>
            <th class="p-2">Qtd Animais</th>
            <th class="p-2">Ações</th>
          </tr>
        </thead>
          <transition-group
          name="fade"
          tag="tbody"
        >


          <tr v-for="e in especiesFiltradas" :key="e.id" class="border-b hover:bg-gray-50">
            <td class="p-2">{{ e.nome }}</td>
            <td class="p-2">{{ e.descricao }}</td>
            <td class="p-2">{{ e.qtdAnimais }}</td>
            <td class="p-2 flex gap-2">
              <button class="text-blue-600 hover:underline" @click="editarEspecie(e)">Editar</button>
              <button class="text-red-600 hover:underline" @click="excluirEspecie(e)">Excluir</button>
            </td>
          </tr>
          <tr v-if="especiesFiltradas.length === 0">
            <td colspan="4" class="p-4 text-center text-gray-500">Nenhuma espécie encontrada</td>
          </tr>
          </transition-group>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

const especies = ref([
  { id: 1, nome: "Cachorro", descricao: "Caninos domésticos", qtdAnimais: 15 },
  { id: 2, nome: "Gato", descricao: "Felinos domésticos", qtdAnimais: 10 },
  { id: 3, nome: "Ave", descricao: "Diversas aves", qtdAnimais: 6 }
])

const filtro = ref("")

const especiesFiltradas = computed(() =>
  especies.value.filter(e => e.nome.toLowerCase().includes(filtro.value.toLowerCase()))
)

function novaEspecie() {
  alert("Abrir modal para nova espécie")
}
function editarEspecie(e) {
  alert("Editar espécie: " + e.nome)
}
function excluirEspecie(e) {
  if (confirm(`Excluir ${e.nome}?`)) {
    especies.value = especies.value.filter(s => s.id !== e.id)
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
