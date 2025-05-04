// src/services/feedbackService.js
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

// Serviço para interação com feedbacks
const feedbackService = {
  // Enviar feedback
  submitFeedback: async (feedbackData) => {
    try {
      const response = await api.post('/feedback', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      throw error.response ? error.response.data : error;
    }
  },
  
  // Obter feedbacks do usuário atual
  getMyFeedbacks: async () => {
    try {
      const response = await api.get('/feedback/me');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar meus feedbacks:', error);
      throw error.response ? error.response.data : error;
    }
  },
  
  // Obter feedback mais recente do usuário
  getLatestFeedback: async () => {
    try {
      const response = await api.get('/feedback/latest');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar feedback mais recente:', error);
      throw error.response ? error.response.data : error;
    }
  },
  
  // Para administradores: estatísticas do dashboard
  getDashboardStats: async (period = 'last-week') => {
    try {
      const response = await api.get(`/admin/stats?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      throw error.response ? error.response.data : error;
    }
  },
  
  // Para administradores: obter feedbacks recentes
  getRecentFeedbacks: async (limit = 5) => {
    try {
      const response = await api.get(`/admin/feedbacks/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar feedbacks recentes:', error);
      throw error.response ? error.response.data : error;
    }
  },
  
  // Para administradores: obter todos os feedbacks
  getAllFeedbacks: async (filters = {}) => {
    try {
      const { period, department, startDate, endDate } = filters;
      
      let queryParams = [];
      if (period) queryParams.push(`period=${period}`);
      if (department) queryParams.push(`department=${department}`);
      if (startDate) queryParams.push(`startDate=${startDate}`);
      if (endDate) queryParams.push(`endDate=${endDate}`);
      
      const queryString = queryParams.length > 0 
        ? `?${queryParams.join('&')}` 
        : '';
      
      const response = await api.get(`/admin/feedbacks${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar todos os feedbacks:', error);
      throw error.response ? error.response.data : error;
    }
  },
  
  // NOVO MÉTODO: Para administradores: excluir feedback
  deleteFeedback: async (feedbackId) => {
    try {
      // Alterando de '/feedback/:id' para '/admin/feedback/:id' ou verificando o caminho correto
      // Assumindo que a rota correta seja '/feedback/:id':
      const response = await api.delete(`/feedback/${feedbackId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir feedback:', error);
      throw error.response ? error.response.data : error;
    }
  }
};

export default feedbackService;