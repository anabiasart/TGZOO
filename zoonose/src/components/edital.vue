
import { noticiasData } from "data/noticiasData.js"

<template>
  <div class="edital-page">
    <header>
      <h1>📑 Edital nº 01/2025 – Campanhas e Informativos</h1>
      <p class="orgao">Prefeitura Municipal • Secretaria de Saúde • Centro Veterinário</p>
      <p class="data">Atualizado em: 13/08/2025</p>
    </header>

    <main>
      <div v-for="(n, i) in noticiasData" :key="i" class="card">
        <h2>{{ n.titulo }}</h2>
        <p>{{ n.resumo }}</p>

        <ul v-if="n.detalhes">
          <li><strong>Data:</strong> {{ n.detalhes.data }}</li>
          <li><strong>Horário:</strong> {{ n.detalhes.horario }}</li>
          <li><strong>Local:</strong> {{ n.detalhes.local }}</li>
          <li><strong>Público:</strong> {{ n.detalhes.publico }}</li>
          <li><strong>Contato:</strong> {{ n.detalhes.contato }}</li>
        </ul>
      </div>
    </main>

   
  </div>
</template>

<script setup>
const noticiasData = [
  {
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
</script>



<style scoped>
.edital-page {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column; 
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd); 
  min-height: 100vh;
}

/* Header */
header {
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd); 
  color: #059669;
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
  padding:16px;
  font-size: 18px;
  font-weight: bold; 
}

.card {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transform: translateY(-5px);
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
