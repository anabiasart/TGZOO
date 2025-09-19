<template>
  <div class="login-page">
    <div class="container">
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Processando...</p>
      </div>

      <div v-else>
        <div class="font mb-2">
          <p class="italic text-blue-200">Cuide-se bem...</p>
        </div>

        <h1 class="text-3xl font-medium mb-3">
          {{ modoCadastro ? "Cadastro" : "Login" }}
        </h1>
        <h2 class="italic text-xl mb-3 text-blue-300">
          {{ modoCadastro ? "Crie sua conta" : "Bem-vindo" }}
        </h2>

        <form @submit.prevent="handleSubmit">
          <!-- LOGIN -->
          <template v-if="!modoCadastro">
            <input
              type="email"
              v-model="form.email"
              placeholder="E-mail"
              class="input-field"
              required
            />
            <input
              type="password"
              v-model="form.password"
              placeholder="Senha"
              class="input-field"
              required
            />
          </template>

          <!-- CADASTRO -->
          <template v-else>
            <input
              type="email"
              v-model="form.email"
              placeholder="E-mail"
              class="input-field"
              required
            />
            <input
              type="password"
              v-model="form.password"
              placeholder="Senha (mínimo 6 caracteres)"
              class="input-field"
              minlength="6"
              required
            />
            <input
              type="text"
              v-model="form.name"
              placeholder="Nome completo"
              class="input-field"
              required
            />
            <input
              type="text"
              v-model="form.cpf"
              placeholder="CPF"
              class="input-field"
              maxlength="14"
              @input="formatCPF"
              required
            />
            <input
              type="phone"
              v-model="form.phone"
              placeholder="Telefone"
              class="input-field"
              maxlength="15"
              @input="formatPhone"
              required
            />
            <select v-model="form.sexo" class="input-field" required>
              <option value="">Selecione o sexo</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
            <!-----Se esta no modo cadastro - true-->
            <select v-model="form.role" class="input-field" required>
              <option value="">Selecione o tipo de conta</option>
              <option value="ROLE_CUSTOMER">Usuário Comum</option>
              <option value="ROLE_ADMINISTRATOR">Administrador</option>
            </select>
          </template>

<!-------Valores salvos serão "ROLE_CUSTOMER" ou "ROLE_ADMINISTRATOR-->
          <button type="submit" class="btn btn-primary mb-2">
            {{ modoCadastro ? "Registrar" : "Entrar" }}
          </button>
        </form>

        <p class="text-sm mt-3">
          {{ modoCadastro ? "Já tem conta?" : "Não tem conta?" }}
          <span class="link" @click="alternarModo">
            {{ modoCadastro ? "Faça login" : "Cadastre-se" }}
          </span>
        </p>
<!--altera o modo-->
        <div v-if="mensagem" :class="['mensagem', 'mt-3', tipoMensagem]">
          {{ mensagem }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { authAPI } from "@/services/api.js";
import api from "@/services/api.js";
const API_BASE_URL = "http://localhost:8080/api";


const router = useRouter();

const redirecionarUsuario = (role) => {
  console.log("🎯 Redirecionando usuário com role:", role);
  
  // Usar as rotas definidas no router diretamente
  if (role === 'ROLE_ADMINISTRATOR' || role.includes('ADMIN')) {
    console.log("👑 Admin detectado - indo para /admin");
    router.push('/admin');
  } else {
    console.log("👤 Customer detectado - indo para /user"); 
    router.push('/user');
  }
};

// Estado
const form = reactive({
  email: "",
  password: "",
  role: "",
  name: "",
  cpf: "",
  phone: "",
  sexo:""
});


const mensagem = ref("");
const modoCadastro = ref(false);
const loading = ref(false);
const tipoMensagem = ref("");

// Métodos
const mostrarMensagem = (texto, tipo = "error") => {
  mensagem.value = texto;
  tipoMensagem.value = tipo;
  
  if (tipo === "success") {
    setTimeout(() => mensagem.value = "", 3000);
  }
};

// Formatar CPF
const formatCPF = (e) => {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})/, '$1-$2');
  }
  form.cpf = value;
};
// Formatar Telefone
const formatPhone = (e) => {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length <= 11) {
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
  }
  form.phone = value;
};



const alternarModo = () => {
  modoCadastro.value = !modoCadastro.value;
  mensagem.value = "";
  Object.keys(form).forEach(key => form[key] = "");
};



//alterna entre login e cadast
const handleSubmit = () => {
  modoCadastro.value ? cadastrar() : login();
};


const login = async () => {
  loading.value = true;
  mensagem.value = "";
  
  try {
    const response = await authAPI.login({
      email: form.email,
      password: form.password,
    });
    
    console.log("🔍 DEBUG - Resposta completa do login:");
    console.log("Headers:", response.headers);
    console.log("Data:", response.data);
    
    // Obter token
    let token = response.headers["authorization"] || 
                response.data.token ||
                response.data.accessToken;

    if (!token) throw new Error("Token não recebido");
    
    // Garantir formato Bearer
    if (!token.startsWith('Bearer ')) {
      token = `Bearer ${token}`;
    }
    
    console.log("🔑 Token processado:", token);

    localStorage.setItem("token", token);
    console.log("✅ Token salvo:", localStorage.getItem("token"));
    
    let role = "ROLE_CUSTOMER"; 
    
    try {
      console.log("🔍 Testando se é administrador...");
      
      const testResponse = await fetch(`${API_BASE_URL}/users/test/administrator`, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (testResponse.ok) {
        role = "ROLE_ADMINISTRATOR";
        console.log("✅ Usuário é administrador");
      } else {
        console.log("ℹ️ Usuário é customer (status:", testResponse.status, ")");
      }
    } catch (error) {
      console.log("ℹ️ Usuário é customer (erro esperado)");
    }
    
    // ETAPA 3: SALVAR ROLE E USER DATA
    localStorage.setItem("role", role);
    
    const userData = {
      email: form.email,
      role: role
    };
    localStorage.setItem("user", JSON.stringify(userData));
    
    console.log("✅ Dados finais salvos:");
    console.log("Token:", localStorage.getItem("token"));
    console.log("Role:", localStorage.getItem("role"));
    console.log("User:", localStorage.getItem("user"));
    
    // ETAPA 4: VERIFICAÇÃO FINAL ANTES DO REDIRECIONAMENTO
    const finalToken = localStorage.getItem("token");
    const finalRole = localStorage.getItem("role");
    
    if (!finalToken || !finalRole) {
      throw new Error("Dados perdidos durante o processo");
    }
    
    mostrarMensagem("Login realizado com sucesso!", "success");
    
    // ETAPA 5: REDIRECIONAMENTO BASEADO NA ROLE
    if (role === "ROLE_ADMINISTRATOR") {
      console.log("🚀 Redirecionando admin para /admin");
      router.push('/admin');
    } else {
      console.log("🚀 Redirecionando customer para /user");
      router.push('/user');
    }
    
  } catch (error) {
    console.error("Erro no login:", error);
    
    if (error.response?.status === 401) {
      mostrarMensagem("E-mail ou senha inválidos");
    } else if (error.response?.status === 404) {
      mostrarMensagem("Servidor não encontrado");
    } else {
      mostrarMensagem("Erro ao fazer login. Tente novamente.");
    }
  } finally {
    loading.value = false;
  }
};

const cadastrar = async () => {
  loading.value = true;
  mensagem.value = "";

  
  try {
    // Validar campos
    if (!form.email || !form.password || !form.role || !form.name || !form.cpf || !form.phone) {
      mostrarMensagem("Preencha todos os campos obrigatórios");
      loading.value = false;
      return;
    }

     // Validar CPF (11 dígitos) - LIMPAR formatação
    const cpfLimpo = form.cpf.replace(/\D/g, ''); // Remove tudo que não é número
    if (cpfLimpo.length !== 11) {
      mostrarMensagem("CPF deve ter 11 dígitos");
      loading.value = false;
      return;
    }

        // Validar telefone (10 ou 11 dígitos)
    const telLimpo = form.phone.replace(/\D/g, '');
    if (telLimpo.length < 10 || telLimpo.length > 11) {
      mostrarMensagem("Telefone inválido");
      loading.value = false;
      return;
    }

  const roleEscolhido = form.role;

   const dadosCadastro = {
      email: form.email,
      password: form.password,
      role: roleEscolhido,
      name: form.name,
      cpf: cpfLimpo,        // Apenas números
      phone: telLimpo, // Apenas números
      sexo: form.sexo || undefined, //opcional
      //campos opcionais
      secundaryPhone: undefined,
      secundarEmail: undefined,
      address: undefined
    
    };

    //debug
    console.log("📤 Enviando dados de cadastro:", dadosCadastro);
    console.log("📍 URL:", `${API_BASE_URL}/users/register`);
    console.log("📋 CPF limpo:", cpfLimpo, "Telefone limpo:", telLimpo, "Nome:", form.name,);


    
        await authAPI.register(dadosCadastro);

    mostrarMensagem("Conta criada com sucesso! Fazendo login...", "success");
    // Auto-login após cadastro bem-sucedido
    setTimeout(async () => {
      try {
        const response = await authAPI.login({
          email: form.email,
          password: form.password,
        });

        // Salvar token
    const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("role", roleEscolhido);
          const userData = {
          email: form.email,
          role: roleEscolhido,
          name: form.name
        };

       localStorage.setItem("user", JSON.stringify(userData));

           redirecionarUsuario(roleEscolhido);

      } catch (loginError) {
        console.error("Erro no auto-login:", loginError);
        mostrarMensagem("Cadastro realizado! Faça login para continuar.", "success");
        
        // Alternar para modo login
        setTimeout(() => {
          modoCadastro.value = false;
          const emailSalvo = form.email;
          Object.keys(form).forEach(key => form[key] = "");
          form.email = emailSalvo;
        }, 2000);
      }
    }, 1500);
    
  } catch (error) {
    console.error("❌ Erro completo no cadastro:", error);
    console.error("Response:", error.response);
    
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      mostrarMensagem("Erro de conexão. Verifique se o servidor está rodando na porta 8080.");
    } else if (error.response?.status === 500) {
      // Erro 500 - problema no servidor
      const errorData = error.response.data;
      console.error("Erro 500 detalhes:", errorData);
      
      if (errorData?.message) {
        mostrarMensagem(`Erro no servidor: ${errorData.message}`);
      } else {
        mostrarMensagem("Erro interno no servidor. Verifique os logs do backend.");
      }
    } else if (error.response?.status === 409) {
      mostrarMensagem("E-mail já está em uso");
    } else if (error.response?.status === 400) {
      const errorMsg = error.response.data;
      if (errorMsg && errorMsg.includes("CPF")) {
        mostrarMensagem("CPF já cadastrado");
      } else {
        mostrarMensagem(errorMsg || "Erro ao criar conta. Verifique os dados.");
      }
    } else {
      mostrarMensagem("Erro ao criar conta. Verifique se o servidor está rodando.");
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd);
}

.container {
  background: white;
  border-radius: 12px;
  padding: 40px;
  width: 380px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.input-field {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  width: 100%;
  font-size: 16px;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  border: none;
  transition: all 0.2s;
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
}

.loading-spinner {
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.mensagem {
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.error { color: #ef4444; }
.success { color: #10b981; }

.link {
  color: #2563eb;
  cursor: pointer;
  text-decoration: underline;
}

/* Utility classes */
.text-3xl { font-size: 1.875rem; }
.text-xl { font-size: 1.25rem; }
.text-sm { font-size: 0.875rem; }
.font-medium { font-weight: 500; }
.italic { font-style: italic; }
.text-blue-200 { color: #bfdbfe; }
.text-blue-300 { color: #93c5fd; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mt-3 { margin-top: 0.75rem; }
</style>