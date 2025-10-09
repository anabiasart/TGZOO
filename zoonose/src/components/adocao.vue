<template>
        <!-------------
        <main>
    <div class="detalhes-container">
        <img id="fotoAnimal" alt="Foto do animal">
        <h2 id="nomeAnimal"></h2>
        <p><strong>Espécie:</strong> <span id="especieAnimal"></span></p>
        <p><strong>Idade:</strong> <span id="idadeAnimal"></span></p>

        <h3>Formulário de Adoção</h3>
        <form id="formAdocao">
            <label for="nome">Seu Nome:</label>
            <input type="text" id="nome" required>

            <label for="email">Seu Email:</label>
            <input type="email" id="email" required>

            <label for="mensagem">Por que deseja adotar?</label>
            <textarea id="mensagem" rows="4" required></textarea>

            <button type="submit">Enviar Solicitação</button>
        </form>
    </div>
</main>
----->
<div class="adocao-page">


  <section class="adoption-list">
    <header class="controls">
      <h2>Animais disponíveis para adoção</h2>
      <div class="search-area">
        <input v-model="q" placeholder="Buscar por nome,tipo..." />
        <select v-model="filterType">
          <option value="">Todos</option>
          <option value="Cachorro">Cachorro</option>
          <option value="Gato">Gato</option>
          <option value="Outros">Outros</option>
        </select>
      </div>
    </header>

    <main class="grid">
      <article v-for="animal in filteredAnimals" :key="animal.id" class="card">
        <div class="thumb" @click="openModal(animal)">
          <img :src="animal.photo" :alt="`Foto de ${animal.name}`" />   
        </div>

        <div class="info">
          <h3>{{ animal.name }} <span class="badge">{{ animal.type }}</span></h3>
          <p class="meta">{{ animal.age }} • {{ animal.size }} </p>
          <p class="desc">{{ truncate(animal.description, 100) }}</p>

          <div class="actions">
            <button class="btn primary" @click="openModal(animal)">Ver detalhes</button>
            <button class="btn" @click="requestAdoption(animal)">Quero adotar ❤️</button>
          </div>
        </div>
      </article>

      <div v-if="filteredAnimals.length === 0" class="empty">Nenhum animal encontrado.</div>
    </main>

    <!-- Modal simples -->
    <div v-if="selected" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <button class="close" @click="closeModal">×</button>
        <div class="modal-body">
          <img :src="selected.photo" :alt="selected.name" />
          <div class="detail">
            <h3>{{ selected.name }} <small>({{ selected.type }})</small></h3>
            <p class="meta">{{ selected.age }} • {{ selected.size }}</p>
            <p class="desc">{{ selected.description }}</p>

            <div class="contact">
              <h4>Contato para adoção</h4>
              <p>Telefone: {{ selected.contact.phone }}</p>
              <p>E‑mail: <a :href="`mailto:${selected.contact.email}`">{{ selected.contact.email }}</a></p>
            </div>

            <div class="modal-actions">
              <button class="btn primary" @click="confirmAdoption(selected)">Enviar pedido de adoção</button>
              <button class="btn" @click="closeModal">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const q = ref('')
const filterType = ref('')
const selected = ref(null)

// Dados de exemplo — substitua pelos seus dados/API
const animals = ref([
  {
    id: 1,
    name: 'Luna',
    type: 'Gato',
    age: '2 anos',
    size: 'Pequeno',
    city: 'São Paulo',
    state: 'SP',
    description: 'Gata carinhosa, vacinada e castrada. Muito brincalhona e sociável com outros gatos.',
    photo: 'https://placekitten.com/400/300',
    contact: { phone: '(11) 99999-0001', email: 'adocao@example.com' },
  },
  {
    id: 2,
    name: 'Thor',
    type: 'Cachorro',
    age: '3 anos',
    size: 'Médio',
    description: 'Cachorro protetor, ótimo para família. Já vacinado e vermifugado.',
    photo: 'https://placedog.net/500/300?id=1',
    contact: { phone: '(19) 98888-1111', email: 'thor.adocao@example.com' },
  },
  {
    id: 3,
    name: 'Mimi',
    type: 'Cachorro',
    age: '6 meses',
    size: 'Pequeno',
    description: 'Filhote alegre, adora crianças e aprende rápido. Ideal para quem quer um companheiro ativo.',
    photo: 'https://placedog.net/500/300?id=2',
    contact: { phone: '(13) 97777-2222', email: 'mimi@example.com' },
  },
])

const filteredAnimals = computed(() => {
  const term = q.value.trim().toLowerCase()
  return animals.value.filter(a => {
    const matchesQuery =
      !term || [a.name, a.city, a.state, a.type, a.description].join(' ').toLowerCase().includes(term)
    const matchesType = !filterType.value || a.type === filterType.value
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

function requestAdoption(animal) {
  selected.value = animal
}

function confirmAdoption(animal) {
  alert(`Pedido de adoção enviado para ${animal.name}!\nContato: ${animal.contact.phone}`)
  closeModal()
}
</script>

<style scoped>


 .adocao-page{
  background: linear-gradient(135deg, #effff7, #cffaff, #93c5fd); 
  display: flex;
  height: 100vh;
 }

.adoption-list{max-width:1100px;
    margin:auto;
    padding:0 10px;
    font-family:system-ui, -apple-system,
     'Segoe UI', Roboto;
 
     
}

.controls{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:12px}
.controls h2{
  margin:0;
  display: flex;
   background: linear-gradient(135deg, #b0d5ff, #cffaff, #93c5fd); 

  border-radius: 12px;
}




.search-area{display:flex;
  gap:8px}



.search-area input{padding:8px 10px;
  border-radius:6px;
  border:1px solid #26cdf7;
  min-width:120px}



.search-area select{padding:10px;
  border-radius:6px;
  border:0px solid #ccc}


.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px; 
}

.card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 18px rgba(0,0,0,0.06);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

}
.card:hover{
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);


}
.thumb {
  height: 200px;
  overflow: hidden;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.thumb:hover img {
  transform: scale(1.05);
}

.info {
  padding: 10px 14px;
  font-size: 14px;
}

.info h3{margin:0 0 6px;
  font-size:20px;
  display:flex;
  align-items:center;
  gap:10px}

.badge {
  background:#d6d6d6;
  padding:2px 8px;
  border-radius:999px;
  font-size:12px;
  display:flex;
  flex-direction:grid;


}

.meta{color:#555;
  font-size:13px;
  margin:0 0 6px

}

.address{font-size:13px;color:#666;margin:0 0 8px}
.desc{font-size:14px;color:#333;margin-bottom:10px}

.actions{display:flex;
  gap:5px;
  transition:transform .2s;
    transform:scale(1);
      overflow:hidden;

}

.btn{padding:8px 12px;
  border-radius:8px;
  border:1px solid #888;
background:#93c5fd;
  color: #fff;
  border: none;
  cursor:pointer}
.btn:hover{
    background: #16a34a;

}
.btn.primary{background:#bed6fc;color:#4195da;border-color:transparent}
.btn.primary:hover{
      background: #98b9f7;

}
.empty{text-align:center;color:#666;padding:40px}

.modal-overlay{position:fixed;
  inset:0;background:rgba(0,0,0,0.45);
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  z-index:60}

.modal{background:#fff;
  border-radius:12px;
  max-width:900px;
  width:100%;
  box-shadow:0 20px 60px rgba(0,0,0,0.3);
  position:relative}












/* Modal */
.modal .close{position:absolute;right:10px;top:6px;border:none;background:transparent;font-size:26px;cursor:pointer}
.modal-body{display:flex;gap:18px;padding:18px}
.modal-body img{width:48%;height:320px;object-fit:cover;border-radius:8px}
.detail{flex:1}
.contact h4{margin:12px 0 6px}
.modal-actions{margin-top:12px;display:flex;gap:8px}

@media (max-width:720px){
  .modal-body{flex-direction:column}
  .modal-body img{width:100%;height:220px}
}
</style>



