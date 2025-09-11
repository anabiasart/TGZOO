<template>
  <div class="login-page">
    <div class="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">

      <div class="font mb-4">
        <p class="text-blue-600/25 dark:text-sky-400/25">Cuide-se bem...</p>
      </div>

      <!-- Alterna entre Login e Cadastro -->
      <h1 class="text-3xl font-medium mb-3">
        {{ modoCadastro ? "Cadastro" : "Login" }}
      </h1>
      <h2 class="text-xl mb-3">
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
