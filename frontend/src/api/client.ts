import axios from 'axios';

// URL du backend — à ajuster si tu changes le port
const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur : ajoute automatiquement le token à chaque requête
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('futakel_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur : gère les erreurs (401 = token expiré → déconnexion)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('futakel_token');
      localStorage.removeItem('futakel_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);