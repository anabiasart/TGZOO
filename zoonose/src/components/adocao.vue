<template>
  <div class="adocao-page">
    <section class="adoption-list">
      <header class="controls">
        <h2>Animais disponíveis para adoção</h2>
        <div class="search-area">
          <input v-model="q" placeholder="Buscar por nome, tipo..." />
          <select v-model="filterType">
            <option value="">Todos</option>
            <option value="Cachorro">Cachorro</option>
            <option value="Gato">Gato</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
      </header>

      <main class="grid">
        <article
          v-for="animal in filteredAnimals"
          :key="animal.id"
          class="card"
        >
          <div class="thumb" @click="openModal(animal)">
            <img :src="animal.imageUrl || placeholder" :alt="`Foto de ${animal.name}`" />
          </div>
          <div class="info">
            <h3>
              {{ animal.name }}
              <span class="badge">{{ traduzirEspecie(animal.species) }}</span>
            </h3>
            <p class="meta">{{ traduzirPorte(animal.size) }} • {{ traduzirGenero(animal.gender) }}</p>
            <p class="desc">{{ truncate(animal.description, 100) }}</p>
            <div class="actions">
<button class="btn primary" @click="openModal(animal)">
  Ver detalhes
</button>             
<button class="btn" @click="openConfirm(animal)">
  Quero adotar
</button>            </div>
          </div>
        </article>

        <div v-if="filteredAnimals.length === 0" class="empty">
          Nenhum animal encontrado.
        </div>
      </main>

      <!--  Detalhes animal -->
<div v-if="selected" class="modal-overlay" @click.self="closeModal">
  <div class="modal">
    <button class="close" @click="closeModal">×</button>

    <div class="modal-body">
      <img :src="selected.imageUrl || placeholder" :alt="selected.name" />

      <div class="detail">
        <h3>
          {{ selected.name }}
          <small>({{ traduzirEspecie(selected.species) }})</small>
        </h3>

        <p class="meta">
          {{ traduzirPorte(selected.size) }} • {{ traduzirGenero(selected.gender) }}
        </p>

        <p class="desc">{{ selected.description }}</p>

        <div class="modal-actions">
          <button class="btn primary" @click="openConfirm(selected)">
            Enviar pedido de adoção
          </button>

          <button class="btn" @click="closeModal">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Modal de Confirmação para adotar -->
<div v-if="showConfirm" class="confirm-overlay" @click.self="closeConfirm">
  <div class="confirm-box">
    <h3>Confirmar adoção</h3>

    <p>
      Deseja realmente enviar um pedido de adoção para 
      <strong>{{ animalToConfirm?.name }}</strong>?
    </p>

    <div class="confirm-actions">
      <button class="btn primary" @click="sendAdoption">Confirmar</button>
      <button class="btn" @click="closeConfirm">Cancelar</button>
    </div>
  </div>
</div>

    </section>
    <!-- Toast-->
<div v-if="showToast" class="toast">
  {{ toastMessage }}
</div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
const showToast = ref(false)
const toastMessage = ref('')
const q = ref('')
const filterType = ref('')
const selected = ref(null)
const animais = ref([])
const placeholder = '/src/assets/img/vete.jpg'

function toast(msg) {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000) 
}

const showConfirm = ref(false)
const animalToConfirm = ref(null)

function openConfirm(a) {
  animalToConfirm.value = a
  showConfirm.value = true
}

function closeConfirm() {
  showConfirm.value = false
  animalToConfirm.value = null
}

function sendAdoption() {
  toast(`Pedido de adoção enviado com sucesso para ${animalToConfirm.value.name}!`)
  closeConfirm()
  closeModal()
}

function traduzirEspecie(v) {
  const mapa = { CANINE: 'Cachorro', FELINE: 'Gato' }
  return mapa[v] || 'Outros'
}
function traduzirPorte(v) {
  const mapa = { SMALL: 'Pequeno', MEDIUM: 'Médio', LARGE: 'Grande' }
  return mapa[v] || 'Desconhecido'
}
function traduzirGenero(v) {
  const mapa = { MALE: 'Macho', FEMALE: 'Fêmea' }
  return mapa[v] || 'Indefinido'
}

// carregar animais do backend
async function carregarAnimais() {
  try {
    const res = await fetch('/api/animals/adocao', { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
    const data = await res.json()
    animais.value = data.content || data
  } catch (err) {
    console.error('Erro ao carregar animais:', err)
  }
}

onMounted(carregarAnimais)

const filteredAnimals = computed(() => {
  const term = q.value.trim().toLowerCase()
  return animais.value.filter(a => {
    const matchesQuery = !term || [a.name, a.description, traduzirEspecie(a.species)].join(' ').toLowerCase().includes(term)
    const matchesType = !filterType.value || traduzirEspecie(a.species) === filterType.value
    return matchesQuery && matchesType
  })
})

function truncate(text, n) {
  if (!text) return ''
  return text.length > n ? text.slice(0, n) + '...' : text
}

function openModal(animal) {
  selected.value = animal
}
function closeModal() {
  selected.value = null
}


</script>

<style scoped>
.adocao-page {
  background: linear-gradient(135deg, #effff7, #cffaff, #93c5fd);
  display: flex;
  min-height: 100vh;
}
.adoption-list {
  max-width: 1100px;
  margin: auto;
  padding: 0 10px;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto;
}
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}
.controls h2 {
  margin: 0;
  background: linear-gradient(135deg, #b0d5ff, #cffaff, #93c5fd);
  border-radius: 12px;
  padding: 6px 12px;
}
.search-area {
  display: flex;
  gap: 8px;
}
.search-area input {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #26cdf7;
  min-width: 160px;
}
.search-area select {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #26cdf7;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 18px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
.thumb {
  height: 200px;
  overflow: hidden;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumb:hover img {
  transform: scale(1.05);
}
.info {
  padding: 10px 14px;
  font-size: 14px;
}
.info h3 {
  margin: 0 0 6px;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.badge {
  background: #d6d6d6;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}
.meta {
  color: #555;
  font-size: 13px;
  margin-bottom: 6px;
}
.desc {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}
.actions {
  display: flex;
  gap: 5px;
}
.btn {
  padding: 8px 12px;
  border-radius: 8px;
  background: #93c5fd;
  color: #fff;
  border: none;
  cursor: pointer;
}
.btn:hover {
  background: #16a34a;
}
.btn.primary {
  background: #bed6fc;
  color: #4195da;
}
.btn.primary:hover {
  background: #98b9f7;
}
.empty {
  text-align: center;
  color: #666;
  padding: 40px;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 60;
}
.modal {
  background: #fff;
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}
.modal .close {
  position: absolute;
  right: 10px;
  top: 6px;
  border: none;
  background: transparent;
  font-size: 26px;
  cursor: pointer;
}
.modal-body {
  display: flex;
  gap: 18px;
  padding: 18px;
}
.modal-body img {
  width: 48%;
  height: 320px;
  object-fit: cover;
  border-radius: 8px;
}
.detail {
  flex: 1;
}
.modal-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}
/**confirmar adoção */
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #4ade80;
  color: #063e1e;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.25);
  animation: fade-in 0.3s ease;
  z-index: 9999;
}

.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 80;
}

.confirm-box {
  width: 90%;
  max-width: 380px;
  background: #fff;
  padding: 22px;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0,0,0,0.25);
  animation: scaleIn .3s ease;
}

.confirm-box h3 {
  margin-top: 0;
  color: #2563eb;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}


@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 720px) {
  .modal-body {
    flex-direction: column;
  }
  .modal-body img {
    width: 100%;
    height: 220px;
  }
}
</style>
