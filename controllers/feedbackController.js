// controllers/feedbackController.js
const { Feedback, User } = require('../models');
const { Op } = require('sequelize');

// Enviar novo feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { 
      motivation, 
      wellbeing, 
      workload, 
      performance, 
      productivity, 
      support, 
      positiveEvent, 
      improvementSuggestion,
      comment 
    } = req.body;
    
    // Criar feedback
    const feedback = await Feedback.create({
      userId: req.user.id,
      date: new Date().toISOString().split('T')[0],
      motivation,
      wellbeing,
      workload,
      performance,
      productivity,
      support,
      positiveEvent,
      improvementSuggestion,
      comment
    });
    
    return res.status(201).json(feedback);
  } catch (error) {
    console.error('Erro ao enviar feedback:', error);
    return res.status(500).json({
      error: 'Erro ao enviar feedback. Tente novamente.'
    });
  }
};

// Obter todos os feedbacks do usuário
exports.getMyFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    
    return res.json(feedbacks);
  } catch (error) {
    console.error('Erro ao buscar feedbacks:', error);
    return res.status(500).json({
      error: 'Erro ao buscar feedbacks. Tente novamente.'
    });
  }
};

// Obter feedback mais recente do usuário
exports.getLatestFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    
    return res.json(feedback);
  } catch (error) {
    console.error('Erro ao buscar feedback mais recente:', error);
    return res.status(500).json({
      error: 'Erro ao buscar feedback mais recente. Tente novamente.'
    });
  }
};