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
        
        // Atualizar a contagem de usuários em ambiente de desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          const savedCountStr = localStorage.getItem('simulatedUserCount');
          const currentCount = savedCountStr ? parseInt(savedCountStr) : 3;
          const newCount = currentCount + 1;
          localStorage.setItem('simulatedUserCount', newCount.toString());
          
          // Disparar evento para notificar outros componentes
          document.dispatchEvent(new CustomEvent('userCountChanged', {
            detail: { count: newCount, action: 'add' }
          }));
        }
        
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
    
    // Atualizar visibilidade do usuário
    updateUserVisibility: async (userId, isVisible) => {
      try {
        // Primeiro tentar chamar a API
        try {
          const response = await api.patch(`/admin/users/${userId}/visibility`, {
            visible: isVisible
          });
          
          // Se tivermos uma resposta válida, usá-la
          if (response.data) {
            return response.data;
          }
        } catch (apiError) {
          console.log('Erro de API durante atualização de visibilidade, usando simulação local:', apiError);
          // Continuar com simulação local se a API falhar
        }
        
        // Se estivermos em desenvolvimento ou a chamada da API falhou, simular a operação localmente
        if (process.env.NODE_ENV === 'development') {
          console.log(`Simulando ${isVisible ? 'mostrar' : 'ocultar'} usuário ${userId}`);
          
          // Obter usuários ocultos atuais
          const savedHiddenUsers = localStorage.getItem('hiddenUsers');
          let hiddenUserIds = savedHiddenUsers ? JSON.parse(savedHiddenUsers) : [];
          
          if (isVisible) {
            // Remover da lista de ocultos
            hiddenUserIds = hiddenUserIds.filter(id => id !== userId);
          } else {
            // Adicionar à lista oculta se ainda não estiver lá
            if (!hiddenUserIds.includes(userId)) {
              hiddenUserIds.push(userId);
            }
          }
          
          // Salvar lista atualizada de usuários ocultos
          localStorage.setItem('hiddenUsers', JSON.stringify(hiddenUserIds));
          
          // Atualizar contagem de usuários com base na mudança de visibilidade
          const totalCountStr = localStorage.getItem('simulatedUserCount');
          if (totalCountStr) {
            const totalCount = parseInt(totalCountStr);
            
            // Não alteramos a contagem total, apenas a visibilidade
            // O cálculo de usuários visíveis acontece em outro lugar
            
            // Disparar evento personalizado para a interface atualizar
            document.dispatchEvent(new CustomEvent('userVisibilityChanged', {
              detail: { 
                hiddenUsers: hiddenUserIds,
                action: isVisible ? 'show' : 'hide',
                userId: userId
              }
            }));
          }
          
          return { 
            success: true, 
            message: `Usuário ${isVisible ? 'mostrado' : 'ocultado'} com sucesso` 
          };
        }
        
        throw new Error("Chamada de API falhou e simulação do modo de desenvolvimento não está disponível");
      } catch (error) {
        console.error(`Erro ao ${isVisible ? 'mostrar' : 'ocultar'} usuário:`, error);
        throw error;
      }
    },
    
    // Obter a contagem de usuários
    getUserCount: async () => {
      try {
        try {
          const response = await api.get('/admin/users/count');
          
          // Se obtivermos uma resposta adequada com uma contagem, use-a
          if (response?.data?.count !== undefined) {
            return response.data;
          }
        } catch (apiError) {
          console.log('Erro de API ao obter contagem de usuários, usando simulação:', apiError);
          // Continuar para fallback de simulação
        }
        
        // Se estivermos em desenvolvimento ou a chamada da API falhou, usar a contagem simulada
        if (process.env.NODE_ENV === 'development') {
          // Obter a contagem salva ou padronizar para um valor razoável
          const savedCount = localStorage.getItem('simulatedUserCount');
          let count = savedCount ? parseInt(savedCount) : 3;
          
          // Incrementar ocasionalmente para simulação
          if (Math.random() < 0.05) {
            count++;
            localStorage.setItem('simulatedUserCount', count.toString());
          }
          
          return { count };
        }
        
        // Se tudo mais falhar, retornar um valor padrão
        return { count: 3 };
      } catch (error) {
        console.error('Erro ao obter contagem de usuários:', error);
        return { count: 3 }; // Fallback padrão
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

// Inicializar o contador de usuários se ainda não existir
if (!localStorage.getItem('simulatedUserCount')) {
  localStorage.setItem('simulatedUserCount', '3');
}

export default apiService;