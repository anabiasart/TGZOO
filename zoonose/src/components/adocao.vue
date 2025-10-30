<template>
  <section class="adocao-publica">
    <header>
      <h2>Animais disponíveis para adoção</h2>
    </header>

    <div v-if="carregando" class="status">Carregando...</div>

    <div v-else-if="erro" class="erro">{{ erro }}</div>

    <div v-else class="grid">
      <article v-for="animal in animais" :key="animal.id" class="card">
        <img :src="animal.imageUrl || placeholder" alt="Foto do animal" />
        <div class="info">
          <h3>{{ animal.name }}</h3>
          <p>{{ animal.description || 'Sem descrição.' }}</p>
          <small>{{ traduz(animal.species) }} • {{ traduz(animal.size) }} • {{ traduz(animal.gender) }}</small>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const animais = ref([])
const carregando = ref(true)
const erro = ref(null)
const placeholder = '/src/assets/img/vete.jpg'

async function carregarAnimais() {
  try {
    const res = await fetch('/api/animals/adocao', { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
    const data = await res.json()
    animais.value = data.content || data
  } catch (e) {
    erro.value = 'Falha ao carregar animais: ' + e.message
  } finally {
    carregando.value = false
  }
}

function traduz(valor) {
  const map = {
    CANINE: 'Cachorro',
    FELINE: 'Gato',
    SMALL: 'Pequeno',
    MEDIUM: 'Médio',
    LARGE: 'Grande',
    MALE: 'Macho',
    FEMALE: 'Fêmea'
  }
  return map[valor] || valor
}

onMounted(carregarAnimais)
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



