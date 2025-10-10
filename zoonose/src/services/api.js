import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api"; 

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true 
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
    
    console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
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
    
    const isAuthEndpoint = response.config.url?.includes('/login') || 
                          response.config.url?.includes('/register');
    
    if (isAuthEndpoint) {
      const newToken = response.headers["authorization"];
      if (newToken) {
        console.log("🔄 Atualizando token de autenticação");
        localStorage.setItem("token", newToken);
      }
    }
    
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ Erro ${error.response.status}:`, error.response.data);
      
      if ([401, 403].includes(error.response.status)) {
        console.warn("🔒 Token inválido - limpando localStorage");
        localStorage.clear();
        window.location.href = '/login';
      }
    } else {
      console.error("🌐 Erro de rede:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post("/users/login", { 
      email: credentials.email,
      password: credentials.password,
    });

    if (response.data) {
      const { user, role, token } = response.data;
      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (role) localStorage.setItem("role", role);
      if (token) localStorage.setItem("token", token);
    }

    return response;
  },

  register: async (userData) => {
    const response = await api.post("/users/register", { 
      email: userData.email,
      password: userData.password,
      role: userData.role,
      name: userData.name,
      cpf: userData.cpf,       
      phone: userData.phone, 
      sexo: userData.sexo || undefined,
      secundaryPhone: undefined,
      secundarEmail: undefined,
      address: undefined,
    });

    if (response.data) {
      response.data.registeredRole = userData.role;
    }
    
    return response;
  },

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

// ← NOVO: API para gerenciar usuários
export const userAPI = {
  getAllUsers: async () => {
    return await api.get('/users'); // ← http://localhost:8080/users
  },

  getUserById: async (id) => {
    return await api.get(`/users/${id}`);
  }
};

export default api;