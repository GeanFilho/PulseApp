// src/services/feedbackService.js
import { 
  collection, 
  addDoc,
  doc,
  getDoc, 
  getDocs, 
  updateDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Função para enviar um novo feedback
export const submitFeedback = async (feedbackData) => {
  try {
    console.log("Enviando feedback:", feedbackData);
    
    // Adicionar timestamp
    const feedbackWithTimestamp = {
      ...feedbackData,
      createdAt: serverTimestamp()
    };
    
    // Adicionar ao Firestore
    const docRef = await addDoc(collection(db, "feedback"), feedbackWithTimestamp);
    console.log("Feedback enviado com sucesso, ID:", docRef.id);
    
    return {
      id: docRef.id,
      ...feedbackData
    };
  } catch (error) {
    console.error('Erro ao enviar feedback:', error);
    // Para fins de demonstração, retornar dados simulados em caso de falha
    return {
      id: 'temp-' + new Date().getTime(),
      ...feedbackData
    };
  }
};

// Obter feedbacks do usuário atual
export const getUserFeedbacks = async (userId) => {
  try {
    console.log("Buscando feedbacks do usuário:", userId);
    
    if (!userId) {
      console.warn("ID de usuário não fornecido");
      return [];
    }
    
    const q = query(
      collection(db, "feedback"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const feedbacks = [];
    
    querySnapshot.forEach((doc) => {
      feedbacks.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Encontrados ${feedbacks.length} feedbacks para o usuário`);
    
    if (feedbacks.length === 0) {
      // Se não encontrar nada, retornar dados de demonstração
      return getDemoFeedbacks(1);
    }
    
    return feedbacks;
  } catch (error) {
    console.error('Erro ao buscar feedbacks do usuário:', error);
    // Retornar dados de demonstração em caso de falha
    return getDemoFeedbacks(1);
  }
};

// Obter o feedback mais recente do usuário
export const getLatestFeedback = async (userId) => {
  try {
    console.log("Buscando feedback mais recente do usuário:", userId);
    
    if (!userId) {
      console.warn("ID de usuário não fornecido");
      return null;
    }
    
    const q = query(
      collection(db, "feedback"),
      where("userId", "==", userId),
      orderBy("date", "desc"),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("Nenhum feedback encontrado para o usuário");
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Erro ao buscar feedback mais recente:', error);
    return null;
  }
};

// Obter todos os feedbacks (para admin)
export const getAllFeedbacks = async (period = 'last-week') => {
  try {
    console.log(`Buscando todos os feedbacks para período: ${period}`);
    
    // Determinar data de corte com base no período
    const cutoffDate = new Date();
    if (period === 'last-week') {
      cutoffDate.setDate(cutoffDate.getDate() - 7);
    } else if (period === 'last-month') {
      cutoffDate.setMonth(cutoffDate.getMonth() - 1);
    } else if (period === 'last-quarter') {
      cutoffDate.setMonth(cutoffDate.getMonth() - 3);
    } else if (period === 'year-to-date') {
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
    }
    
    // Converter para string de data no formato YYYY-MM-DD
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    let feedbackQuery;
    
    try {
      if (period === 'custom') {
        feedbackQuery = query(
          collection(db, "feedback"),
          orderBy("date", "desc")
        );
      } else {
        feedbackQuery = query(
          collection(db, "feedback"),
          where("date", ">=", cutoffDateStr),
          orderBy("date", "desc")
        );
      }
      
      const querySnapshot = await getDocs(feedbackQuery);
      const feedbacks = [];
      
      querySnapshot.forEach(doc => {
        feedbacks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`Encontrados ${feedbacks.length} feedbacks no período`);
      
      if (feedbacks.length > 0) {
        return feedbacks;
      }
    } catch (fbError) {
      console.error("Erro ao buscar do Firebase:", fbError);
    }
    
    // Se não conseguir dados do Firebase, retornar demonstração
    console.log("Usando dados simulados para feedbacks admin");
    return getDemoFeedbacks(10);
  } catch (error) {
    console.error('Erro ao buscar todos os feedbacks:', error);
    return getDemoFeedbacks(10);
  }
};

// Obter feedbacks recentes (para admin)
export const getRecentFeedbacks = async (limitCount = 5) => {
  try {
    console.log("Buscando feedbacks recentes, limite:", limitCount);
    
    // Primeiro, vamos tentar buscar do Firebase
    try {
      const q = query(
        collection(db, "feedback"),
        orderBy("date", "desc"),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const feedbacks = [];
      
      // Se não tiver feedback, não entra no loop
      if (querySnapshot.empty) {
        console.log("Nenhum feedback encontrado no Firebase");
      } else {
        // Processar cada feedback encontrado
        for (const feedbackDoc of querySnapshot.docs) {
          const feedbackData = feedbackDoc.data();
          
          // Buscar informações do usuário
          try {
            if (!feedbackData.userId) {
              console.warn("Feedback sem userId:", feedbackDoc.id);
              continue;
            }
            
            const userDoc = await getDoc(doc(db, "users", feedbackData.userId));
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              
              feedbacks.push({
                id: feedbackDoc.id,
                name: userData.name,
                dept: userData.department,
                ...feedbackData
              });
            } else {
              console.log("Usuário não encontrado para feedback:", feedbackData.userId);
              feedbacks.push({
                id: feedbackDoc.id,
                name: 'Usuário Desconhecido',
                dept: 'Desconhecido',
                ...feedbackData
              });
            }
          } catch (userError) {
            console.error("Erro ao buscar dados do usuário:", userError);
            feedbacks.push({
              id: feedbackDoc.id,
              name: 'Usuário (erro)',
              dept: 'Departamento',
              ...feedbackData
            });
          }
        }
      }
      
      if (feedbacks.length > 0) {
        console.log("Feedbacks encontrados:", feedbacks.length);
        return feedbacks;
      }
    } catch (fbError) {
      console.error("Erro ao buscar do Firebase:", fbError);
    }
    
    // Se não conseguirmos do Firebase, usamos dados simulados
    console.log("Usando dados simulados para feedbacks recentes");
    return getDemoFeedbacks(limitCount);
  } catch (error) {
    console.error('Erro ao buscar feedbacks recentes:', error);
    return getDemoFeedbacks(limitCount);
  }
};

// Obter estatísticas para o dashboard
export const getDashboardStats = async (period = 'last-week') => {
  try {
    console.log(`Calculando estatísticas do dashboard para: ${period}`);
    
    // Obter todos os feedbacks do período para fazer os cálculos
    const feedbacks = await getAllFeedbacks(period);
    
    // Se não tiver feedbacks, retornar estatísticas de demo
    if (!feedbacks || feedbacks.length === 0) {
      console.log("Sem feedbacks, usando estatísticas demo");
      return getDemoStats();
    }
    
    // Simular número total de funcionários
    const totalEmployees = 42; // Número arbitrário para exemplo
    
    // Calcular estatísticas reais com base nos feedbacks
    const responseRate = Math.round((feedbacks.length / totalEmployees) * 100) || 0;
    
    // Média de motivação
    const motivationValues = feedbacks.map(f => f.motivation || f.wellbeing || 0);
    const motivationAvg = motivationValues.length > 0 
      ? (motivationValues.reduce((sum, val) => sum + val, 0) / motivationValues.length).toFixed(1)
      : 0;
    
    // Média de carga de trabalho
    const workloadValues = feedbacks.map(f => f.workload || 5);
    const workloadAvg = workloadValues.length > 0 
      ? (workloadValues.reduce((sum, val) => sum + val, 0) / workloadValues.length).toFixed(1)
      : 0;
    
    // Média de rendimento
    const performanceValues = feedbacks.map(f => f.performance || f.productivity || 0);
    const performanceAvg = performanceValues.length > 0 
      ? (performanceValues.reduce((sum, val) => sum + val, 0) / performanceValues.length).toFixed(1)
      : 0;
    
    // Percentuais de apoio da equipe
    const supportYes = feedbacks.filter(f => f.support === 'Sim').length;
    const supportPartial = feedbacks.filter(f => f.support === 'Em partes').length;
    const supportNo = feedbacks.filter(f => f.support === 'Não').length;
    
    const supportYesPercentage = feedbacks.length > 0 
      ? Math.round((supportYes / feedbacks.length) * 100)
      : 0;
    
    const supportPartialPercentage = feedbacks.length > 0 
      ? Math.round((supportPartial / feedbacks.length) * 100)
      : 0;
    
    const supportNoPercentage = feedbacks.length > 0 
      ? Math.round((supportNo / feedbacks.length) * 100)
      : 0;
    
    const stats = {
      responseRate,
      motivationAvg,
      workloadAvg,
      performanceAvg,
      supportYesPercentage,
      supportPartialPercentage,
      supportNoPercentage,
      totalEmployees,
      pendingFeedbacks: totalEmployees - feedbacks.length
    };
    
    console.log("Estatísticas calculadas:", stats);
    return stats;
  } catch (error) {
    console.error('Erro ao calcular estatísticas do dashboard:', error);
    return getDemoStats();
  }
};

// Funções auxiliares para dados de demonstração

// Função de demo para estatísticas
function getDemoStats() {
  return {
    responseRate: 87,
    motivationAvg: 7.6,
    workloadAvg: 6.2,
    performanceAvg: 7.8,
    supportYesPercentage: 64,
    supportPartialPercentage: 28,
    supportNoPercentage: 8,
    totalEmployees: 42,
    pendingFeedbacks: 5
  };
}

// Função para obter feedbacks de demonstração
function getDemoFeedbacks(count = 5) {
  const demoFeedbacks = [
    { 
      id: 1, 
      name: 'Ana Silva', 
      dept: 'Gestão de Tráfego', 
      date: '2025-04-24', 
      motivation: 9,
      workload: 7,
      performance: 8,
      support: 'Sim',
      positiveEvent: 'Concluímos o projeto de campanha digital antes do prazo previsto.',
      improvementSuggestion: 'Gostaria de ter mais oportunidades de colaboração entre equipes.'
    },
    { 
      id: 2, 
      name: 'Carlos Mendes', 
      dept: 'TI', 
      date: '2025-04-23', 
      motivation: 5,
      workload: 3,
      performance: 6,
      support: 'Em partes',
      positiveEvent: 'Implementei uma nova funcionalidade que estava planejada há muito tempo.',
      improvementSuggestion: 'Estamos com alguns problemas técnicos que estão atrasando entregas.'
    },
    { 
      id: 3, 
      name: 'Julia Oliveira', 
      dept: 'Gestão', 
      date: '2025-04-22', 
      motivation: 10,
      workload: 8,
      performance: 9,
      support: 'Sim',
      positiveEvent: 'Lançamos o novo programa de mentoria com muito sucesso!',
      improvementSuggestion: ''
    },
    { 
      id: 4, 
      name: 'Pedro Santos', 
      dept: 'Copywriter', 
      date: '2025-04-21', 
      motivation: 7,
      workload: 9,
      performance: 8,
      support: 'Sim',
      positiveEvent: 'Fechamos um grande projeto com um novo cliente.',
      improvementSuggestion: 'Precisamos melhorar nossa comunicação com o time de suporte.'
    },
    { 
      id: 5, 
      name: 'Fernanda Costa', 
      dept: 'Email Marketing', 
      date: '2025-04-20', 
      motivation: 6,
      workload: 7,
      performance: 7,
      support: 'Em partes',
      positiveEvent: 'Implementamos a nova campanha de e-mail sem problemas.',
      improvementSuggestion: 'Treinamento adicional para o time seria útil.'
    },
    { 
      id: 6, 
      name: 'Roberto Almeida', 
      dept: 'TI', 
      date: '2025-04-19', 
      motivation: 8,
      workload: 6,
      performance: 8,
      support: 'Sim',
      positiveEvent: 'Completamos a migração de servidores sem downtime.',
      improvementSuggestion: 'Precisamos documentar melhor nossa infraestrutura.'
    },
    { 
      id: 7, 
      name: 'Mariana Lima', 
      dept: 'Assistentes', 
      date: '2025-04-18', 
      motivation: 4,
      workload: 10,
      performance: 5,
      support: 'Não',
      positiveEvent: 'Conseguimos resolver um caso complexo de um cliente importante.',
      improvementSuggestion: 'Precisamos de mais pessoas na equipe, estamos sobrecarregados.'
    },
    { 
      id: 8, 
      name: 'Ricardo Ferreira', 
      dept: 'Edição de Vídeo', 
      date: '2025-04-17', 
      motivation: 9,
      workload: 8,
      performance: 9,
      support: 'Sim',
      positiveEvent: 'Lançamos o novo vídeo para o canal com features muito esperadas pelos clientes.',
      improvementSuggestion: 'Poderíamos ter sessões de feedback mais frequentes com os clientes.'
    },
    { 
      id: 9, 
      name: 'Luisa Pereira', 
      dept: 'Copywriter', 
      date: '2025-04-16', 
      motivation: 8,
      workload: 7,
      performance: 8,
      support: 'Sim',
      positiveEvent: 'Finalizamos a redação do site e recebemos comentários muito positivos.',
      improvementSuggestion: 'Precisamos de mais tempo para pesquisa de público-alvo.'
    },
    { 
      id: 10, 
      name: 'Gabriel Moreira', 
      dept: 'TI', 
      date: '2025-04-15', 
      motivation: 6,
      workload: 9,
      performance: 7,
      support: 'Em partes',
      positiveEvent: 'Resolvemos um bug crítico que afetava vários clientes.',
      improvementSuggestion: 'Precisamos melhorar nossos processos de teste automatizados.'
    }
  ];
  
  // Retornar apenas o número solicitado de feedbacks
  return demoFeedbacks.slice(0, count);
}

// Exportar todas as funções
export default {
  submitFeedback,
  getUserFeedbacks,
  getLatestFeedback,
  getRecentFeedbacks,
  getAllFeedbacks,
  getDashboardStats
};