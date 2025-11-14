<template>
  <header class="header">

    <!-- TOPBAR -->
    <div class="topbar">
      <p class="bemvindo">Bem-vindo(a), {{ usuario }}</p>
    </div>

    <!-- NAVBAR -->
    <div class="navbar">
      <!-- LOGO DENTRO DA NAVBAR -->
      <div class="header-logo" @click="$router.push('/')">
        <img :src="zoo" alt="Logo ZoonoSys" class="header-logo-img" />
      </div>

      <nav class="nav group">
        <ul class="nav-links">
          <li><router-link to="/">Página Inicial</router-link></li>
          <li><router-link to="/edital-admin">Postagens</router-link></li>
          <li><router-link to="/edital-adocao">Adoção</router-link></li>

          <li>
            <button class="btn-mais-opcoes" @click="toggleOpcoesExtras">
              <span class="menu-icon">☰</span>
              Trabalho
            </button>
          </li>
        </ul>

        <transition name="fade-scale">
          <ul
            v-if="opcoesExtrasVisiveis"
            class="navbar-links-extras"
          >
            <li><router-link to="/animal">Animais</router-link></li>
            <li><router-link to="/especie">Espécies</router-link></li>
            <li><router-link to="/protocolo">Protocolo</router-link></li>
            <li><router-link to="/atendimento">Atendimento</router-link></li>
            <li><router-link to="/agenda">Agenda</router-link></li>
          </ul>
        </transition>

      </nav>
    </div>

  </header>
</template>





<script>
import zoo from "@/assets/img/zoo.png";

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
      opcoesExtrasVisiveis: false,
      zoo,
    }
  },
  methods: {
    toggleOpcoesExtras() {
      this.opcoesExtrasVisiveis = !this.opcoesExtrasVisiveis
    }
  }
}
</script>

<style>
.header {
  width: 100%;
  font-family: "Segoe UI", Roboto, sans-serif;
}

:deep(.header-logo) {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}
:deep(.header-logo-img) {
  height: 62px;
  width: auto;
  transition: transform 0.25s ease;
}
:deep(.header-logo-img:hover) {
  transform: scale(1.05);
}

:deep(.header-logo-text h1) {
  margin: 0;
  font-size: 1.45rem;
  font-weight: 700;
  color: #0284c7;
}

:deep(.header-logo-text p) {
  margin: 0;
  font-size: 0.78rem;
  opacity: 0.75;
  color: #334155;
  margin-top: -4px;
}


/* TOPBAR */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
   background: linear-gradient(120deg, #ffffff, #dff7ff);
  padding: 2.2rem 2rem;
  border-radius: 1rem 1rem 0 0;
}

.bemvindo {
  opacity: 0.85;
  font-style: italic;
}

/* NAV PRINCIPAL */
.navbar {
  position: sticky;
  top: 0;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(20px);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 1rem 1rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  z-index: 99;
}


/* LINKS */
.nav-links {
  list-style: none;
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  position: relative;
  padding: 0.3rem 0;
  transition: color 0.25s ease;
}

.nav-links a:hover {
  color: #0284c7;
}

.nav-links a::after {
  content: "";
  position: absolute;
  width: 0%;
  left: 0;
  bottom: -4px;
  height: 2px;
  background: #0284c7;
  transition: width 0.25s ease;
}

.nav-links a:hover::after {
  width: 100%;
}

/* BOTÃO "TRABALHO" */
.btn-mais-opcoes {
  background: #3b82f6;
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: flex;
  gap: 6px;
  transition: 0.2s ease;
}
.btn-mais-opcoes:hover {
  background: #1d4ed8;
  transform: scale(1.05);
}
.menu-icon {
  font-size: 18px;
}

/* DROPDOWN */
.navbar-links-extras {
  position: absolute;
  top: 95%;
  right: 2rem;
  background: white;
  list-style: none;
  border-radius: 14px;
  padding: 12px;
  min-width: 220px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.navbar-links-extras a {
  color: #333;
  padding: 10px 12px;
  border-radius: 8px;
  display: block;
  transition: background 0.2s;
}
.navbar-links-extras a:hover {
  background: #f1f5f9;
  color: #0284c7;
}

/* TRANSIÇÃO (fade + zoom estilo gov.br) */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.25s ease;
  transform-origin: top right;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.97);
}



</style>