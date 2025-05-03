// routes/feedback.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { authenticate } = require('../middlewares/auth');

// Todas as rotas de feedback são protegidas
router.use(authenticate);

// Rotas
router.post('/', feedbackController.submitFeedback);
router.get('/me', feedbackController.getMyFeedbacks);
router.get('/latest', feedbackController.getLatestFeedback);

module.exports = router;