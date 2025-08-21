
import { noticiasData } from "data/noticiasData.js"

<template>
  <div class="edital-page">
    <header>
      <h1>📢 Últimas Notícias & Editais</h1>
      <p class="data">Atualizado em: 13/08/2025</p>
    </header>

    <main>
      <div v-for="(n, i) in noticiasData" :key="i" class="card">
        <h2>{{ n.titulo }}</h2>
        <p>{{ n.resumo }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>

 const noticiasData = [
  {
    titulo: "Campanha de Vacinação Gratuita",
    resumo: "A partir do dia 20 de agosto, todos os pets cadastrados poderão receber vacinas gratuitamente no centro veterinário municipal."
  },
  {
    titulo: "Mutirão de Adoção",
    resumo: "No dia 25 de agosto teremos um evento especial para adoção de cães e gatos. Traga sua família e venha conhecer nossos amiguinhos."
  },
  {
    titulo: "Novos Horários de Atendimento",
    resumo: "A partir de setembro, nosso atendimento será ampliado para os sábados, das 8h às 12h."
  }
]
</script>


<style scoped>
.edital-page {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f6fa;
  min-height: 100vh;
}

/* Header */
header {
  background-color: #5c906e;
  color: white;
  padding: 20px;
  text-align: center;
  border-radius: 0 0 50px 50px;
}

header h1 {
  margin: 0;
  font-size: 2em;
}

.data {
  font-size: 0.9em;
  opacity: 0.9;
}

/* Main */
main {
  display: grid;
  gap: 20px;
  max-width: 900px;
  margin: 30px auto;
  padding: 0 15px;
  font-size: 18px;
}

.card {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.card h2 {
  margin-top: 0;
  color: #333;
}

.card p {
  color: #555;
}

/* Responsivo */
@media (max-width: 600px) {
  .card {
    padding: 15px;
  }
}
</style>
