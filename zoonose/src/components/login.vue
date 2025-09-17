
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
          <!-- Campos do LOGIN -->
          <template v-if="!modoCadastro">
            <input
              type="email"
              v-model="form.usuario"
              placeholder="E-mail"
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
          </template>

          <!-- Campos do CADASTRO -->
          <template v-if="modoCadastro">
            <input
              type="email"
              v-model="form.email"
              placeholder="E-mail"
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
            <select
              v-model="form.role"
              class="input-field"
              required
              :disabled="loading"
            >
              <option value="">Selecione o tipo de conta</option>
              <option value="ROLE_CUSTOMER">Usuário Comum</option>
              <option value="ROLE_ADMINISTRATOR">Administrador</option>
            </select>
          </template>

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

// ✅ REMOVER ESTA IMPORTAÇÃO QUE ESTÁ CAUSANDO CONFLITO:
// import { determinarRedirecionamento, debugAuth } from '@/router'

// Estados reativo
const form = reactive({
  usuario: "", // Para login (email)
  email: "", // Para cadastro (email)
  senha: "",
  role: "" // Para cadastro (role)
});

const mensagem = ref("");
const modoCadastro = ref(false);
const loading = ref(false);
const tipoMensagem = ref("error"); // success, error, warning

// ✅ REMOVER ESTA LINHA QUE ESTAVA CAUSANDO ERRO:
// const destino = determinarRedirecionamento(role);

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
  form.email = "";
  form.senha = "";
  form.role = "";
}

function validarFormulario() {
  if (modoCadastro.value) {
    // Validações para cadastro
    if (!form.email.trim()) {
      mostrarMensagem("Por favor, digite o e-mail");
      return false;
    }
    
    if (!isValidEmail(form.email)) {
      mostrarMensagem("Por favor, digite um e-mail válido");
      return false;
    }
    
    if (!form.role) {
      mostrarMensagem("Por favor, selecione o tipo de conta");
      return false;
    }
  } else {
    // Validações para login
    if (!form.usuario.trim()) {
      mostrarMensagem("Por favor, digite seu e-mail");
      return false;
    }
    
    if (!isValidEmail(form.usuario)) {
      mostrarMensagem("Por favor, digite um e-mail válido");
      return false;
    }
  }
  
  // Validação comum para senha
  if (!form.senha.trim()) {
    mostrarMensagem("Por favor, digite sua senha");
    return false;
  }
  
  if (form.senha.length < 6) {
    mostrarMensagem("A senha deve ter pelo menos 6 caracteres");
    return false;
  }
  
  return true;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ✅ FUNÇÃO CORRIGIDA PARA USAR AS ROTAS CERTAS DO SEU ROUTER
function determinarRedirecionamentoCorreto(role) {
  console.log("🎯 Determinando redirecionamento para role:", role);
  
  if (!role || role === 'null' || role === 'undefined') {
    console.warn("⚠️ Role inválido, redirecionando para login");
    return "/login";
  }

  // Processar o role se for objeto
  let roleProcessado = role;
  if (typeof roleProcessado === 'object' && roleProcessado !== null) {
    roleProcessado = roleProcessado.authority || roleProcessado.name || roleProcessado.role;
    console.log("📝 Role é objeto, valor extraído:", roleProcessado);
  }
  
  // Converter para string e normalizar
  const roleString = String(roleProcessado).trim().toUpperCase();
  const roleNormalizado = roleString.replace('ROLE_', '');
  
  console.log("🔤 Role string:", roleString);
  console.log("🔍 Role normalizado:", roleNormalizado);
  
  // ✅ VERIFICAR ADMIN - Usando as rotas que existem no seu router
  if (roleNormalizado === 'ADMINISTRATOR' || 
      roleNormalizado === 'ADMIN' || 
      roleString.includes('ADMIN')) {
    console.log("✅ Redirecionando para /admin/dashboard (admin)");
    return '/admin/dashboard'; // ✅ Rota que existe no seu router
  }
  
  // ✅ VERIFICAR USER/CUSTOMER - Usando as rotas que existem no seu router  
  if (roleNormalizado === 'CUSTOMER' || 
      roleNormalizado === 'USER' || 
      roleNormalizado === 'CLIENT' ||
      roleString.includes('CUSTOMER')) {
    console.log("✅ Redirecionando para /customer/dashboard (user)");
    return '/customer/dashboard'; // ✅ Rota que existe no seu router
  }
  
  // Fallback baseado no conteúdo do role
  if (roleString.includes('ADMIN')) {
    console.log("🔄 Fallback: contém ADMIN → /admin/dashboard");
    return '/admin/dashboard';
  }
  
  // Fallback padrão para usuário comum
  console.log("🔄 Fallback padrão → /customer/dashboard");
  return '/customer/dashboard';
}

async function login() {
  if (!validarFormulario()) return;
  
  loading.value = true;
  limparMensagem();
  
  try {
    console.log("🔐 Tentando fazer login...");
    console.log("📤 Dados enviados:", { email: form.usuario });
    
    const response = await authAPI.login({
      email: form.usuario,
      password: form.senha,
    });

    console.log("✅ Login bem-sucedido!");
    console.log("📦 Response.data:", response.data);
    console.log("📋 Response.headers:", response.headers);
    
    // ✅ 1. SALVAR TOKEN
    const token = response.headers["authorization"] || 
                  response.headers["Authorization"] || 
                  response.data.token ||
                  response.data.accessToken;
    
    if (!token) {
      throw new Error("Token não recebido do servidor");
    }

    localStorage.setItem("token", token);
    console.log("💾 Token salvo:", token.substring(0, 30) + "...");

    // ✅ 2. ENCONTRAR E SALVAR ROLE
    let role = await buscarRoleNaResposta(response, token);
    
    if (!role) {
      // Fallback baseado no email
      role = form.usuario.toLowerCase().includes('admin') ? 'ROLE_ADMINISTRATOR' : 'ROLE_CUSTOMER';
      console.log("🔧 Role fallback definido:", role);
    }

    localStorage.setItem("role", role);
    console.log("💾 Role salvo:", role);

    // ✅ 3. SALVAR DADOS DO USUÁRIO
    salvarDadosUsuario(response, role);

    // ✅ 4. DETERMINAR DESTINO E REDIRECIONAR
    const destino = determinarRedirecionamentoCorreto(role);
    
    console.log("🎯 Estado final:");
    console.log("- Token:", !!token);
    console.log("- Role:", role);
    console.log("- Destino:", destino);
    
    mostrarMensagem("Login realizado com sucesso!", "success");
    
    // ✅ 5. REDIRECIONAR COM VERIFICAÇÃO
    console.log(`🚀 Redirecionando para: ${destino}`);
    
    setTimeout(() => {
      console.log("🔄 Executando redirecionamento...");
      
      router.push(destino).then(() => {
        console.log("✅ Redirecionamento concluído!");
      }).catch(error => {
        console.error("❌ Erro no router.push:", error);
        console.log("🔄 Tentando com window.location...");
        window.location.href = destino;
      });
    }, 1500);
    
  } catch (error) {
    console.error("❌ Erro no login:", error);
    tratarErroLogin(error);
  } finally {
    loading.value = false;
  }
}

// ✅ FUNÇÃO AUXILIAR PARA BUSCAR ROLE
async function buscarRoleNaResposta(response, token) {
  console.log("🔍 Buscando role na resposta...");
  
  const data = response.data;
  let role = null;
  
  // Estratégia 1: Role direto
  if (data.role) {
    role = data.role;
    console.log("✅ Role encontrado em data.role:", role);
    return role;
  }
  
  // Estratégia 2: Role no user
  if (data.user?.role) {
    role = data.user.role;
    console.log("✅ Role encontrado em data.user.role:", role);
    return role;
  }
  
  // Estratégia 3: Authorities
  if (data.authorities?.length > 0) {
    role = data.authorities[0];
    console.log("✅ Role encontrado em authorities:", role);
    return role;
  }
  
  // Estratégia 4: Decodificar token JWT
  if (token && token.includes('.')) {
    try {
      const tokenPayload = token.split('.')[1];
      const payload = JSON.parse(atob(tokenPayload));
      console.log("🔍 Token payload:", payload);
      
      role = payload.role || 
             payload.authority || 
             payload.authorities?.[0] ||
             payload.scope;
             
      if (role) {
        console.log("✅ Role encontrado no token:", role);
        return role;
      }
    } catch (err) {
      console.warn("⚠️ Erro ao decodificar token:", err);
    }
  }
  
  // Estratégia 5: Outros campos
  const possibleFields = ['userRole', 'roleName', 'roleType', 'permission', 'userType', 'type'];
  for (const field of possibleFields) {
    if (data[field]) {
      role = data[field];
      console.log(`✅ Role encontrado em ${field}:`, role);
      return role;
    }
  }
  
  console.error("❌ Role não encontrado em nenhuma estratégia!");
  console.log("📋 Estrutura completa da resposta:", JSON.stringify(data, null, 2));
  
  return null;
}

// ✅ FUNÇÃO AUXILIAR PARA SALVAR DADOS DO USUÁRIO
function salvarDadosUsuario(response, role) {
  const data = response.data;
  
  if (data.user) {
    const userData = { ...data.user, role };
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("💾 Dados do usuário salvos:", userData);
  } else {
    const userData = {
      id: data.id || data.userId,
      email: data.email || form.usuario,
      username: data.username || data.email || form.usuario,
      name: data.name || data.fullName,
      role: role
    };
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("💾 Objeto user criado:", userData);
  }
}

// ✅ FUNÇÃO PARA TRATAR ERROS
function tratarErroLogin(error) {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    console.error(`❌ Erro ${status}:`, data);
    
    switch (status) {
      case 401:
        mostrarMensagem("E-mail ou senha inválidos");
        break;
      case 403:
        mostrarMensagem("Acesso negado. Conta pode estar desativada.");
        break;
      case 404:
        mostrarMensagem("Serviço não encontrado. Verifique se o servidor está rodando.");
        break;
      case 500:
        mostrarMensagem("Erro do servidor. Tente novamente em alguns instantes.");
        break;
      default:
        mostrarMensagem(data.message || data.error || `Erro ${status} no login`);
    }
  } else if (error.request) {
    mostrarMensagem("Erro de conexão. Verifique sua internet e se o servidor está rodando.");
  } else {
    mostrarMensagem(error.message || "Erro desconhecido no login");
  }
}

async function cadastrar() {
  if (!validarFormulario()) return;
  
  loading.value = true;
  limparMensagem();
  
  try {
    console.log("📝 Tentando fazer cadastro...");
    console.log("📋 Dados:", { email: form.email, role: form.role });
    
    const response = await authAPI.register({
      email: form.email,
      password: form.senha,
      role: form.role
    });
    
    console.log("✅ Cadastro bem-sucedido:", response.data);
    
    mostrarMensagem("Conta criada com sucesso! Você pode fazer login agora.", "success");
    
    // Alternar para modo login
    setTimeout(() => {
      modoCadastro.value = false;
      form.usuario = form.email; // ✅ Pré-preencher o email no login
      form.email = "";
      form.senha = "";
      form.role = "";
      limparMensagem();
    }, 2000);
    
  } catch (error) {
    console.error("❌ Erro no cadastro:", error);
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 409:
          mostrarMensagem("E-mail já está em uso.");
          break;
        case 400:
          mostrarMensagem(data.error || data.message || "Dados inválidos.");
          break;
        case 500:
          mostrarMensagem("Erro interno do servidor.");
          break;
        default:
          mostrarMensagem(`Erro ${status}: ${data.error || data.message || 'Erro no cadastro'}`);
      }
    } else if (error.request) {
      mostrarMensagem("Erro de conexão. Verifique se o servidor está rodando.");
    } else {
      mostrarMensagem(error.message || "Erro desconhecido no cadastro");
    }
  } finally {
    loading.value = false;
  }
}

// ✅ FUNÇÃO DE DEBUG - Para testar
window.debugLogin = function() {
  console.log("=== 🔍 DEBUG LOGIN ===");
  console.log("Token:", localStorage.getItem("token")?.substring(0, 30) + "...");
  console.log("Role:", localStorage.getItem("role"));
  console.log("User:", JSON.parse(localStorage.getItem("user") || "null"));
  
  const role = localStorage.getItem("role");
  const destino = determinarRedirecionamentoCorreto(role);
  console.log("Destino calculado:", destino);
  console.log("=== 🔍 FIM DEBUG ===");
  
  return { token: !!localStorage.getItem("token"), role, destino };
}
</script>

// ... resto do CSS permanece igual

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

/* Estilos para select igual aos inputs */
.input-field, select.input-field {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  width: 100%;
  font-size: 16px;
  transition: border-color 0.2s ease;
  background: white;
}

.input-field:focus, select.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field:disabled, select.input-field:disabled {
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

/* Estilos para as classes do Tailwind que não estão sendo aplicadas */
.text-3xl { font-size: 1.875rem; }
.font-medium { font-weight: 500; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-2 { margin-bottom: 0.5rem; }
.italic { font-style: italic; }
.text-xl { font-size: 1.25rem; }
.text-blue-200 { color: #bfdbfe; }
.text-blue-300 { color: #93c5fd; }
.text-sm { font-size: 0.875rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.text-blue-600 { color: #2563eb; }
.cursor-pointer { cursor: pointer; }
.hover\:underline:hover { text-decoration: underline; }
.text-red-500 { color: #ef4444; }
.text-green-500 { color: #10b981; }
.text-yellow-500 { color: #f59e0b; }

/* Responsividade */
@media (max-width: 480px) {
  .container {
    width: 90%;
    padding: 30px 20px;
  }
}
</style>