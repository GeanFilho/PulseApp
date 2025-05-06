// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/apiService';

// Criar o contexto
const AuthContext = createContext(null);

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar autenticação ao iniciar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar se há um token e usuário salvos
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          setIsAdmin(user.role === 'admin');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        setCurrentUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Ouvir eventos de atualização de perfil
    const handleProfileUpdate = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAdmin(user.role === 'admin');
      }
    };
    
    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    
    // Limpar listener quando componente for desmontado
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  // Função de registro
  const register = async (userData) => {
    try {
      const user = await apiService.auth.register(userData);
      
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin');
      
      return user;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  // Função de login
  const login = async (email, password) => {
    try {
      const user = await apiService.auth.login(email, password);
      
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin');
      
      return user;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  // Função de logout
  const logout = () => {
    apiService.auth.logout();
    
    setCurrentUser(null);
    setIsAdmin(false);
  };

  // Função para atualizar o perfil (adicionada)
  const updateProfile = async (userData) => {
    try {
      const updatedUser = await apiService.auth.updateUserProfile(userData);
      
      // Atualizar o estado do usuário atual
      setCurrentUser(prevUser => ({
        ...prevUser,
        ...updatedUser
      }));
      
      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  // Valores expostos pelo contexto
  const value = {
    currentUser,
    isAdmin,
    register,
    login,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;