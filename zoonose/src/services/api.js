
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

console.log("🔗 API configurada para:", API_BASE_URL);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
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

api.interceptors.response.use(
  (response) => {
    console.log(`✅ Resposta: ${response.status} ${response.config.url}`);
    
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
      email: credentials.email,       
      password: credentials.password, 
    });

    // Se backend devolver mais infos (ex: role, user)
    if (response.data) {
      const { user, role, token } = response.data;

      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (role) localStorage.setItem("role", role);
      if (token) localStorage.setItem("token", token); 
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
  email: userData.email,       
  password: userData.password, 
  role: userData.role || "ROLE_CUSTOMER" 
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

  logout: async (shouldRedirect = true) => {
    try {
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          await api.post("/users/logout", {}, {
            headers: { Authorization: token }
          });
          console.log("🔐 Token invalidado no servidor");
        } catch (serverError) {
          console.warn("⚠️ Erro ao invalidar token no servidor:", serverError.message);
        }
      }
      
      // Limpar dados locais
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken"); // se usar refresh token
      
      console.log("🧹 Dados locais limpos");
      
      // Redirecionar apenas se solicitado
      if (shouldRedirect) {
        // Usar window.location para força recarregamento completo
        window.location.href = "/login";
      }
      
      return true;
    } catch (error) {
      console.error("❌ Erro durante logout:", error);
      
      // Mesmo com erro, limpar dados locais
      localStorage.clear();
      
      if (shouldRedirect) {
        window.location.href = "/login";
      }
      
      return false;
    }
  },

  // ✅ LOGOUT FORÇADO (para casos de token inválido)
  forceLogout: () => {
    console.log("🚨 Logout forçado - token inválido");
    localStorage.clear();
    window.location.href = "/login";
  },
  // Verifica se está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },
  isTokenExpired: () => {
    const token = localStorage.getItem("token");
    if (!token) return true;
    
    try {
      // Decodificar JWT para verificar expiração
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      
      return payload.exp < now;
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      return true;
    }
  },
getToken: () => {
    return localStorage.getItem("token");
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");
      
      const response = await api.post("/auth/refresh", {
        refreshToken: refreshToken
      });
      
      const { token, refreshToken: newRefreshToken } = response.data;
      
      localStorage.setItem("token", token);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }
      
      return token;
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      authAPI.forceLogout();
      throw error;
    }
  },

  getUserRole: () => {
    return localStorage.getItem("role");
  },

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default api;