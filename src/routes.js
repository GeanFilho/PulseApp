import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Importações
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminSettings from './pages/admin/Settings';
import EmployeeDashboard from './pages/employee/Dashboard';

// Componente para rotas protegidas
const PrivateRoute = ({ element, requiredRole }) => {
  const { currentUser, isAdmin } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/unauthorized" />;
  }
  
  return element;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route 
        path="/admin" 
        element={<PrivateRoute element={<AdminDashboard />} requiredRole="admin" />} 
      />
      
      <Route 
        path="/admin/settings" 
        element={<PrivateRoute element={<AdminSettings />} requiredRole="admin" />} 
      />
      
      <Route 
        path="/dashboard" 
        element={<PrivateRoute element={<EmployeeDashboard />} requiredRole="employee" />} 
      />
      
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;