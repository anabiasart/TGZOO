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

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') 
        ? token 
        : `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    
    const isAuthEndpoint = response.config.url?.includes('/login') || 
                          response.config.url?.includes('/register');
    
    if (isAuthEndpoint) {
      const newToken = response.headers["authorization"];
      if (newToken) {
        localStorage.setItem("token", newToken);
      }
    }
    
    return response;
  },
  (error) => {
    if (error.response) {
      
      if ([401, 403].includes(error.response.status)) {
        localStorage.clear();
        window.location.href = '/login';
      }
    } else {
      console.error("Erro de rede:", error.message);
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

export const userAPI = {
  getAllUsers: async () => {
    return await api.get('/users'); 
  },

  getUserById: async (id) => {
    return await api.get(`/users/${id}`);
  }
};

export default api;