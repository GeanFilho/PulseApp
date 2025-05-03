// utils/jwtUtils.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_para_jwt';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Gerar token JWT
exports.generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

// Verificar token JWT
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido');
  }
};