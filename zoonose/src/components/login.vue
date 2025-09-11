<template>
  <div class="login-page">
    <div class="container">
      <div class="font mb-2">
        <p class="font-style: italic text-blue-200 dark:text-sky-400/25">Cuide-se bem...</p>
      </div>

      <!-- Alterna entre Login e Cadastro -->
      <h1 class="text-3xl font-medium mb-3">
        {{ modoCadastro ? "Cadastro" : "Login" }}
      </h1>
      <h2 class="font-style: italic text-xl mb-3 text-blue-300 --tw-text-opacity: 1;
color: rgba(147, 197, 253, var(--tw-text-opacity))">
        {{ modoCadastro ? "Crie sua conta" : "Bem-vindo" }}
      </h2>

      <!-- Inputs comuns -->
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

      <!-- Campo extra apenas no cadastro -->
      <input
        v-if="modoCadastro"
        type="email"
        v-model="email"
        placeholder="E-mail"
        class="border rounded p-2 mb-4 w-64 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      <!-- Botões -->
      <button v-if="!modoCadastro" @click="login" class="btn btn-primary mb-2">Entrar</button>
      <button v-else @click="cadastrar" class="btn btn-primary mb-2">Registrar</button>

      <!-- Alternar -->
      <p class="text-sm mt-3">
        {{ modoCadastro ? "Já tem conta?" : "Não tem conta?" }}
        <span class="text-blue-600 cursor-pointer" @click="modoCadastro = !modoCadastro">
          {{ modoCadastro ? "Faça login" : "Cadastre-se" }}
        </span>
      </p>

      <p class="mensagem text-red-500 mt-2">{{ mensagem }}</p>
  </div>

    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const usuario = ref("");
const senha = ref("");
const email = ref("");
const mensagem = ref("");
const modoCadastro = ref(false); // alterna 

const router = useRouter();

function login() {
  if (usuario.value === "admin" && senha.value === "12345") {
    mensagem.value = "";
    router.push("/admin");
  } else if (usuario.value === "user" && senha.value === "12345") {
    mensagem.value = "";
    router.push("/user");
  } else {
    mensagem.value = "Usuário ou senha incorretos!";
  }
}

function cadastrar() {
  if (usuario.value && senha.value && email.value) {
    mensagem.value = "Conta criada com sucesso! Faça login.";
    modoCadastro.value = false;
    usuario.value = "";
    senha.value = "";
    email.value = "";
  } else {
    mensagem.value = "Preencha todos os campos!";
  }
}
</script>


<style>

.login-page {
  min-height: 100vh;
  margin: 0;
  display: flex;
  justify-content: center; 
  align-items: center;    
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd);
}

.container {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  width: 380px; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
}



</style>