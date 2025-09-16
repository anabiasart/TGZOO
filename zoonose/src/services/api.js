import axios from "axios";

const api = axios.create({
  baseURL: "/", // o vite.config.js vai redirecionar
  withCredentials: true, // se precisar mandar cookies/sessão
});

// interceptor para incluir token JWT automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;