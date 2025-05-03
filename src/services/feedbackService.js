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

// Enviar feedback
export const submitFeedback = async (feedbackData) => {
  try {
    // Adicionar timestamp
    const feedbackWithTimestamp = {
      ...feedbackData,
      createdAt: serverTimestamp()
    };
    
    // Adicionar ao Firestore
    const docRef = await addDoc(collection(db, "feedback"), feedbackWithTimestamp);
    
    return {
      id: docRef.id,
      ...feedbackData
    };
  } catch (error) {
    console.error('Erro ao enviar feedback:', error);
    throw error;
  }
};

// Obter feedbacks do usuário
export const getUserFeedbacks = async (userId) => {
  try {
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
    
    return feedbacks;
  } catch (error) {
    console.error('Erro ao buscar feedbacks do usuário:', error);
    throw error;
  }
};

// Obter o feedback mais recente do usuário
export const getLatestFeedback = async (userId) => {
  try {
    const q = query(
      collection(db, "feedback"),
      where("userId", "==", userId),
      orderBy("date", "desc"),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Erro ao buscar feedback mais recente:', error);
    throw error;
  }
};

// Obter todos os feedbacks (para admin)
export const getAllFeedbacks = async (period = 'week') => {
  try {
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
    
    if (period === 'custom') {
      // Se for período personalizado, pegar todos e filtrar depois
      feedbackQuery = query(
        collection(db, "feedback"),
        orderBy("date", "desc")
      );
    } else {
      // Para períodos predefinidos, filtrar pela data
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
    
    return feedbacks;
  } catch (error) {
    console.error('Erro ao buscar todos os feedbacks:', error);
    throw error;
  }
};

// Obter feedbacks recentes (para admin)
export const getRecentFeedbacks = async (limitCount = 5) => {
  try {
    const q = query(
      collection(db, "feedback"),
      orderBy("date", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const feedbacks = [];
    
    for (const feedbackDoc of querySnapshot.docs) {
      const feedbackData = feedbackDoc.data();
      
      // Buscar informações do usuário
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
        // Se não encontrar o usuário, ainda adiciona o feedback
        feedbacks.push({
          id: feedbackDoc.id,
          name: 'Usuário Desconhecido',
          dept: 'Desconhecido',
          ...feedbackData
        });
      }
    }
    
    return feedbacks;
  } catch (error) {
    console.error('Erro ao buscar feedbacks recentes:', error);
    throw error;
  }
};

// Obter estatísticas para o dashboard
export const getDashboardStats = async (period = 'last-week') => {
  try {
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
    
    // Buscar todos os usuários funcionários
    const employeesQuery = query(
      collection(db, "users"),
      where("role", "==", "employee")
    );
    
    const employeesSnapshot = await getDocs(employeesQuery);
    const totalEmployees = employeesSnapshot.size;
    
    // Buscar todos os feedbacks do período
    const feedbackQuery = query(
      collection(db, "feedback"),
      where("date", ">=", cutoffDateStr)
    );
    
    const feedbackSnapshot = await getDocs(feedbackQuery);
    
    // Converter para array de dados
    const feedbacks = [];
    feedbackSnapshot.forEach(doc => {
      feedbacks.push(doc.data());
    });
    
    // Calcular estatísticas
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
    
    return {
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
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    throw error;
  }
};

// Exportar todos os serviços
export default {
  submitFeedback,
  getUserFeedbacks,
  getLatestFeedback,
  getRecentFeedbacks,
  getAllFeedbacks,
  getDashboardStats
};