// src/services/apiService.js
import axios from 'axios';

// URL base para as requisições
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Configuração base do axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para lidar com erros
api.interceptors.response.use(
  response => response,
  error => {
    // Se o erro for de autenticação (401), redirecionar para login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Serviço de API para PostgreSQL
const apiService = {
  // Autenticação
  auth: {
    login: async (email, password) => {
      try {
        const response = await api.post('/auth/login', { email, password });
        
        // Guardar token e dados do usuário
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return response.data.user;
      } catch (error) {
        console.error('Erro de login:', error);
        throw error.response ? error.response.data : error;
      }
    },
    
    register: async (userData) => {
      try {
        const response = await api.post('/auth/register', userData);
        
        // Guardar token e dados do usuário
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return response.data.user;
      } catch (error) {
        console.error('Erro de registro:', error);
        throw error.response ? error.response.data : error;
      }
    },
    
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    getCurrentUser: async () => {
      try {
        const response = await api.get('/auth/me');
        return response.data;
      } catch (error) {
        console.error('Erro ao obter usuário atual:', error);
        throw error.response ? error.response.data : error;
      }
    }
  },
  
  // Feedbacks
  feedback: {
    getMyFeedbacks: async () => {
      try {
        const response = await api.get('/feedback/me');
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar feedbacks:', error);
        throw error.response ? error.response.data : error;
      }
    },
    
    submitFeedback: async (feedbackData) => {
      try {
        const response = await api.post('/feedback', feedbackData);
        return response.data;
      } catch (error) {
        console.error('Erro ao enviar feedback:', error);
        throw error.response ? error.response.data : error;
      }
    },
    
    getLatestFeedback: async () => {
      try {
        const response = await api.get('/feedback/latest');
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar feedback mais recente:', error);
        throw error.response ? error.response.data : error;
      }
    }
  },
  
  // Admin
  admin: {
    getDashboardStats: async (period = 'last-week') => {
      try {
        const response = await api.get(`/admin/stats?period=${period}`);
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw error.response ? error.response.data : error;
      }
    },
    
    getRecentFeedbacks: async (limit = 5) => {
      try {
        const response = await api.get(`/admin/feedbacks/recent?limit=${limit}`);
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar feedbacks recentes:', error);
        throw error.response ? error.response.data : error;
      }
    },
    
    getDashboard: async (period = 'last-week') => {
      try {
        const response = await api.get(`/admin/dashboard?period=${period}`);
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        throw error.response ? error.response.data : error;
      }
    }
  }
};

export default apiService;