<template>
  <div class="admin-home">

    <!-- Cabeçalho -->
    <Header :usuario="usuario" />

    <!-- Atalhos rápidos -->
    <section class="atalhos">
      <h2>Atalhos Rápidos</h2>
      <div class="cards">
        <div class="card">
          <h3>Usuários</h3>
          <button @click="abrirUsuarios">Gerenciar</button>
        </div>
        <div class="card">
          <h3>Atendimentos</h3>
          <button @click="abrirAtendimentos">Ver Atendimentos</button>
        </div>
        <div class="card">
          <h3>Configurações</h3>
          <button @click="abrirConfiguracoes">Acessar</button>
        </div>
      </div>
    </section>

    <!-- Estatísticas/resumo -->
    <section class="estatisticas">
      <h2>Resumo</h2>
      <ul>
        <li>Total de Usuários: <span id="totalUsuarios">0</span></li>
        <li>Atendimentos Hoje: <span id="atendimentosHoje">0</span></li>
        <li>Pendências: <span id="pendencias">0</span></li>
      </ul>
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
      usuario: "Admin"
    }
  },
  methods: {
    abrirUsuarios() {
      console.log("Abrir usuários")
    },
    abrirAtendimentos() {
      console.log("Abrir atendimentos")
    },
    abrirConfiguracoes() {
      console.log("Abrir configurações")
    }
  }
}
</script>
