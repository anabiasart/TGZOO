// services/api.js - VERSÃO CORRIGIDA COMPLETA

import axios from "axios";

// ✅ Configuração base da API
const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Log para verificar se está funcionando
console.log("🔗 API configurada para:", API_BASE_URL);

// Interceptor para requisições (adiciona o token automaticamente)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      // Remove 'Bearer ' se já estiver presente no token
      const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = cleanToken;
    }
    
    console.log(`🚀 Requisição: ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error("❌ Erro na requisição:", error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas (trata erros e tokens)
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Resposta: ${response.status} ${response.config.url}`);
    
    // Captura token do header Authorization da resposta
    const newToken = response.headers["authorization"];
    if (newToken) {
      localStorage.setItem("token", newToken);
      console.log("🔑 Token atualizado");
    }
    
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      console.error(`❌ Erro ${response.status}:`, response.data);
      
      // Token expirado ou inválido
      if (response.status === 401 || response.status === 403) {
        console.log("🚪 Token inválido, limpando localStorage");
        
        // Limpa dados do usuário
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
      }
    } else {
      console.error("🌐 Erro de rede:", error.message);
    }
    
    return Promise.reject(error);
  }
);

// ✅ Funções de autenticação
export const authAPI = {
  // Login do usuário
  login: async (credentials) => {
    try {
      const response = await api.post("/users/login", {
        username: credentials.username,
        password: credentials.password,
      });
      
      // Extrai informações do usuário da resposta
      if (response.data) {
        const { user, role } = response.data;
        if (user) localStorage.setItem("user", JSON.stringify(user));
        if (role) localStorage.setItem("role", role);
      }
      
      return response;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  },

  // Registro de usuário
  register: async (userData) => {
    try {
      const payload = {
        username: userData.roleName,    // Nome de usuário
        password: userData.password,    // Senha
        email: userData.email,         // Email
        role: "ROLE_CUSTOMER"         // Role no formato que o backend espera
      };

      console.log("📤 Enviando dados de registro:", payload);
      
      const response = await api.post("/users/register", payload);
      
      console.log("✅ Registro bem-sucedido:", response.status);
      
      return response;
    } catch (error) {
      console.error("❌ Erro no registro:", error);
      
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Dados:", error.response.data);
      }
      
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    // Não fazemos redirect aqui para evitar import circular
  },

  // Verifica se está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  // Retorna o role do usuário
  getUserRole: () => {
    return localStorage.getItem("role");
  },

  // Retorna dados do usuário
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

// ✅ Export default da instância do axios
export default api;