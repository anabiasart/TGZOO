
<template>
<div class="login-page">
        
  <div class="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
    <div class="font mb-4">
      <p class="text-blue-600/25 dark:text-sky-400/25">Cuide-se bem...</p>
    </div>
    <h1 class="text-3xl font-bold mb-2">Login</h1>
    <h2 class="text-xl mb-4">Bem-vindo</h2>

    <input
      type="text"
      v-model="usuario"
      placeholder="Usuário"
      class="border rounded p-2 mb-2 w-64 focus:outline-none focus:ring-2 focus:ring-purple-400"
    />
    <input
      type="password"
      v-model="senha"
      placeholder="Senha"
      class="border rounded p-2 mb-4 w-64 focus:outline-none focus:ring-2 focus:ring-purple-400"
    />

    <button @click="login()" class="bg-lilas-500 text-white p-4 rounded"">Entrar</button>

    <p class="mensagem text-red-500 mt-2">{{ mensagem }}</p>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const usuario = ref('');
const senha = ref('');
const mensagem = ref('');

const router = useRouter();

function login() {
  // Exemplo simples de validação
  if (usuario.value === 'admin' && senha.value === '12345') {
    mensagem.value = '';
    // Redireciona para a página inicial
    router.push('/App'); 
  } else {
    mensagem.value = 'Usuário ou senha incorretos!';
  }
}
</script>


<style>
/*apenas usar o style scoped se for um css isolado. css usado apenas para essa pagina por exemplo. */



 .login-page {
      font-family: Arial, sans-serif;
      background-color:#cae853;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center; /* important: menu aparece no topo */
      min-height: 100vh;
      margin: 0px;
    }

    
    .container {
      
    background-color: rgba(255, 255, 255, 0.85); /* fundo claro e suave */
    padding:30px;
    display:flex;
   flex-direction: column;
    align-items: center;
    border-radius: 20px;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.25);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    /*gap: 20px;  espaçamento entre os cards */
    flex-wrap: wrap; /* quebra em linha nova no celular */
    width: 450px;
    }


   


    input {
      width: 80%;
      padding: 9px;
      margin: 8px 0;
      border: 1px solid #ccc;
      border-radius: 10px;
      font-size: 12px;
      font-style:oblique;
      
      
    }
   
    /*button {
      width: 40%;
      padding: 10px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 7px;
      cursor: pointer;
    }
  */
    
    /*button:hover { background: #45a049; }
    .mensagem { margin-top: 10px; font-size: 14px; }.container {
  max-width: 400px;
}*/
</style>
