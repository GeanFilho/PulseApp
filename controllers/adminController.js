// controllers/adminController.js
const { User, Feedback } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

// Obter estatísticas do dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const { period = 'last-week' } = req.query;
    
    // Determinar a data de corte com base no período
    const cutoffDate = new Date();
    if (period === 'last-week') {
      cutoffDate.setDate(cutoffDate.getDate() - 7);
    } else if (period === 'last-month') {
      cutoffDate.setMonth(cutoffDate.getMonth() - 1);
    } else if (period === 'last-quarter') {
      cutoffDate.setMonth(cutoffDate.getMonth() - 3);
    } else if (period === 'year-to-date') {
      cutoffDate.setMonth(0, 1); // 1º de janeiro do ano atual
    }
    
    const cutoffDateString = cutoffDate.toISOString().split('T')[0];
    
    // Contar total de funcionários
    const totalEmployees = await User.count({
      where: { role: 'employee' }
    });
    
    // Buscar feedbacks do período
    const feedbacks = await Feedback.findAll({
      where: {
        date: {
          [Op.gte]: cutoffDateString
        }
      }
    });
    
    // Total de feedbacks
    const totalFeedbacks = feedbacks.length;
    
    // Taxa de resposta
    const responseRate = Math.round((totalFeedbacks / totalEmployees) * 100) || 0;
    
    // Médias
    let motivationSum = 0;
    let workloadSum = 0;
    let performanceSum = 0;
    let supportYes = 0;
    let supportPartial = 0;
    let supportNo = 0;
    
    feedbacks.forEach(feedback => {
      // Usar motivation ou wellbeing
      const motivationValue = feedback.motivation !== null ? feedback.motivation : feedback.wellbeing;
      if (motivationValue !== null) {
        motivationSum += motivationValue;
      }
      
      // Workload
      if (feedback.workload !== null) {
        workloadSum += feedback.workload;
      }
      
      // Usar performance ou productivity
      const performanceValue = feedback.performance !== null ? feedback.performance : feedback.productivity;
      if (performanceValue !== null) {
        performanceSum += performanceValue;
      }
      
      // Support
      if (feedback.support === 'Sim') supportYes++;
      else if (feedback.support === 'Em partes') supportPartial++;
      else if (feedback.support === 'Não') supportNo++;
    });
    
    const motivationAvg = totalFeedbacks > 0 ? (motivationSum / totalFeedbacks).toFixed(1) : '0.0';
    const workloadAvg = totalFeedbacks > 0 ? (workloadSum / totalFeedbacks).toFixed(1) : '0.0';
    const performanceAvg = totalFeedbacks > 0 ? (performanceSum / totalFeedbacks).toFixed(1) : '0.0';
    
    const supportYesPercentage = totalFeedbacks > 0 ? Math.round((supportYes / totalFeedbacks) * 100) : 0;
    const supportPartialPercentage = totalFeedbacks > 0 ? Math.round((supportPartial / totalFeedbacks) * 100) : 0;
    const supportNoPercentage = totalFeedbacks > 0 ? Math.round((supportNo / totalFeedbacks) * 100) : 0;
    
    // Estatísticas finais
    const stats = {
      responseRate,
      motivationAvg,
      workloadAvg,
      performanceAvg,
      supportYesPercentage,
      supportPartialPercentage,
      supportNoPercentage,
      totalEmployees,
      pendingFeedbacks: totalEmployees - totalFeedbacks
    };
    
    return res.json(stats);
  } catch (error) {
    console.error('Erro ao obter estatísticas do dashboard:', error);
    return res.status(500).json({
      error: 'Erro ao obter estatísticas do dashboard. Tente novamente.'
    });
  }
};

// Obter feedbacks recentes
exports.getRecentFeedbacks = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    // Buscar feedbacks recentes
    const feedbacks = await Feedback.findAll({
      limit: parseInt(limit),
      order: [['date', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'department']
      }]
    });
    
    // Formatar dados para o frontend
    const formattedFeedbacks = feedbacks.map(feedback => {
      return {
        id: feedback.id,
        date: feedback.date,
        name: feedback.user.name,
        dept: feedback.user.department,
        motivation: feedback.motivation || feedback.wellbeing || 0,
        workload: feedback.workload || 0,
        performance: feedback.performance || feedback.productivity || 0,
        support: feedback.support || 'Não informado',
        positiveEvent: feedback.positiveEvent || feedback.comment || '',
        improvementSuggestion: feedback.improvementSuggestion || ''
      };
    });
    
    return res.json(formattedFeedbacks);
  } catch (error) {
    console.error('Erro ao obter feedbacks recentes:', error);
    return res.status(500).json({
      error: 'Erro ao obter feedbacks recentes. Tente novamente.'
    });
  }
};

// Obter todos os usuários (para admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    
    return res.json(users);
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    return res.status(500).json({
      error: 'Erro ao obter usuários. Tente novamente.'
    });
  }
};