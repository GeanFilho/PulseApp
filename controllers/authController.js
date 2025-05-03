// controllers/authController.js
const { User } = require('../models');
const { generateToken } = require('../utils/jwtUtils');

// Registrar novo usuário
exports.register = async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;
    
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({
        error: 'Email já está em uso.'
      });
    }
    
    // Criar novo usuário
    const user = await User.create({
      name,
      email,
      password, // A senha será hasheada automaticamente no hook beforeCreate
      department,
      role: role || 'employee'
    });
    
    // Não retornar a senha
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role
    };
    
    // Gerar token JWT
    const token = generateToken(user);
    
    return res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({
      error: 'Erro ao registrar usuário. Tente novamente.'
    });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verificar se o usuário existe
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas.'
      });
    }
    
    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Credenciais inválidas.'
      });
    }
    
    // Não retornar a senha
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role
    };
    
    // Gerar token JWT
    const token = generateToken(user);
    
    return res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({
      error: 'Erro ao fazer login. Tente novamente.'
    });
  }
};

// Obter perfil do usuário atual
exports.getCurrentUser = async (req, res) => {
  return res.json(req.user);
};

// Atualizar perfil do usuário
exports.updateProfile = async (req, res) => {
  try {
    const { name, department, password } = req.body;
    const userId = req.user.id;
    
    // Encontrar o usuário
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado.'
      });
    }
    
    // Atualizar campos
    if (name) user.name = name;
    if (department) user.department = department;
    if (password) user.password = password;
    
    await user.save();
    
    // Não retornar a senha
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role
    };
    
    return res.json({
      user: userWithoutPassword,
      message: 'Perfil atualizado com sucesso.'
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return res.status(500).json({
      error: 'Erro ao atualizar perfil. Tente novamente.'
    });
  }
};