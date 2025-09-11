<script setup>
import Footer from "@/components/Footer.vue"
</script>

<template>
  <div class="app-layout">
   

    <!-- Conteúdo da página atual -->
    <router-view />

    <!-- Footer global -->
    <Footer/>
  </div>
</template>
