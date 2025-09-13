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
          <li><router-link to="/edital-admin"> Post Edital</router-link></li>
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
/* Container geral */
.header {
  width: 100%;
  font-family: "Segoe UI", Roboto, sans-serif;
}

/* Barra superior */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #3b6e54, #a5f3fc, #81b7f6);
  color: #fff;
  padding: 0.5rem 2rem;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.painel {
  font-size: 1.2rem;
  font-weight: 600;
}

.bemvindo {
  font-size: 1rem;
  opacity: 0.9;
  font-style: italic;
}

/* Navbar principal */
.navbar {
  position: sticky; /* não precisa ser fixed, assim não sobrepõe */
  top: 0;
  left: 0;
  width: 100%;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  z-index: 99;
}

/* Logo */
.logo h1 {
  font-size: 1.6rem;
  margin: 0;
}

.logo a {
  text-decoration: none;
  color: #0ea5e9;
  font-weight: bold;
  transition: color 0.3s;
}

.logo a:hover {
  color: #3b6e54;
}

.logo p {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.8;
  font-style: italic;
  color: #333;
}

/* Menu */
.nav ul {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav a, .nav router-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  position: relative;
  transition: color 0.3s ease;
}

.nav a:hover, .nav router-link:hover {
  color: #5c906e;
}

/* Efeito underline animado */
.nav a::after, .nav router-link::after {
  content: "";
  position: absolute;
  width: 0%;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: #5c906e;
  transition: width 0.3s ease;
}

.nav a:hover::after, .nav router-link:hover::after {
  width: 100%;
}

</style>
