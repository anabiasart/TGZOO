
<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { noticiasData as initialData } from "@/data/noticiasData.js" // Renomeie a importação
const STORAGE_KEY = "noticias"
const noticias = ref([]) // Use um nome diferente para a variável reativa
const noticia = ref(null)

const route = useRoute()
onMounted(() => {
  const salvas = localStorage.getItem(STORAGE_KEY)
  noticias.value = salvas ? JSON.parse(salvas) : initialData 

  console.log("Rota recebida:", route.params.id)
  console.log("Noticias carregadas:", noticias.value)

  const id = parseInt(route.params.id, 10)
  console.log("ID convertido:", id)

  if (!isNaN(id)) {
    noticia.value = noticias.value.find(item => item.id === id)
    console.log("Notícia encontrada:", noticia.value)
  } 
})

</script>

<template>
  <div class="edital-page" v-if="noticia">
    <header>
      <h1>{{ noticia.titulo }}</h1>
      <p class="orgao">Prefeitura Municipal • Secretaria de Saúde • Centro Veterinário</p>
    </header>

    <main class="conteudo">
      <ul v-if="noticia.detalhes">
        <li><strong>Data:</strong> {{ noticia.detalhes.data }}</li>
        <li><strong>Horário:</strong> {{ noticia.detalhes.horario }}</li>
        <li><strong>Local:</strong> {{ noticia.detalhes.local }}</li>
        <li><strong>Público:</strong> {{ noticia.detalhes.publico }}</li>
        <li><strong>Contato:</strong> {{ noticia.detalhes.contato }}</li>
      </ul>
    </main>
  </div>

  <p v-else>Notícia não encontrada.</p>
</template>






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
