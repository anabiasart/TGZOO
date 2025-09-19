import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Interceptor de Request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') 
        ? token 
        : `Bearer ${token}`;
    }
    
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Erro na requisição:", error);
    return Promise.reject(error);
  }
);

// Interceptor de Response
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    
    // Atualizar token se enviado no header
    const newToken = response.headers["authorization"];
    if (newToken) {
      localStorage.setItem("token", newToken);
    }
    
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ Erro ${error.response.status}:`, error.response.data);
      
      // Limpar dados em caso de token inválido
      if ([401, 403].includes(error.response.status)) {
        localStorage.clear();
      }
    } else {
      console.error("🌐 Erro de rede:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await api.post("/users/login", {
      email: credentials.email,
      password: credentials.password,
    });

    // Processar resposta se houver dados adicionais
    if (response.data) {
      const { user, role, token } = response.data;
      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (role) localStorage.setItem("role", role);
      if (token) localStorage.setItem("token", token);
    }

    return response;
  },

  // Registro
  register: async (userData) => {
     const response = await api.post("/users/register", {
      email: userData.email,
      password: userData.password,
      role: userData.role,
      name: userData.name,
      cpf: userData.cpf,       
      phone: userData.phone, 
      sexo: userData.sexo || undefined, //opcional
      //campos opcionais
      secundaryPhone: undefined,
      secundarEmail: undefined,
      address: undefined,
    });

       // Garantir que o role cadastrado seja mantido
    if (response.data) {
      response.data.registeredRole = userData.role;
    }
    
    return response;
  },


  // Logout
  logout: async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.warn("Logout no servidor falhou:", error.message);
    } finally {
      localStorage.clear();
      window.location.href = "/login";
    }
  },

  // Helpers
  isAuthenticated: () => !!localStorage.getItem("token"),
  
  getToken: () => localStorage.getItem("token"),
  
  getUserRole: () => localStorage.getItem("role"),
  
  getUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
};



export default api;