<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">📅 Agenda Semanal</h1>

    <div class="grid grid-cols-7 gap-2 text-center font-semibold">
      <div v-for="dia in diasSemana" :key="dia" class="bg-gray-200 p-2 rounded">
        {{ dia }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-2 mt-2">
      <div 
        v-for="(dia, index) in diasSemana" 
        :key="index"
        class="min-h-[120px] border rounded p-2 text-left relative bg-white shadow-sm"
      >
        <p class="text-xs text-gray-500 mb-1">{{ dia }}</p>
        
        <div 
          v-for="(evento, i) in eventos.filter(e => e.dia === dia)" 
          :key="i" 
          class="bg-purple-200 text-purple-900 text-xs rounded px-2 py-1 mb-1"
        >
          {{ evento.hora }} - {{ evento.titulo }}
        </div>

        <!-- Botão para adicionar evento -->
        <button 
          class="absolute bottom-1 right-1 text-xs bg-purple-500 text-white px-2 py-1 rounded"
          @click="adicionarEvento(dia)"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

// Eventos mockados
const eventos = ref([
  { dia: "Seg", hora: "08:00", titulo: "Vacinação - Rex" },
  { dia: "Qua", hora: "14:00", titulo: "Consulta - Mia" },
  { dia: "Sex", hora: "10:00", titulo: "Castração - Bob" }
])

function adicionarEvento(dia) {
  const titulo = prompt(`Novo evento para ${dia}:`)
  if (titulo) {
    eventos.value.push({
      dia,
      hora: "00:00", // pode abrir modal para selecionar hora
      titulo
    })
  }
}
</script>

<style scoped>
/* Deixar parecido com IXC depois dá para refinar */
</style>
