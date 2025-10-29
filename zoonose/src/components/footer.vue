<script setup>
import { Facebook, Instagram, Mail, Phone } from "lucide-vue-next"
import zoo from "../assets/img/zoo.png"


const ano = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-container">

      <!-- Sobre -->
      <div class="footer-section">

        <h3 class="footer-title"> 
            <img :src="zoo" alt="ZoonoSys Logo" class="logo" /> 
             </h3>
        <p>
          Sistema de apoio à saúde animal e prevenção de zoonoses.
          Conectando você a informações, serviços e campanhas da prefeitura.
        </p>
      </div>

      <!-- Links úteis -->
      <div class="footer-section">
        <h4 class="footer-subtitle">Links úteis</h4>
        <ul class="footer-links">
          <li @click="$router.push('/')">Início</li>
          <li @click="$router.push('/edital/noticias')">Notícias</li>
          <li @click="$router.push('/edital/campanhas')">Campanhas</li>
          <li @click="$router.push('/login')">Login</li>
          <li @click="$router.push('/adocao')">Adote um Amigo</li>
        </ul>
      </div>

      <!-- Contato -->
      <div class="footer-section">
        <h4 class="footer-subtitle">Contato</h4>
        <p><Mail class="footer-icon" /> zoonosys@prefeitura.gov</p>
        <p><Phone class="footer-icon" /> (11) 99999-0000</p>
      </div>

      <!-- Redes sociais -->
      <div class="footer-section">
        <h4 class="footer-subtitle">Siga-nos</h4>
        <div class="footer-socials">
          <a href="#"><Facebook class="footer-icon" /></a>
          <a href="#"><Instagram class="footer-icon" /></a>
        </div>
      </div>
    </div>

    <!-- Copy -->
    <div class="footer-copy">
      <p>© {{ ano }} ZoonoSys - Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd); 
  color: #333;
  padding: 2rem 1rem 1rem 1rem;
  backdrop-filter: blur(100px);

  margin-top: 0; /* <- tira o buraco branco */
  box-shadow: 0 -2px 10px rgba(255, 252, 252, 0.1);
}

.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}
.footer-section p{
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.1rem;
}



.footer-subtitle {
  font-size: 1rem;
  font-weight: 700;
  color: #88bfff;
  margin-bottom: 0.75rem;
}

.footer-links {
  list-style: none;
  padding: 1;
}
.footer-links li {
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-size: 1.4rem;
  transition: color 0.2s ease;
}
.footer-links li:hover {
  color: #0ea5e9;
}

.footer-icon {
  display: inline-block;
  width: 35px;
  height: 35px;
  margin-right: 6px;
  font-size: 2rem;

  color: #0ea5e9;
}

.footer-socials {
  display: flex;
  gap: 1rem;
}
.footer-socials a {
  display: inline-flex;
  background: #fff;
  padding: 8px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: transform 0.2s ease;
}
.footer-socials a:hover {
  transform: scale(1.1);
}

.footer-copy {
  text-align: center;
  font-size: 0.85rem;
  color: #555;
  border-top: 1px solid rgba(0,0,0,0.1);
  padding-top: 1rem;
  margin-top: 1.5rem;
}
</style>
