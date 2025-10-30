<template>
  <div class="adocao-admin">
    <header class="admin-header">
      <h2>Gerenciar Adoções 🐾</h2>
      <button class="btn" @click="abrirModal()">+ Novo Animal</button>
    </header>

    <main v-if="!carregando">
      <div v-if="animais.length" class="lista-animais">
        <article v-for="a in animais" :key="a.id" class="animal-card">
          <img :src="a.imageUrl || placeholder" alt="foto animal" />
          <div class="info">
            <h3>{{ a.name }}</h3>
            <p>{{ a.description || 'Sem descrição.' }}</p>
            <small>{{ traduz(a.species) }} • {{ traduz(a.size) }} • {{ traduz(a.gender) }}</small>
            <div class="acoes">
              <button class="btn edit" @click="editarAnimal(a)">✏️ Editar</button>
              <button class="btn del" @click="removerAnimal(a.id)">🗑️ Excluir</button>
            </div>
          </div>
        </article>
      </div>
      <div v-else class="vazio">Nenhum animal cadastrado.</div>
    </main>

    <!-- Modal -->
    <div v-if="mostrarModal" class="modal-overlay" @click.self="fecharModal">
      <div class="modal">
        <h3>{{ editando ? 'Editar Animal' : 'Novo Animal' }}</h3>

        <form @submit.prevent="salvarAnimal">
          <label>Nome:
            <input v-model="form.name" required />
          </label>

          <label>Espécie:
            <select v-model="form.species" required>
              <option value="">Selecione</option>
              <option value="CANINE">Cachorro</option>
              <option value="FELINE">Gato</option>
            </select>
          </label>

          <label>Porte:
            <select v-model="form.size" required>
              <option value="">Selecione</option>
              <option value="SMALL">Pequeno</option>
              <option value="MEDIUM">Médio</option>
              <option value="LARGE">Grande</option>
            </select>
          </label>

          <label>Gênero:
            <select v-model="form.gender" required>
              <option value="">Selecione</option>
              <option value="MALE">Macho</option>
              <option value="FEMALE">Fêmea</option>
            </select>
          </label>

          <label>Descrição:
            <textarea v-model="form.description"></textarea>
          </label>

          <label>Raça:
            <input v-model="form.breed" placeholder="SRD, Labrador..." />
          </label>

          <label>Imagem:
            <input v-model="form.imageUrl" placeholder="URL da imagem" />
          </label>

          <label>
            <input type="checkbox" v-model="form.isVaccinated" /> Vacinado
          </label>

          <label>
            <input type="checkbox" v-model="form.isNeutered" /> Castrado
          </label>

          <div class="acoes-modal">
            <button type="submit" class="btn salvar">{{ editando ? 'Salvar' : 'Cadastrar' }}</button>
            <button type="button" class="btn cancelar" @click="fecharModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const carregando = ref(false)
const animais = ref([])
const placeholder = '/src/assets/img/vete.jpg'
const mostrarModal = ref(false)
const editando = ref(false)

const form = ref({
  id: null,
  name: '',
  breed: 'SRD',
  species: '',
  size: '',
  gender: '',
  description: '',
  imageUrl: '',
  isVaccinated: false,
  isNeutered: false,
})

const getHeaders = () => {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`
  return headers
}

const traduz = (valor) => ({
  CANINE: 'Cachorro',
  FELINE: 'Gato',
  SMALL: 'Pequeno',
  MEDIUM: 'Médio',
  LARGE: 'Grande',
  MALE: 'Macho',
  FEMALE: 'Fêmea'
}[valor] || valor)

async function carregarAnimais() {
  carregando.value = true
  try {
    const res = await fetch('/api/animals?size=100&sort=createdAt,desc', { headers: getHeaders() })
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
    const data = await res.json()
    animais.value = data.content || data
  } catch (e) {
    alert('Erro ao carregar animais: ' + e.message)
  } finally {
    carregando.value = false
  }
}

function abrirModal(a = null) {
  form.value = a ? { ...a } : { ...form.value, id: null, name: '', breed: 'SRD' }
  editando.value = !!a
  mostrarModal.value = true
}
const fecharModal = () => (mostrarModal.value = false)

async function salvarAnimal() {
  try {
    const method = editando.value ? 'PUT' : 'POST'
    const url = editando.value ? `/api/animals/${form.value.id}` : '/api/animals/register'
    const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form.value) })
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
    await carregarAnimais()
    fecharModal()
  } catch (e) {
    alert('Erro ao salvar: ' + e.message)
  }
}

async function removerAnimal(id) {
  if (!confirm('Excluir este animal?')) return
  try {
    const res = await fetch(`/api/animals/${id}`, { method: 'DELETE', headers: getHeaders() })
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
    animais.value = animais.value.filter(a => a.id !== id)
  } catch (e) {
    alert('Erro ao excluir: ' + e.message)
  }
}

const editarAnimal = (a) => abrirModal(a)

onMounted(carregarAnimais)
</script>

<style scoped>
.adocao-admin {
  padding: 20px;
  background: linear-gradient(135deg, #f8fcff, #e6f7ff);
  min-height: 100vh;
}
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.lista-animais {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.animal-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}
.animal-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.animal-card .info {
  padding: 10px;
  font-size: 14px;
}
.acoes {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.btn {
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.btn.edit { background: #3b82f6; color: white; }
.btn.del { background: #ef4444; color: white; }
.btn:hover { opacity: 0.9; }
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  max-height: 90vh;
  overflow-y: auto;
}
.modal form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.modal input, .modal select, .modal textarea {
  width: 100%;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.acoes-modal {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}
.btn.salvar { background: #10b981; color: white; }
.btn.cancelar { background: #6b7280; color: white; }
.vazio {
  text-align: center;
  color: #666;
  margin-top: 40px;
}
</style>
