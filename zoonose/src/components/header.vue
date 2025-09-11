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
        <h1><a href="/home">ZoonoSys</a></h1>
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
  background: linear-gradient(135deg, #abe2bc, #5c906e); 
  color: #14140f;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  


}

/* Barra superior com título e boas-vindas */
.topbar {
  position: relative;
  width: 100%;              
 max-width: 100vw; 
  display: flex;
  overflow: hidden;
  margin: 0;               
  border-radius: 0;         
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  backdrop-filter: blur(10px);
  background: rgba(255,255,255,0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 100;
}
.navbar-logo {
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: bold;
  color: #0ea5e9;
  cursor: pointer;
  gap: 8px;
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

.nav{
 display: flex;
  list-style: none;
  gap: 2rem;

}


.nav a:hover {
  color: #0ea5e9;
  transform: translateY(-2px);
}
</style>
