<template>
  <div class="container">
    <h1>Gerenciamento de Usuários</h1>

    <form @submit.prevent="salvarUsuario">
      <input v-model="form.nome" placeholder="Nome" required />
      <input v-model="form.email" placeholder="Email" required />
      
      <select v-model="form.tipo">
        <option value="usuario">Usuário</option>
        <option value="admin">Administrador</option>
      </select>

      <button type="submit">{{ editando ? "Atualizar" : "Adicionar" }}</button>
      <button v-if="editando" type="button" @click="cancelarEdicao">Cancelar</button>
    </form>

    <hr />

    <table border="1" cellpadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Email</th>
          <th>Tipo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in usuarios" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.nome }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.tipo }}</td>
          <td>
            <button @click="editarUsuario(u)">Editar</button>
            <button @click="excluirUsuario(u.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

const usuarios = ref([])
const editando = ref(false)
const form = ref({
  id: null,
  nome: "",
  email: "",
  tipo: "usuario"
})

const API_URL = "http://localhost:3000/usuarios" // ajuste para sua API

async function carregarUsuarios() {
  const res = await axios.get(API_URL)
  usuarios.value = res.data
}

async function salvarUsuario() {
  if (editando.value) {
    await axios.put(`${API_URL}/${form.value.id}`, form.value)
  } else {
    await axios.post(API_URL, form.value)
  }
  await carregarUsuarios()
  cancelarEdicao()
}

function editarUsuario(u) {
  form.value = { ...u }
  editando.value = true
}

function cancelarEdicao() {
  form.value = { id: null, nome: "", email: "", tipo: "usuario" }
  editando.value = false
}

async function excluirUsuario(id) {
  if (confirm("Tem certeza que deseja excluir este usuário?")) {
    await axios.delete(`${API_URL}/${id}`)
    await carregarUsuarios()
  }
}

onMounted(carregarUsuarios)
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}
form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
</style>
