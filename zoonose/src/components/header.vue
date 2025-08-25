<template>
  <header class="header">
    <!-- Barra superior -->
    <div class="topbar">
      <h1 class="painel">Painel do Administrador</h1>
      <p class="bemvindo">Bem-vindo(a), {{ usuario }}</p>
    </div>

    <!-- Logo + Navegação -->
    <div class="navbar">
      <div class="logo">
        <h1><a href="comunicativo.html">ZoonoSys</a></h1>
        <p>Vigilância, Prevenção e Controle de Zoonoses</p>
      </div>

      <nav class="nav">
        <ul>
          <li><a href="/">Página Inicial</a></li>
          <li><a href="/animal">Animais</a></li>
          <li><a href="/especie">Espécies</a></li>
          <li><a href="/protocolo">Protocolo</a></li>
          <li><a href="/atendimento">Atendimento</a></li>
        <li><router-link to="/agenda">Agenda</router-link></li>        
    </ul>
      </nav>
    </div>
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
/* Container do header */
.header {
  background: linear-gradient(135deg, #abe2bc, #5c906e); /* azul bonito */
  color: #14140f;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

/* Barra superior com título e boas-vindas */
.topbar {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1.5rem;
  background: rgba(0,0,0,0.15);
  font-size: 0.9rem;
}

.painel {
  font-size: 1.9rem;
  opacity: 0.9;
}

.bemvindo {
  font-size: 1.9rem;
  opacity: 0.9;
}

/* Navbar principal */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  flex-wrap: wrap;
}

/* Logo */
.logo h1 {
  font-size: 1.5rem;
  margin: 0;
}

.logo a {
  text-decoration: none;
  color: #92965c;
  font-weight: bold;
}

.logo p {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.9;
  color:#92965c;
}

/* Menu */
.nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

.nav a {
  text-decoration: none;
  color: white;
  font-weight: 500;
  transition: color 0.2s;
}

.nav a:hover {
  color: #fcd34d; /* amarelo no hover */
}
</style>
