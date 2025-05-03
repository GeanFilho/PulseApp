// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middlewares/auth');

// Todas as rotas de admin são protegidas e requerem privilégios de admin
router.use(authenticate);
router.use(isAdmin);

// Rotas
router.get('/stats', adminController.getDashboardStats);
router.get('/feedbacks/recent', adminController.getRecentFeedbacks);
router.get('/users', adminController.getAllUsers);

module.exports = router;