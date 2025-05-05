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
    },
    
    
    // Obter a contagem de usuários
    getUserCount: async () => {
      try {
        const response = await api.get('/admin/users/count');
        
        // Se estiver em um ambiente de desenvolvimento e a API não estiver disponível,
        // retorna um valor simulado para teste
        if (!response.data && process.env.NODE_ENV === 'development') {
          // Simulando valor para desenvolvimento
          const savedCount = localStorage.getItem('simulatedUserCount');
          let count = savedCount ? parseInt(savedCount) : 3;
          
          // Ocasionalmente incrementa para simular novos usuários
          if (Math.random() < 0.1) {
            count++;
            localStorage.setItem('simulatedUserCount', count.toString());
          }
          
          return { count };
        }
        
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar contagem de usuários:', error);
        
        // Em desenvolvimento, retornar um valor simulado em caso de erro
        if (process.env.NODE_ENV === 'development') {
          const savedCount = localStorage.getItem('simulatedUserCount') || '3';
          return { count: parseInt(savedCount) };
        }
        
        throw error.response ? error.response.data : error;
      }
    },
    
    // Buscar todos os usuários
    getAllUsers: async () => {
      try {
        const response = await api.get('/admin/users');
        
        // Se estiver em ambiente de desenvolvimento e não há resposta da API,
        // retornar dados simulados para teste
        if ((!response.data || response.data.length === 0) && process.env.NODE_ENV === 'development') {
          return generateMockUsers();
        }
        
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar todos os usuários:', error);
        
        // Em ambiente de desenvolvimento, retornar dados simulados em caso de erro
        if (process.env.NODE_ENV === 'development') {
          return generateMockUsers();
        }
        
        throw error.response ? error.response.data : error;
      }
    },
    
    // INÍCIO DAS NOVAS FUNÇÕES DE VISIBILIDADE
    
  // Atualizar visibilidade do usuário
updateUserVisibility: async (userId, isVisible) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/visibility`, {
      visible: isVisible
    });
    
    // Se estamos em ambiente de desenvolvimento e a API não responde como esperado,
    // simular para testes
    if (!response.data && process.env.NODE_ENV === 'development') {
      // Simular a atualização de visibilidade e atualizar contagem
      const savedHiddenUsers = localStorage.getItem('hiddenUsers');
      let hiddenUserIds = savedHiddenUsers ? JSON.parse(savedHiddenUsers) : [];
      
      if (isVisible) {
        // Remover da lista de ocultos
        hiddenUserIds = hiddenUserIds.filter(id => id !== userId);
      } else {
        // Adicionar à lista de ocultos se ainda não estiver lá
        if (!hiddenUserIds.includes(userId)) {
          hiddenUserIds.push(userId);
        }
      }
      
      // Atualizar localStorage
      localStorage.setItem('hiddenUsers', JSON.stringify(hiddenUserIds));
      
      // Atualizar contagem de usuários
      const savedCount = localStorage.getItem('simulatedUserCount');
      if (savedCount) {
        const currentCount = parseInt(savedCount);
        const newCount = isVisible ? currentCount + 1 : Math.max(currentCount - 1, 0);
        localStorage.setItem('simulatedUserCount', newCount.toString());
      }
      
      // Disparar evento personalizado
      document.dispatchEvent(new CustomEvent('userVisibilityChanged', {
        detail: { hiddenUsers: hiddenUserIds }
      }));
      
      // Também simular um evento de storage
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'hiddenUsers',
        newValue: JSON.stringify(hiddenUserIds)
      }));
      
      // Retornar sucesso simulado
      return { success: true, message: `Usuário ${isVisible ? 'mostrado' : 'ocultado'} com sucesso` };
    }
    
    return response.data;
  } catch (error) {
    console.error(`Erro ao ${isVisible ? 'mostrar' : 'ocultar'} usuário:`, error);
    throw error.response ? error.response.data : error;
  }
},

// Obter usuários ocultos
getHiddenUsers: async () => {
  try {
    const response = await api.get('/admin/users/hidden');
    
    // Se estamos em desenvolvimento, retornar dados simulados
    if ((!response.data || response.data.length === 0) && process.env.NODE_ENV === 'development') {
      const savedHiddenUsers = localStorage.getItem('hiddenUsers');
      return savedHiddenUsers ? JSON.parse(savedHiddenUsers) : [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários ocultos:', error);
    
    // Em desenvolvimento, retornar dados simulados em caso de erro
    if (process.env.NODE_ENV === 'development') {
      const savedHiddenUsers = localStorage.getItem('hiddenUsers');
      return savedHiddenUsers ? JSON.parse(savedHiddenUsers) : [];
    }
    
    throw error.response ? error.response.data : error;
  }
},

// Obter apenas usuários visíveis
getVisibleUsers: async () => {
  try {
    const response = await api.get('/admin/users/visible');
    
    // Se estamos em desenvolvimento e a API não responde como esperado,
    // retornar dados simulados
    if ((!response.data || response.data.length === 0) && process.env.NODE_ENV === 'development') {
      // Obter todos os usuários e filtrar os ocultos
      const allUsers = await apiService.admin.getAllUsers();
      const savedHiddenUsers = localStorage.getItem('hiddenUsers');
      const hiddenUserIds = savedHiddenUsers ? JSON.parse(savedHiddenUsers) : [];
      
      return allUsers.filter(user => !hiddenUserIds.includes(user.id));
    }
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários visíveis:', error);
    
    // Em desenvolvimento, retornar dados simulados em caso de erro
    if (process.env.NODE_ENV === 'development') {
      try {
        // Gerar usuários simulados e filtrar
        const mockUsers = generateMockUsers();
        const savedHiddenUsers = localStorage.getItem('hiddenUsers');
        const hiddenUserIds = savedHiddenUsers ? JSON.parse(savedHiddenUsers) : [];
        
        return mockUsers.filter(user => !hiddenUserIds.includes(user.id));
      } catch (mockError) {
        console.error('Erro ao gerar usuários simulados:', mockError);
        return [];
      }
    }
    
    throw error.response ? error.response.data : error;
  }
},  
    // Obter usuários ocultos
    getHiddenUsers: async () => {
      try {
        const response = await api.get('/admin/users/hidden');
        
        // Se estamos em desenvolvimento, retornar dados simulados
        if ((!response.data || response.data.length === 0) && process.env.NODE_ENV === 'development') {
          const savedHiddenUsers = localStorage.getItem('hiddenUsers');
          return savedHiddenUsers ? JSON.parse(savedHiddenUsers) : [];
        }
        
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar usuários ocultos:', error);
        
        // Em desenvolvimento, retornar dados simulados em caso de erro
        if (process.env.NODE_ENV === 'development') {
          const savedHiddenUsers = localStorage.getItem('hiddenUsers');
          return savedHiddenUsers ? JSON.parse(savedHiddenUsers) : [];
        }
        
        throw error.response ? error.response.data : error;
      }
    },
    
    // Obter apenas usuários visíveis
    getVisibleUsers: async () => {
      try {
        const response = await api.get('/admin/users/visible');
        
        // Se estamos em desenvolvimento e a API não responde como esperado,
        // retornar dados simulados
        if ((!response.data || response.data.length === 0) && process.env.NODE_ENV === 'development') {
          // Obter todos os usuários e filtrar os ocultos
          const allUsers = await apiService.admin.getAllUsers();
          const savedHiddenUsers = localStorage.getItem('hiddenUsers');
          const hiddenUserIds = savedHiddenUsers ? JSON.parse(savedHiddenUsers) : [];
          
          return allUsers.filter(user => !hiddenUserIds.includes(user.id));
        }
        
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar usuários visíveis:', error);
        
        // Em desenvolvimento, retornar dados simulados em caso de erro
        if (process.env.NODE_ENV === 'development') {
          try {
            // Gerar usuários simulados e filtrar
            const mockUsers = generateMockUsers();
            const savedHiddenUsers = localStorage.getItem('hiddenUsers');
            const hiddenUserIds = savedHiddenUsers ? JSON.parse(savedHiddenUsers) : [];
            
            return mockUsers.filter(user => !hiddenUserIds.includes(user.id));
          } catch (mockError) {
            console.error('Erro ao gerar usuários simulados:', mockError);
            return [];
          }
        }
        
        throw error.response ? error.response.data : error;
      }
    }
    // FIM DAS NOVAS FUNÇÕES DE VISIBILIDADE
  }
};

// Função auxiliar para gerar usuários simulados para desenvolvimento
const generateMockUsers = () => {
  // Nomes para usuários simulados
  const firstNames = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Fernanda', 'Ricardo', 'Juliana', 'Lucas', 'Mariana'];
  const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Rodrigues', 'Ferreira', 'Almeida', 'Pereira', 'Gomes'];
  
  // Departamentos
  const departments = ['Desenvolvimento', 'Marketing', 'RH', 'Vendas', 'Suporte', 'Financeiro', 'Administrativo', 'Operações', 'Design', 'Jurídico'];
  
  // Funções
  const roles = ['employee', 'admin'];
  
  // Lista de usuários
  const users = [];
  
  // Gerar usuários simulados
  const numUsers = parseInt(localStorage.getItem('simulatedUserCount')) || 15;
  
  for (let i = 0; i < numUsers; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    
    // Garantir que pelo menos um administrador seja criado
    const role = i === 0 ? 'admin' : (Math.random() < 0.2 ? 'admin' : 'employee');
    
    users.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@exemplo.com`,
      department,
      role
    });
  }
  
  return users;
};

export default apiService;