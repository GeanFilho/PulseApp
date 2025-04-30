// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ element, requireAdmin = false }) => {
  const { currentUser, isAdmin } = useAuth();
  
  // Se não estiver autenticado, redireciona para login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Se a rota exigir admin e o usuário não for admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  // Se estiver tudo certo, renderiza o componente
  return element;
};

export default PrivateRoute;