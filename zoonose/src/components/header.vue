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
        <h1><router-link to="/">ZoonoSys</router-link></h1>
        <p>Vigilância, Prevenção e Controle de Zoonoses</p>
      </div>

      <nav class="nav">
        <ul>
          <li><a href="/">Página Inicial</a></li>
          <li><router-link to="/edital-admin">Postagens</router-link></li>

          <!-- Botão para mostrar mais opções -->
          <li>
            <button class="btn-mais-opcoes" @click="toggleOpcoesExtras">
              {{ opcoesExtrasVisiveis ? '☰ Fechar' : '☰ Trabalho' }}
            </button>
          </li>
        </ul>

        <!-- Opções extras (aparecem quando clicar no botão) -->
        <ul v-if="opcoesExtrasVisiveis" class="navbar-links-extras">
          <li><router-link to="/animal">Animais</router-link></li>
          <li><router-link to="/especie">Espécies</router-link></li>
          <li><router-link to="/protocolo">Protocolo</router-link></li>
          <li><router-link to="/atendimento">Atendimento</router-link></li>
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
  },
  data() {
    return {
      opcoesExtrasVisiveis: false
    }
  },
  methods: {
    toggleOpcoesExtras() {
      this.opcoesExtrasVisiveis = !this.opcoesExtrasVisiveis
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
  background: linear-gradient(150deg, white, #a5f3fc); 
  backdrop-filter: blur(100px);
  padding: 2rem;
  border-radius: 0rem 10rem 0rem;
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
  position: sticky;
  top: 0;
  left: 0;
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.9rem 1.5rem 1.5rem;
  box-shadow: 0 1px 10px rgba(0,0,0,0.08);
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
  align-items: center;
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

/* Botão "Mais opções" */
.btn-mais-opcoes {
  background: #81b7f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-mais-opcoes:hover {
  background: #0284c7;
  transform: scale(1.05);
}

/* Menu de opções extras (dropdown) */
.navbar-links-extras {
  position: absolute;
  top: 100%; /* Ajustado para aparecer logo abaixo do navbar */
  right: 2rem;
  background: white;
  list-style: none;
  font-size: 18px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
  z-index: 100;
  margin-top: 8px;
}

.navbar-links-extras li {
  padding: 10px 14px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.navbar-links-extras li:hover {
  background: #f1f5f9;
}

.navbar-links-extras a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  display: block;
}

.navbar-links-extras a:hover {
  color: #0ea5e9;
}
</style>