<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'



const noticias = ref([])
const router = useRouter()

function cortarTexto(texto, limite) {
  if (!texto) return ''
  texto = texto.replace(/\s+/g, ' ').trim()
  if (texto.length <= limite) return texto
  const cortado = texto.slice(0, limite + 1)
  const ultimoEspaco = cortado.lastIndexOf(' ')
  if (ultimoEspaco <= 0) return texto.slice(0, limite) + '…'
  return cortado.slice(0, ultimoEspaco) + '…'
}

onMounted(async () => {
  try {
    const res = await fetch('/user/edital.html')
    const html = await res.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const cards = doc.querySelectorAll('main .card')
    noticias.value = Array.from(cards).slice(0, 3).map(card => ({
      titulo: card.querySelector('h2')?.textContent.trim() || 'Sem título',
      resumo: cortarTexto(card.querySelector('p')?.textContent.trim() || '', 60)
    }))
  } catch (err) {
    console.error('Erro ao carregar notícias:', err)
  }
})

function acessarDetalhes() {
  window.location.href = 'detalhes.html'
}
function abrirVacina() {
  alert("Mostrando datas de vacinação...")
}
  
function login() {
  router.push('/login') 
}
function agendar() {
  window.location.href = '../src/usuario/login.html'
  }
function ver() {
  window.location.href = 'user/edital.html'
}
</script>

<template>
    
    <!--criado outra div para separar esse background da imagem, da tela de login-->
    <div class = "home-page">
  <!----  <div class="overlay"></div>-->
    <div class="content">

    <div class = "hero-text">
        <h2>Adote um Amigo</h2> 
      <button class="btn btn-outline" @click="acessarDetalhes">ACESSE AQUI</button>  
    </div>

  <div class = "template2">
    <aside class="col-esquerda">
      <div class="service">
        <h3>Vacine o seu Pet</h3>
        <p>Garanta a saúde dos seus amigos peludos...</p>
          <button class="btn btn-outline" @click="abrirVacina">CONSULTAR DATAS</button>
<button class="btn btn-primary">Clique Aqui</button>

  </div>

      <div class="service">
        <h3>Faça login</h3>
        <p>Receba dicas dos nossos veterinários...</p>
          <button class="btn btn-primary" @click="login">LOGIN</button>

</div>
      <div class="service">
        <h3>Agende uma Consulta</h3>
        <p>Receba atendimento especializado...</p>

          <button class="btn btn-secondary" @click="agendar">AGENDAR</button>
</div>
    </aside>

    <main class="col-central">
      <section class="texto-zoonoses">
        <h2>Sobre as Zoonoses</h2>
        <p>
          Zoonoses são doenças que podem ser transmitidas de animais para humanos.
          É fundamental a vacinação e os cuidados veterinários para prevenir esses riscos.
        </p>
      </section>

      <section><div class="card"> <h3>📢 Últimas Notícias & Editais</h3> <div v-if="noticias.length"> <div v-for="(noticia, i) in noticias" :key="i" class="mb-2"> <strong>{{ noticia.titulo }}</strong> <p>{{ noticia.resumo }}</p> </div> </div> <div v-else> <p>Carregando notícias...</p> </div> 
            <button class="btn btn-outline" @click="ver">VEJA MAIS</button>
     </div> </section>
    </main>

    <aside class="col-direita">
      <img src="@/assets/img/vete.jpg" alt="Banner destaque" />
      <img src="@/assets/img/pata.jpg" alt="Banner destaque"/>
    </aside>
  </div>
</div>
</div>
</template>
<!----------------------------------------------------------CSS-->
<style>
/* Fundo geral */
.home-page {
  margin: 0;
  display: flex;
  min-height: 100vh;          /* garante ocupar toda a tela */
  width: 100%;
  position: relative;         /* necessário pro overlay */
  background: url('../assets/img/vacina.webp') no-repeat center center;
  background-size: cover;     /* cobre toda a área */
}

/* camada amarela híbrida 
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;               
  background: 
    radial-gradient(
      circle at center, 
      rgba(255, 230, 0, 0.5) 0%,    
      rgba(255, 230, 0, 0.2) 60%,  
      rgba(255, 230, 0, 0) 100%    
    ),
    linear-gradient(
      to bottom,
      rgba(255, 255, 0, 0.25) 0%,   
      rgba(255, 255, 0, 0) 60%      
    );
  z-index: 1;
}
*/


.content {
  position: relative;
  z-index: 2; /* fica acima do overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

/* Template: lado a lado */
.template2 {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; /* 3 colunas: esq, centro, dir */
  gap: 20px;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
}



/* Coluna central */
.col-central {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.texto-zoonoses {
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Notícias já herda estilo do .card */
.noticias {
  margin-top: auto;
}

/* Coluna direita */
.col-direita {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: flex-start;
  align-items: center;
}

.col-direita img {
  width: 100%;
  height: 300px;           /* define altura fixa  */
  object-fit: cover;       /* cobre sem distorcer */
  border-radius: 16px;
  box-shadow: 0 10px 16px rgba(0, 0, 0, 0.25);
}


/* Main à esquerda */
.main {
  flex: 1;
  padding: 20px;
}

.banner img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
}

/* HERO TEXT */
.hero-text {
  position: fixed;
  top: 10px;
  left: 2px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.85);
  width: 215px;
  padding: 0px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  font-size: 12px;
}

.hero-text label:hover {
  background: #007bff;
}

.hero-text h2 {
  margin-bottom: 0px;
  font-size: 18px;
}

/* Coluna esquerda */
.col-esquerda {
  display: flex;
  flex-direction: column;
  gap: 10px;
 height: 20px;           /* define altura fixa  */
  width: 65%;

}
.service {
  background-color: rgba(255, 255, 255, 0.85);
  padding: 37px;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.service:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.service h3 {
  /* color: #333; */
  margin-bottom: 10px;
  font-size: 28px;
}

.service p {
  font-size: 16px;
  margin-bottom: 15px;
}

/* CARDS */
.card {
  background-color: rgba(245, 243, 243, 0.85);
  padding: 40px;
  width: 500px;
  min-height: 35vh;
  text-align: center;
  border-radius: 50px;
  box-shadow: 0 20px 15px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: grid;
  justify-content: center;
  margin: 20px auto;
  font-size: 20px;
}



.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}
</style>

