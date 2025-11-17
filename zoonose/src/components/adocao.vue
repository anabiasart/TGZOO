<template>
  
  <nav class="navbar">
    <div class="navbar-logo" @click="router.push('/')">
    <img :src="zoo" alt="ZoonoSys Logo" class="logo" />
  </div>
<ul class="navbar-links">
  
  <li @click="router.push('/')">Início</li>

  <li class="relative group">
  <span
    class="cursor-pointer"
    @click.stop="router.push('/edital/noticias')"
  >
    Notícias
  </span>

  <ul
    class="absolute left-0 mt-2 w-50 bg-white shadow-lg rounded-md opacity-0 invisible
           group-hover:opacity-300 group-hover:visible transition-all duration-200
           transform group-hover:translate-y-1 z-50"
  >
    <li v-for="n in noticiasDropdown" :key="n.id">
      <span
        class="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
             style="font-size: 1.2rem"

        @click="router.push(`/edital/${n.id}`)"
      >
        {{ n.nomeNoticia || n.titulo }}
      </span>
    </li>

    <li
      v-if="noticiasDropdown.length === 0"
      class="px-4 py-2 text-gray-500 text-sm"

    >
      Nenhuma notícia encontrada
    </li>
  </ul>
</li>


  <!-- CAMPANHAS -->
<li class="relative group">
  <span
    class="cursor-pointer"
    @click.stop="router.push('/edital/campanhas')"
  >
    Campanhas
  </span>

  <ul
    class="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-md opacity-0 invisible
           group-hover:opacity-100 group-hover:visible transition-all duration-200
           transform group-hover:translate-y-1 z-50"
  >
    <li v-for="c in campanhasAtivasDropdown" :key="c.id">
      <span
        class="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
             style="font-size: 1.2rem"

        @click="router.push(`/edital/${c.id}`)"
      >
        {{ c.nomeCampanha || c.titulo }}
      </span>
    </li>

    <li
      v-if="campanhasAtivasDropdown.length === 0"
      class="px-4 py-2 text-gray-500 text-sm"
    >
      Nenhuma campanha encontrada
    </li>
  </ul>
</li>

  <li @click="router.push('/edital/adocao')">Adote um Amigo</li>
  <li @click="router.push('/login')">Login</li>

  
</ul>

  <button class="navbar-toggle" @click="menuAberto = !menuAberto">☰</button>

  <ul v-if="menuAberto" class="navbar-mobile">
    <li @click="router.push('/')">Início</li>
    <li @click="router.push('/edital/noticias')">Notícias</li> 
    <li @click="router.push('/edital/campanhas')">Campanhas</li>
    <li @click="router.push('/login')">Login</li>
    <li @click="router.push('/contato')">Contato</li>
  </ul>
</nav>

  <div class="adocao-page">
      
      <div class="header-content">
        <h1>Animais para adoção:</h1>
        <p>Confira os animais disponíveis</p>
        
      </div>
      <button class="btn-voltar" @click="$router.go(-1)">
        ← Voltar
      </button>

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

<div v-if="selected" class="modal-overlay" @click.self="closeModal">
  <div class="modal">
    <button class="close" @click="closeModal"></button>

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
<div v-if="showToast" class="toast">
  {{ toastMessage }}
</div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Syringe, User, Calendar } from 'lucide-vue-next'
import vete from "../assets/img/vete.jpg"
import pata from "../assets/img/pata.jpg"
import zoo from "../assets/img/zoo.png"
import { useEditais } from "@/data/editaisData.js"


const { todosItens: todasNoticias, carregarTodos: carregarNoticias } = useEditais()

const showToast = ref(false)
const toastMessage = ref('')
const q = ref('')
const filterType = ref('')
const selected = ref(null)
const animais = ref([])
const placeholder = '/src/assets/img/vete.jpg'
const showConfirm = ref(false)
const animalToConfirm = ref(null)

const router = useRouter()

const campanhasAtivasDropdown = computed(() => {
  return todasNoticias.value
    .filter(i => i.tipo?.toLowerCase() === 'campanha')
})

const noticiasDropdown = computed(() => {
  return todasNoticias.value
    .filter(i => i.tipo?.toLowerCase() === 'noticia')
})

function toast(msg) {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => (showToast.value = false), 3000)
}

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

async function carregarAnimais() {
  try {
    const res = await fetch('/api/animals/adocao', {
      headers: { Accept: 'application/json' }
    })
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
    const data = await res.json()
    animais.value = data.content || data
  } catch (err) {
    console.error('Erro ao carregar animais:', err)
  }
}

onMounted(async () => {
  await carregarNoticias()   
  await carregarAnimais()    
})

const filteredAnimals = computed(() => {
  const term = q.value.trim().toLowerCase()
  return animais.value.filter(a => {
    const matchesQuery =
      !term ||
      [a.name, a.description, traduzirEspecie(a.species)]
        .join(' ')
        .toLowerCase()
        .includes(term)

    const matchesType =
      !filterType.value || traduzirEspecie(a.species) === filterType.value

    return matchesQuery && matchesType
  })
})

function truncate(text, n) {
  if (!text) return ''
  return text.length > n ? text.slice(0, n) + '...' : text
}


function openModal(animal) { selected.value = animal }
function closeModal() { selected.value = null }
</script>

<style scoped>
.adocao-page {
  background: linear-gradient(135deg, #effff7, #cffaff, #93c5fd);
  width: 100%;
  margin-right: auto;
  align-items: flex-start;
  justify-content: center;
  margin-top: 20px;
  max-width: 10000px;
  flex: 1;
  zoom: 1.1;
  padding-top: 100px; /* espaço para a navbar */
  min-height: 100vh;
  margin-left:auto;
  
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 90px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 3rem;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.08);
  z-index: 200;

}

.navbar-logo .logo {
  height: 180px;
  width: auto;
  transition: transform 0.3s ease;
}

.navbar-links {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.navbar-links li {
  cursor: pointer;
  font-weight: 500;
  color: #333;
  transition: all 0.2s ease;
   font-size: 1.4rem;
  color: #64748b;
  margin: 0 auto;
}

.navbar-links li:hover {
  color: #0ea5e9;
  transform: translateY(-2px);
}

.navbar-toggle {
  display: none;
  background: transparent;
  color: #0ea5e9;
  font-size: 28px;
  border: none;
  cursor: pointer;
}

.navbar-mobile {
  position: absolute;
  top: 90px;
  right: 0;
  background: white;
  color: #333;
  width: 220px;
  list-style: none;
  padding: 12px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.navbar-mobile li {
  padding: 14px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.navbar-mobile li:hover {
  background: #f1f5f9;
}

@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }
  .navbar-toggle {
    display: block;
  }
}


.header-content {
  text-align: center;
  position: relative;
  padding: 40px 20px 25px;
  margin: 0 auto 40px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 1900px;
  border-radius: 20px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.header-content h1 {
  font-size: 2.8rem;
  color: #0ea5e9;
  margin-bottom: 6px;
}

.header-content p {
  font-size: 1.4rem;
  color: #64748b;
  margin: 0 auto;
}

.btn-voltar {
  position: absolute;
  left: 30px;
  top: 100px; /* ↓ desce o botão */
  background: transparent;
  border: none;
  color: #0ea5e9;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 6px 1px;
  font-weight: 600;
  z-index: 300;
}

.btn-voltar:hover {
  color: #0284c7;
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
  font-size: 1rem;
}
.info h3 {
  margin: 0 0 6px;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}
.badge {
  background: #d6d6d6;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 1rem;
}
.meta {
  color: #555;
  font-size: 1.2rem;
  margin-bottom: 6px;
}
.desc {
  font-size: 1.4rem;
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

.toast {
  position: fixed;
  bottom: 20px;
  right: 50px;
  background: #4ade80;
  color: #063e1e;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1.4rem;
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
  font-size: 1.3rem;
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