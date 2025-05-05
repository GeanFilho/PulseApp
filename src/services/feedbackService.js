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
  getLatestFeedback: async (userId) => {
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
      
      // Se estamos em desenvolvimento e não há resposta da API, gerar dados de demonstração
      if (!response.data && process.env.NODE_ENV === 'development') {
        return generateMockStats(period);
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      
      // Em caso de erro em ambiente de desenvolvimento, gerar dados de demonstração
      if (process.env.NODE_ENV === 'development') {
        return generateMockStats(period);
      }
      
      throw error.response ? error.response.data : error;
    }
  },
  
  // Para administradores: obter tendências de feedback
  getFeedbackTrends: async (period = 'last-week') => {
    try {
      const response = await api.get(`/admin/trends?period=${period}`);
      
      // Se estamos em desenvolvimento e não há resposta da API, gerar dados de demonstração
      if (!response.data && process.env.NODE_ENV === 'development') {
        return generateMockTrends(period);
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tendências de feedback:', error);
      
      // Em caso de erro em ambiente de desenvolvimento, gerar dados de demonstração
      if (process.env.NODE_ENV === 'development') {
        return generateMockTrends(period);
      }
      
      throw error.response ? error.response.data : error;
    }
  },
  
  // Para administradores: obter feedbacks recentes
  getRecentFeedbacks: async (limit = 5) => {
    try {
      const response = await api.get(`/admin/feedbacks/recent?limit=${limit}`);
      
      // Se estamos em desenvolvimento e não há resposta da API, gerar dados de demonstração
      if ((!response.data || response.data.length === 0) && process.env.NODE_ENV === 'development') {
        return generateMockFeedbacks(limit);
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar feedbacks recentes:', error);
      
      // Em caso de erro em ambiente de desenvolvimento, gerar dados de demonstração
      if (process.env.NODE_ENV === 'development') {
        return generateMockFeedbacks(limit);
      }
      
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
  
  // Para administradores: excluir feedback
  deleteFeedback: async (feedbackId) => {
    try {
      // Implementação do método para excluir um feedback
      const response = await api.delete(`/feedback/${feedbackId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir feedback:', error);
      throw error.response ? error.response.data : error;
    }
  }
};

// Função auxiliar para gerar estatísticas falsas para desenvolvimento
const generateMockStats = (period) => {
  // Valores básicos
  let responseRate = 75;
  let motivationAvg = 7.2;
  let workloadAvg = 6.8;
  let performanceAvg = 7.5;
  
  // Variar um pouco com base no período
  if (period === 'last-month') {
    responseRate = 68;
    motivationAvg = 6.9;
    workloadAvg = 7.2;
    performanceAvg = 7.0;
  } else if (period === 'last-quarter') {
    responseRate = 72;
    motivationAvg = 7.1;
    workloadAvg = 7.0;
    performanceAvg = 7.2;
  }
  
  // Distribuição do apoio da equipe
  const supportYesPercentage = 60;
  const supportPartialPercentage = 30;
  const supportNoPercentage = 10;
  
  return {
    responseRate,
    motivationAvg,
    workloadAvg,
    performanceAvg,
    supportYesPercentage,
    supportPartialPercentage,
    supportNoPercentage,
    totalEmployees: 20,
    pendingFeedbacks: 5
  };
};

// Função auxiliar para gerar tendências falsas para desenvolvimento
const generateMockTrends = (period) => {
  let direction = 'up';
  let percentage = 5;
  let weeklyValues = [7.2, 6.8, 7.0, 7.4, 7.6, 7.5, 7.8];
  
  // Variar com base no período
  if (period === 'last-month') {
    direction = 'up';
    percentage = 3;
    weeklyValues = [6.5, 6.7, 6.9, 7.0, 7.2, 7.3, 7.5];
  } else if (period === 'last-quarter') {
    direction = 'down';
    percentage = 2;
    weeklyValues = [7.8, 7.6, 7.5, 7.3, 7.2, 7.0, 6.9];
  } else if (period === 'year-to-date') {
    direction = 'stable';
    percentage = 1;
    weeklyValues = [7.2, 7.3, 7.1, 7.2, 7.0, 7.3, 7.2];
  }
  
  return {
    direction,
    percentage,
    weeklyValues
  };
};

// Função auxiliar para gerar feedbacks falsos para desenvolvimento
const generateMockFeedbacks = (limit = 5) => {
  const names = ['João Silva', 'Maria Santos', 'Ana Oliveira', 'Carlos Ferreira', 'Luiza Costa', 'Pedro Souza'];
  const departments = ['Desenvolvimento', 'Marketing', 'RH', 'Vendas', 'Suporte', 'Finanças'];
  const supports = ['Sim', 'Em partes', 'Não'];
  const suggestions = [
    'Precisamos de mais reuniões em equipe para alinhar os objetivos.',
    'Falta comunicação entre os departamentos.',
    'A carga de trabalho está desbalanceada entre os membros da equipe.',
    'Seria bom ter mais tempo para capacitação.',
    'As metodologias ágeis poderiam ser melhor implementadas.'
  ];
  
  const feedbacks = [];
  
  // Gerar feedbacks aleatórios
  for (let i = 0; i < limit; i++) {
    // Gerar valores aleatórios
    const motivation = Math.floor(Math.random() * 5) + 5; // 5-10
    const workload = Math.floor(Math.random() * 8) + 3; // 3-10
    const performance = Math.floor(Math.random() * 5) + 5; // 5-10
    
    // Data aleatória nos últimos 30 dias
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    feedbacks.push({
      id: i + 1,
      name: names[Math.floor(Math.random() * names.length)],
      dept: departments[Math.floor(Math.random() * departments.length)],
      date: date.toISOString().split('T')[0],
      motivation,
      workload,
      performance,
      support: supports[Math.floor(Math.random() * supports.length)],
      improvementSuggestion: Math.random() > 0.3 ? suggestions[Math.floor(Math.random() * suggestions.length)] : ''
    });
  }
  
  return feedbacks;
};

export default feedbackService;