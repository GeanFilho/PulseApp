// src/services/apiService.js
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
        // Buscar o usuário pelo email
        const response = await api.get(`/users?email=${email}`);
        
        if (response.data.length === 0) {
          throw new Error('Usuário não encontrado');
        }
        
        const user = response.data[0];
        
        // Em uma API real, a verificação de senha seria feita no backend
        // Aqui, estamos apenas simulando para fins de desenvolvimento
        
        // Salvar dados do usuário no localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        return user;
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
    },
    
    // Nova função para obter o último feedback do usuário
    getLatestFeedback: async (userId) => {
      try {
        const response = await api.get(`/feedback?userId=${userId}&_sort=date&_order=desc&_limit=1`);
        return response.data.length > 0 ? response.data[0] : null;
      } catch (error) {
        console.error('Erro ao buscar feedback mais recente:', error);
        throw error;
      }
    }
  },
  
  // Dados de admin
  admin: {
    getAllFeedbacks: async (period = 'week') => {
      try {
        // Em uma API real, você poderia filtrar pelo período no backend
        const response = await api.get('/feedback');
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar todos os feedbacks:', error);
        throw error;
      }
    },
    
    getDashboardStats: async (period = 'week') => {
      try {
        // Buscar todos os feedbacks
        const feedbacksResponse = await api.get('/feedback');
        const feedbacks = feedbacksResponse.data;
        
        // Buscar todos os usuários para calcular taxa de resposta
        const usersResponse = await api.get('/users?role=employee');
        const totalEmployees = usersResponse.data.length;
        
        // Filtrar feedbacks pelo período (simulação)
        const currentDate = new Date();
        const lastWeek = new Date(currentDate);
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        let filteredFeedbacks = feedbacks;
        if (period === 'week') {
          filteredFeedbacks = feedbacks.filter(feedback => {
            const feedbackDate = new Date(feedback.date);
            return feedbackDate >= lastWeek;
          });
        }
        
        // Calcular estatísticas
        const stats = {
          responseRate: Math.round((filteredFeedbacks.length / totalEmployees) * 100),
          motivationAvg: filteredFeedbacks.length > 0 
            ? (filteredFeedbacks.reduce((sum, item) => sum + (item.motivation || item.wellbeing || 0), 0) / filteredFeedbacks.length).toFixed(1)
            : 0,
          workloadAvg: filteredFeedbacks.length > 0
            ? (filteredFeedbacks.reduce((sum, item) => sum + (item.workload || 5), 0) / filteredFeedbacks.length).toFixed(1)
            : 0,
          performanceAvg: filteredFeedbacks.length > 0
            ? (filteredFeedbacks.reduce((sum, item) => sum + (item.performance || item.productivity || 0), 0) / filteredFeedbacks.length).toFixed(1)
            : 0,
          supportYesPercentage: filteredFeedbacks.length > 0
            ? Math.round(filteredFeedbacks.filter(item => item.support === 'Sim').length / filteredFeedbacks.length * 100)
            : 0,
          supportPartialPercentage: filteredFeedbacks.length > 0
            ? Math.round(filteredFeedbacks.filter(item => item.support === 'Em partes').length / filteredFeedbacks.length * 100)
            : 0,
          supportNoPercentage: filteredFeedbacks.length > 0
            ? Math.round(filteredFeedbacks.filter(item => item.support === 'Não').length / filteredFeedbacks.length * 100)
            : 0,
          totalEmployees: totalEmployees,
          pendingFeedbacks: totalEmployees - filteredFeedbacks.length
        };
        
        return stats;
      } catch (error) {
        console.error('Erro ao buscar estatísticas do dashboard:', error);
        throw error;
      }
    },
    
    // Função para obter feedbacks recentes para o dashboard do admin
    getRecentFeedbacks: async (limit = 5) => {
      try {
        // Buscar feedbacks ordenados por data (mais recentes primeiro)
        const feedbacksResponse = await api.get(`/feedback?_sort=date&_order=desc&_limit=${limit}`);
        const feedbacks = feedbacksResponse.data;
        
        // Buscar informações dos usuários para cada feedback
        const enrichedFeedbacks = await Promise.all(
          feedbacks.map(async (feedback) => {
            try {
              const userResponse = await api.get(`/users/${feedback.userId}`);
              const user = userResponse.data;
              
              return {
                id: feedback.id,
                name: user.name,
                dept: user.department,
                date: feedback.date,
                motivation: feedback.motivation || feedback.wellbeing,
                workload: feedback.workload || 5,
                performance: feedback.performance || feedback.productivity,
                support: feedback.support || 'Não informado',
                positiveEvent: feedback.positiveEvent || feedback.comment,
                improvementSuggestion: feedback.improvementSuggestion || ''
              };
            } catch (error) {
              console.error(`Erro ao buscar usuário ${feedback.userId}:`, error);
              return {
                ...feedback,
                name: 'Usuário desconhecido',
                dept: 'Desconhecido'
              };
            }
          })
        );
        
        return enrichedFeedbacks;
      } catch (error) {
        console.error('Erro ao buscar feedbacks recentes:', error);
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
    createUser: async (userData) => {
      try {
        // Gerar um ID para o novo usuário (simulação)
        const usersResponse = await api.get('/users');
        const users = usersResponse.data;
        const newId = users.length > 0 
          ? Math.max(...users.map(user => user.id)) + 1 
          : 1;
        
        // Criar o usuário com o ID gerado
        const newUser = {
          ...userData,
          id: newId
        };
        
        // Enviar para a API
        const response = await api.post('/users', newUser);
        return response.data;
      } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
      }
    },
    
    updateProfile: async (userId, userData) => {
      try {
        const response = await api.patch(`/users/${userId}`, userData);
        
        // Atualizar dados no localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.id === userId) {
          localStorage.setItem('user', JSON.stringify({
            ...storedUser,
            ...userData
          }));
        }
        
        return response.data;
      } catch (error) {
        console.error(`Erro ao atualizar usuário ${userId}:`, error);
        throw error;
      }
    }
  }
};

export default apiService;