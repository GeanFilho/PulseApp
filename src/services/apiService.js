import axios from 'axios';

// Criação da instância do axios com configuração base
const api = axios.create({
  baseURL: 'http://localhost:3001', // URL da API mock (json-server)
  timeout: 10000, // Timeout de 10s
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar token de autenticação (se disponível)
api.interceptors.request.use(
  config => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      // Em uma API real, você usaria um token JWT ou similar
      // Para nossa API mock, vamos apenas simular isso
      config.headers['Authorization'] = `Bearer mock-token-${user.id}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para lidar com erros de resposta
api.interceptors.response.use(
  response => response,
  error => {
    // Lidar com erros comuns de API
    if (error.response) {
      // O servidor respondeu com um status fora do intervalo 2xx
      console.error('Erro de API:', error.response.status, error.response.data);
      
      // Verificar se é erro de autenticação
      if (error.response.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta da API:', error.request);
    } else {
      // Algo aconteceu na configuração da requisição que causou o erro
      console.error('Erro ao configurar requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Serviço de API
const apiService = {
  // Autenticação
  auth: {
    login: async (email, password) => {
      try {
        // Em uma API real, você faria:
        // const response = await api.post('/auth/login', { email, password });
        
        // No nosso mock, vamos buscar o usuário pelo email
        const response = await api.get(`/users?email=${email}`);
        
        if (response.data.length === 0) {
          throw new Error('Usuário não encontrado');
        }
        
        // Simular verificação de senha (em uma API real, isso seria feito no servidor)
        // Para nosso exemplo, vamos assumir que qualquer senha está correta
        
        return response.data[0];
      } catch (error) {
        console.error('Erro de login:', error);
        throw error;
      }
    },
    
    logout: () => {
      localStorage.removeItem('user');
    }
  },
  
  // Feedbacks
  feedback: {
    getMyFeedbacks: async (userId) => {
      try {
        const response = await api.get(`/feedback?userId=${userId}`);
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar feedbacks do usuário:', error);
        throw error;
      }
    },
    
    submitFeedback: async (feedbackData) => {
      try {
        const response = await api.post('/feedback', feedbackData);
        return response.data;
      } catch (error) {
        console.error('Erro ao enviar feedback:', error);
        throw error;
      }
    }
  },
  
  // Dados de admin
  admin: {
    getAllFeedbacks: async (period = 'week') => {
      try {
        // Em uma API real, você poderia filtrar pelo período no backend
        // Para nosso mock, vamos apenas pegar todos os feedbacks
        const response = await api.get('/feedback');
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar todos os feedbacks:', error);
        throw error;
      }
    },
    
    getDashboardStats: async (period = 'week') => {
      try {
        // Em uma API real, isso seria um endpoint específico
        // Para nosso mock, vamos calcular no frontend com base nos feedbacks
        
        // Buscar todos os feedbacks
        const feedbacksResponse = await api.get('/feedback');
        const feedbacks = feedbacksResponse.data;
        
        // Buscar todos os usuários para calcular taxa de resposta
        const usersResponse = await api.get('/users?role=employee');
        const totalEmployees = usersResponse.data.length;
        
        // Calcular estatísticas básicas
        const stats = {
          responseRate: Math.round((feedbacks.length / totalEmployees) * 100),
          wellbeingAvg: feedbacks.length > 0 
            ? (feedbacks.reduce((sum, item) => sum + item.wellbeing, 0) / feedbacks.length).toFixed(1)
            : 0,
          productivityAvg: feedbacks.length > 0
            ? (feedbacks.reduce((sum, item) => sum + item.productivity, 0) / feedbacks.length).toFixed(1)
            : 0,
          // Adicionar mais estatísticas conforme necessário
        };
        
        return stats;
      } catch (error) {
        console.error('Erro ao buscar estatísticas do dashboard:', error);
        throw error;
      }
    },
    
    getUsers: async () => {
      try {
        const response = await api.get('/users');
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      }
    }
  },
  
  // Gerenciamento de usuários
  users: {
    getUserById: async (userId) => {
      try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
      } catch (error) {
        console.error(`Erro ao buscar usuário ${userId}:`, error);
        throw error;
      }
    },
    
    updateUser: async (userId, userData) => {
      try {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
      } catch (error) {
        console.error(`Erro ao atualizar usuário ${userId}:`, error);
        throw error;
      }
    },
    
    createUser: async (userData) => {
      try {
        const response = await api.post('/users', userData);
        return response.data;
      } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
      }
    }
  }
};

export default apiService;