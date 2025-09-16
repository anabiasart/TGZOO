<template>
  <div class="login-page">
    <div class="container">
      <!-- Loading spinner -->
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Processando...</p>
      </div>

      <div v-else>
        <div class="font mb-2">
          <p class="italic text-blue-200">Cuide-se bem...</p>
        </div>

        <!-- Alterna entre Login e Cadastro -->
        <h1 class="text-3xl font-medium mb-3">
          {{ modoCadastro ? "Cadastro" : "Login" }}
        </h1>
        <h2 class="italic text-xl mb-3 text-blue-300">
          {{ modoCadastro ? "Crie sua conta" : "Bem-vindo" }}
        </h2>

        <form @submit.prevent="modoCadastro ? cadastrar() : login()">
          <!-- Inputs comuns -->
          <input
            type="text"
            v-model="form.usuario"
            placeholder="Usuário"
            class="input-field"
            required
            :disabled="loading"
          />
          
          <input
            type="password"
            v-model="form.senha"
            placeholder="Senha"
            class="input-field"
            required
            :disabled="loading"
          />

          <!-- Campo extra apenas no cadastro -->
          <input
            v-if="modoCadastro"
            type="email"
            v-model="form.email"
            placeholder="E-mail"
            class="input-field"
            required
            :disabled="loading"
          />

          <!-- Botões -->
          <button 
            type="submit" 
            class="btn btn-primary mb-2"
            :disabled="loading"
          >
            {{ modoCadastro ? "Registrar" : "Entrar" }}
          </button>
        </form>

        <!-- Alternar -->
        <p class="text-sm mt-3">
          {{ modoCadastro ? "Já tem conta?" : "Não tem conta?" }}
          <span 
            class="text-blue-600 cursor-pointer hover:underline" 
            @click="alternarModo"
          >
            {{ modoCadastro ? "Faça login" : "Cadastre-se" }}
          </span>
        </p>

        <!-- Mensagens -->
        <div v-if="mensagem" :class="mensagemClasse" class="mensagem mt-3">
          {{ mensagem }}
        </div>

        <!-- Debug info (apenas em desenvolvimento) -->
        <div v-if="isDev" class="debug-info mt-4">
          <details>
            <summary>Debug Info</summary>
            <pre>{{ debugInfo }}</pre>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { authAPI } from "@/services/api.js";

// Estados reativo
const form = reactive({
  usuario: "",
  senha: "",
  email: ""
});

const mensagem = ref("");
const modoCadastro = ref(false);
const loading = ref(false);
const tipoMensagem = ref("error"); // success, error, warning

const router = useRouter();

// Computed
const mensagemClasse = computed(() => ({
  'text-red-500': tipoMensagem.value === 'error',
  'text-green-500': tipoMensagem.value === 'success',
  'text-yellow-500': tipoMensagem.value === 'warning'
}));

const isDev = computed(() => process.env.NODE_ENV === 'development');

const debugInfo = computed(() => ({
  form: form,
  loading: loading.value,
  modoCadastro: modoCadastro.value,
  mensagem: mensagem.value,
  localStorage: {
    token: !!localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    user: localStorage.getItem("user")
  }
}));

// Métodos
function limparMensagem() {
  mensagem.value = "";
  tipoMensagem.value = "error";
}

function mostrarMensagem(texto, tipo = "error") {
  mensagem.value = texto;
  tipoMensagem.value = tipo;
  
  // Auto-limpar mensagens de sucesso
  if (tipo === "success") {
    setTimeout(() => {
      mensagem.value = "";
    }, 3000);
  }
}

function alternarModo() {
  modoCadastro.value = !modoCadastro.value;
  limparMensagem();
  
  // Limpar formulário ao alternar
  form.usuario = "";
  form.senha = "";
  form.email = "";
}

function validarFormulario() {
  if (!form.usuario.trim()) {
    mostrarMensagem("Por favor, digite seu usuário");
    return false;
  }
  
  if (!form.senha.trim()) {
    mostrarMensagem("Por favor, digite sua senha");
    return false;
  }
  
  if (form.senha.length < 6) {
    mostrarMensagem("A senha deve ter pelo menos 6 caracteres");
    return false;
  }
  
  if (modoCadastro.value && !form.email.trim()) {
    mostrarMensagem("Por favor, digite seu e-mail");
    return false;
  }
  
  if (modoCadastro.value && !isValidEmail(form.email)) {
    mostrarMensagem("Por favor, digite um e-mail válido");
    return false;
  }
  
  return true;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function login() {
  if (!validarFormulario()) return;
  
  loading.value = true;
  limparMensagem();
  
  try {
    const response = await authAPI.login({
      username: form.usuario,
      password: form.senha,
    });

    console.log("Login bem-sucedido:", response.data);
    
    // Verificar o token
    const token = response.headers["authorization"] || response.data.token;
    
    if (!token) {
      throw new Error("Token não recebido do servidor");
    }

    // Salvar token
    localStorage.setItem("token", token);
    
    // Determinar role e redirecionar
    const role = authAPI.getUserRole();
    
    mostrarMensagem("Login realizado com sucesso!", "success");
    
    // Pequeno delay para mostrar a mensagem de sucesso
    setTimeout(() => {
      if (role === "ADMINISTRATOR") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    }, 1000);
    
  } catch (error) {
    console.error("Erro no login:", error);
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          mostrarMensagem("Usuário ou senha inválidos");
          break;
        case 403:
          mostrarMensagem("Acesso negado");
          break;
        case 500:
          mostrarMensagem("Erro do servidor. Tente novamente");
          break;
        default:
          mostrarMensagem(`Erro: ${error.response.data.message || 'Erro desconhecido'}`);
      }
    } else if (error.request) {
      mostrarMensagem("Erro de conexão. Verifique sua internet");
    } else {
      mostrarMensagem(error.message || "Erro desconhecido");
    }
  } finally {
    loading.value = false;
  }
}

async function cadastrar() {
  if (!validarFormulario()) return;
  
  loading.value = true;
  limparMensagem();
  
  try {
    const response = await authAPI.register({
      roleName: form.usuario,    // Será mapeado para 'username' na API
      password: form.senha,
      email: form.email,
    });
    
    console.log("✅ Cadastro bem-sucedido:", response.data);
    
    mostrarMensagem("Conta criada com sucesso! Faça login.", "success");
    
    // Alternar para modo login e limpar formulário
    setTimeout(() => {
      modoCadastro.value = false;
      form.usuario = "";
      form.senha = "";
      form.email = "";
      limparMensagem();
    }, 2000);
    
  } catch (error) {
    console.error("❌ Erro no cadastro:", error);
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 409:
          mostrarMensagem("Usuário ou e-mail já existe");
          break;
        case 400:
          mostrarMensagem(data.error || "Dados inválidos. Verifique os campos");
          break;
        case 500:
          mostrarMensagem("Erro interno do servidor. Tente novamente");
          break;
        default:
          mostrarMensagem(data.error || data.message || 'Erro no cadastro');
      }
    } else if (error.request) {
      mostrarMensagem("Erro de conexão. Verifique sua internet");
    } else {
      mostrarMensagem(error.message || "Erro desconhecido");
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
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
  position: relative;
}

.input-field {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  width: 100%;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.mensagem {
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  width: 100%;
}

.debug-info {
  font-size: 12px;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  width: 100%;
}

.debug-info pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Responsividade */
@media (max-width: 480px) {
  .container {
    width: 90%;
    padding: 30px 20px;
  }
}
</style>