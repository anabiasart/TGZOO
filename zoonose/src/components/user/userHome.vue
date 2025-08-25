<template>
  <div class="user-home">
    <!-- Cabeçalho -->
    <header class="header">
      <h1>Painel do Usuário</h1>
      <p>Bem-vindo(a), {{ usuario }}!</p>
    </header>

    <!-- Área principal -->
    <main class="conteudo">
      <!-- Atalhos -->
      <section class="atalhos">
        <h2>Suas Ações</h2>
        <div class="cards">
          <div class="card">
            <h3>Meus Dados</h3>
            <button @click="abrirPerfil">Ver Perfil</button>
          </div>
          <div class="card">
            <h3>Atendimentos</h3>
            <button @click="abrirAtendimentos">Consultar</button>
          </div>
          <div class="card">
            <h3>Configurações</h3>
            <button @click="abrirConfiguracoes">Ajustar</button>
          </div>
        </div>
      </section>

      <!-- Notícias -->
      <section class="noticias">
        <h2>Últimas Notícias</h2>
        <ul>
          <li v-for="(noticia, index) in noticias" :key="index">
            {{ noticia }}
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "UserHome",
  data() {
    return {
      usuario: "Usuário",
      noticias: [
        "Nova campanha de saúde disponível.",
        "Atualização do sistema concluída.",
        "Agendamento online disponível para consultas."
      ]
    }
  },
  methods: {
    abrirPerfil() {
      alert("Abrindo perfil do usuário...")
    },
    abrirAtendimentos() {
      alert("Consultando seus atendimentos...")
    },
    abrirConfiguracoes() {
      alert("Abrindo configurações...")
    }
  }
}
</script>

<style scoped>
.user-home {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
 background: linear-gradient(135deg, #abe2bc, #5c906e); /* azul mais claro que admin */
  color: rgb(26, 24, 24);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 10px;
}

.atalhos, .noticias {
  margin-top: 10px;
}

.noticias{
 display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  background: #5c906e;
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  
}
.cards {
   display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;

}

.card {
  background: #f9f9f9;
  border: 0px solid #ddd;
  padding: 55px;
  border-radius: 5px;
  text-align: center;
  transition: 0.2s;
  
}
h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #5c906e;
}


.card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

button {
  margin-top: 10px;
  padding: 10px 22px;
  border: none;
  background: #abe2bc;
  color: #5c906e;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background: #e9ebff;
}
</style>
