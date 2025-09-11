<template>
  <div class="admin-home">
    <!-- Cabeçalho -->
    <Header :usuario="usuario" />

    <!-- Atalhos rápidos -->
    <section class="atalhos">
      <h2>Atalhos Rápidos</h2>
      <div class="cards">
        <div class="card" @click="abrirUsuarios">
          <i class="fas fa-users"></i>
          <h3>Usuários</h3>
          <p>Gerencie cadastros e permissões</p>
        </div>
        <div class="card" @click="abrirAtendimentos">
          <i class="fas fa-headset"></i>
          <h3>Atendimentos</h3>
          <p>Veja solicitações e histórico</p>
        </div>
        <div class="card" @click="abrirConfiguracoes">
          <i class="fas fa-cog"></i>
          <h3>Configurações</h3>
          <p>Ajuste preferências do sistema</p>
        </div>
      </div>
    </section>

    <!-- Estatísticas/resumo -->
    <section class="estatisticas">
      <h2>Resumo</h2>
      <div class="stats">
        <div class="stat">
          <h3>👤</h3>
          <p>Total de Usuários</p>
          <span>{{ totalUsuarios }}</span>
        </div>
        <div class="stat">
          <h3>📅</h3>
          <p>Atendimentos Hoje</p>
          <span>{{ atendimentosHoje }}</span>
        </div>
        <div class="stat">
          <h3>⚠️</h3>
          <p>Pendências</p>
          <span>{{ pendencias }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Header from "@/components/Header.vue"

export default {
  name: "AdminHome",
  components: { Header },
  data() {
    return {
      usuario: "Admin",
      totalUsuarios: 120,
      atendimentosHoje: 8,
      pendencias: 3
    }
  },
  methods: {
    abrirUsuarios() {
      console.log("Abrir usuários")
    },

    abrirConfiguracoes() {
      console.log("Abrir configurações")
    }
  }
}

   function abrirAtendimentos() {
      router.push('/atendimento')
    }
</script>

<style scoped>
.admin-home {
  padding: 2rem;
  font-family: font-mono;
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd);
}

/* Seções */
.atalhos, .estatisticas {
  margin-top: 2rem;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #5c906e;
}

/* Cards */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.card {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.card i {
  font-size: 2rem;
  color: #5c906e;
  margin-bottom: 0.5rem;
}

/* Estatísticas */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat {
  background: #5c906e;
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.stat h3 {
  font-size: 2rem;
  margin: 0;
}

.stat span {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
