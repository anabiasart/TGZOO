<script setup>
import { ref, onMounted } from "vue"
import { useNoticias } from "@/data/noticiasData.js"

const { noticias, adicionarNoticia, removerNoticiaPorId, carregarNoticias } = useNoticias()

onMounted(() => {
  carregarNoticias()
})

const novaNoticia = ref({
  titulo: "",
  resumo: "",
  imagem: "",
  detalhes: { data: "", horario: "", local: "", publico: "", contato: "" }
})

function adicionar() {
  adicionarNoticia(novaNoticia.value)

  // resetar form
  novaNoticia.value = {
    titulo: "",
    resumo: "",
    imagem: "",
    detalhes: { data: "", horario: "", local: "", publico: "", contato: "" }
  }
}
</script>

<template>
  <div class="admin">
    <h1>⚙️ Gerenciar Notícias</h1>

    <form @submit.prevent="adicionar">
      <input v-model="novaNoticia.titulo" placeholder="Título" required />
      <textarea v-model="novaNoticia.resumo" placeholder="Resumo"></textarea>
      <input v-model="novaNoticia.imagem" placeholder="URL da Imagem" />
      <input v-model="novaNoticia.detalhes.data" placeholder="Data" />
      <input v-model="novaNoticia.detalhes.horario" placeholder="Horário" />
      <input v-model="novaNoticia.detalhes.local" placeholder="Local" />
      <input v-model="novaNoticia.detalhes.publico" placeholder="Público" />
      <input v-model="novaNoticia.detalhes.contato" placeholder="Contato" />
      <button type="submit">Adicionar</button>
    </form>

    <div v-for="n in noticias" :key="n.id" class="card">
      <h3>{{ n.titulo }}</h3>
      <p>{{ n.resumo }}</p>
      <img v-if="n.imagem" :src="n.imagem" alt="Imagem da notícia" class="preview"/>
      <router-link :to="`/edital/${n.id}`">📄 Ver edital</router-link>
      <button @click="removerNoticiaPorId(n.id)">❌ Excluir</button>
    </div>
  </div>
</template>


<style scoped>
.admin {
  font-family: Arial, sans-serif;
  padding: 30px;
  background: linear-gradient(135deg, #fef9c3, #fef08a, #fde047);
  min-height: 100vh;
}
.preview {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin: 10px 0;
}
.admin h1 {
  text-align: center;
  color: #92400e;
  font-size: 2rem;
  margin-bottom: 30px;
}
form {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  max-width: 600px;
  margin: 0 auto 40px auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
form input,
form textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
}
form button {
  background: #facc15;
  color: #111;
  font-weight: bold;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}
form button:hover {
  background: #eab308;
}
.card {
  background: white;
  padding: 15px;
  margin: 10px auto;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  max-width: 600px;
}
.card h3 {
  margin: 0 0 10px;
  color: #333;
}
.card p {
  color: #555;
  margin-bottom: 10px;
}
.card button {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}
.card button:hover {
  background: #dc2626;
}
@media (max-width: 600px) {
  .admin {
    padding: 15px;
  }
  form {
    padding: 15px;
  }
}
</style>
