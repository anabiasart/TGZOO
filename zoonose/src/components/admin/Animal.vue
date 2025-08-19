<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">🐾 Animais</h1>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" @click="novoAnimal">
        ➕ Cadastrar Animal
      </button>
    </div>

    <!-- Busca -->
    <div class="flex gap-2 mb-4">
      <input
        v-model="filtro"
        type="text"
        placeholder="Buscar por nome ou tutor..."
        class="border rounded px-3 py-2 w-1/3"
      />
      <select v-model="filtroEspecie" class="border rounded px-3 py-2">
        <option value="">Todas espécies</option>
        <option v-for="e in especies" :key="e">{{ e }}</option>
      </select>
    </div>

    <!-- Tabela -->
    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-2">Nome</th>
            <th class="p-2">Tutor</th>
            <th class="p-2">Espécie</th>
            <th class="p-2">Raça</th>
            <th class="p-2">Idade</th>
            <th class="p-2">Sexo</th>
            <th class="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="animal in animaisFiltrados" :key="animal.id" class="border-b hover:bg-gray-50">
            <td class="p-2">{{ animal.nome }}</td>
            <td class="p-2">{{ animal.tutor }}</td>
            <td class="p-2">{{ animal.especie }}</td>
            <td class="p-2">{{ animal.raca }}</td>
            <td class="p-2">{{ animal.idade }} anos</td>
            <td class="p-2">{{ animal.sexo }}</td>
            <td class="p-2 flex gap-2">
              <button class="text-blue-600 hover:underline" @click="editarAnimal(animal)">Editar</button>
              <button class="text-red-600 hover:underline" @click="excluirAnimal(animal)">Excluir</button>
              <button class="text-green-600 hover:underline" @click="abrirHistorico(animal)">Histórico</button>
            </td>
          </tr>
          <tr v-if="animaisFiltrados.length === 0">
            <td colspan="7" class="p-4 text-center text-gray-500">Nenhum animal encontrado</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

// Mock de animais
const animais = ref([
  { id: 1, nome: "Rex", tutor: "João", especie: "Cachorro", raca: "Labrador", idade: 5, sexo: "M" },
  { id: 2, nome: "Mia", tutor: "Maria", especie: "Gato", raca: "Siames", idade: 3, sexo: "F" },
  { id: 3, nome: "Bob", tutor: "Carlos", especie: "Cachorro", raca: "Poodle", idade: 2, sexo: "M" }
])

const especies = ["Cachorro", "Gato", "Ave"]

const filtro = ref("")
const filtroEspecie = ref("")

// Computed para filtrar lista
const animaisFiltrados = computed(() => {
  return animais.value.filter(a => {
    const busca = filtro.value.toLowerCase()
    const especieOk = !filtroEspecie.value || a.especie === filtroEspecie.value
    return (
      especieOk &&
      (a.nome.toLowerCase().includes(busca) || a.tutor.toLowerCase().includes(busca))
    )
  })
})

// Funções mockadas
function novoAnimal() {
  alert("Abrir modal/cadastro de novo animal")
}

function editarAnimal(animal) {
  alert("Editar animal: " + animal.nome)
}

function excluirAnimal(animal) {
  if (confirm(`Excluir ${animal.nome}?`)) {
    animais.value = animais.value.filter(a => a.id !== animal.id)
  }
}

function abrirHistorico(animal) {
  alert("Abrir histórico de atendimentos de " + animal.nome)
}
</script>
