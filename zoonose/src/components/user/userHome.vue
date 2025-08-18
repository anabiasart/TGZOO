<template>
  <div class="user-home">
    <!-- Cabeçalho -->
      <h1>Painel do Usuário</h1>
      <p>Bem-vindo(a), {{ usuario }}!</p>

    <!-- Área principal -->
    <main class="conteudo">
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

    <!---<style scoped>
    .user-home {
    padding: 20px;
    font-family: Arial, sans-serif;
    }

    .header {
    background: #2563eb; /* azul */
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 20px;
    }

    .atalhos, .noticias {
    margin-top: 20px;
    }

    .cards {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    }

    .card {
    background: #f9f9f9;
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 10px;
    width: 200px;
    text-align: center;
    transition: 0.2s;
    }

    .card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    button {
    margin-top: 10px;
    padding: 8px 12px;
    border: none;
    background: #2563eb;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    }

    button:hover {
    background: #1e40af;
    }
</style>--->
