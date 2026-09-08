import axios from 'axios';
import { TOKEN_STORAGE_KEY } from './token-storage-key';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL ?? 'http://localhost:8089/api',
  headers: {
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

// Token inválido/expirado: limpa a sessão local e manda pro login. Feito via
// redirect "duro" (não via router) pra não criar dependência circular entre
// este client e o router/store, e porque um recarregamento completo garante
// que nenhum estado desatualizado do Vuex sobrevive à sessão inválida.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
