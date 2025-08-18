<template>
  <header class="header">
    <h1>Painel do Administrador</h1>
    <p>Bem-vindo(a), {{ usuario }}</p>
            <div class="logo">
                <h1><a href="comunicativo.html">ZoonoSys</a></h1>
                <p>Vigilância, Prevenção e Controle de Zoonoses</p>
            </div>
            <nav class="nav">
                <ul>
                    <li><a href="index.html">Página Inicial</a></li>
                    <li><a href="AnimalListar.html">Animais</a></li>
                    <li><a href="EspecieListar.html">Espécies</a></li>
                    <li><a href="ProtocoloListar.html">Protocolo</a></li>
                    <li><a href="AtendimentoListar.html">Atendimento</a></li>
                    <li><a href="AgendaListar.html">Agenda</a></li>
                </ul>
            </nav>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
    usuario: {
      type: String,
      default: "Admin"
    }
  }
}
</script>

<style scoped>
.header {
  background: #6d28d9; /* roxo */
  color: white;
  padding: 1rem;
  border-radius: 8px;
}
</style>
