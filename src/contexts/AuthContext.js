import React, { createContext, useState, useContext, useEffect } from 'react';

// Cria o contexto
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

  // Estado para simular a autenticação de usuário
  const [isAdmin, setIsAdmin] = useState(false);

  // Função de login
  const login = async (email, password) => {
    try {
      // Simulação simples de autenticação - em um ambiente real, isso seria uma chamada à API
      console.log("Tentando login com:", email, password);
      
      let user = null;
      
      if (email === 'admin@exemplo.com') {
        user = {
          id: 1,
          name: 'Admin',
          email: 'admin@exemplo.com',
          role: 'admin'
        };
        setIsAdmin(true);
      } else if (email === 'usuario@exemplo.com') {
        user = {
          id: 2,
          name: 'Usuário',
          email: 'usuario@exemplo.com',
          role: 'employee'
        };
        setIsAdmin(false);
      } else {
        // Para facilitar testes, vamos aceitar qualquer email/senha
        user = {
          id: 3,
          name: 'Usuário Teste',
          email: email,
          role: 'employee'
        };
        setIsAdmin(false);
      }
      
      // Salva o usuário
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAdmin(false);
  };

  // Verifica se o usuário já está logado (ao carregar a página)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin');
    }
    
    setLoading(false);
  }, []);

  // Valores expostos pelo contexto
  const value = {
    currentUser,
    isAdmin,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;