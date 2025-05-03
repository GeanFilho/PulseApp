// routes/index.js
const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const feedbackRoutes = require('./feedback');
const adminRoutes = require('./admin');

// Configurar rotas
router.use('/auth', authRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/admin', adminRoutes);

module.exports = router;