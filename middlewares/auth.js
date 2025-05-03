// middlewares/auth.js
const { verifyToken } = require('../utils/jwtUtils');
const { User } = require('../models');

// Middleware para verificar autenticação
exports.authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    
    if (!header) {
      return res.status(401).json({
        error: 'Acesso não autorizado. Token não fornecido.'
      });
    }
    
    const [bearer, token] = header.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({
        error: 'Formato de token inválido.'
      });
    }
    
    const decoded = verifyToken(token);
    
    // Verifica se o usuário existe
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        error: 'Usuário não encontrado.'
      });
    }
    
    // Adiciona o usuário à requisição
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    };
    
    return next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido ou expirado.'
    });
  }
};

// Middleware para verificar se o usuário é admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Acesso negado. Permissão de administrador necessária.'
    });
  }
  
  return next();
};