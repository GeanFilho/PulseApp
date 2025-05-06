// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Importar páginas
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import EmployeeDashboard from './pages/employee/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminSettings from './pages/admin/Settings';
import ProfilePage from './pages/ProfilePage';

// Função para inicializar os valores do localStorage necessários para o funcionamento correto
const initializeAppData = () => {
  // Inicializar a contagem de usuários simulados
  if (!localStorage.getItem('simulatedUserCount') || isNaN(parseInt(localStorage.getItem('simulatedUserCount')))) {
    console.log('Inicializando contagem de usuários simulados com valor padrão: 3');
    localStorage.setItem('simulatedUserCount', '3');
  } else {
    console.log('Contagem de usuários simulados já existe:', localStorage.getItem('simulatedUserCount'));
  }

  // Inicializar a lista de usuários ocultos se não existir
  if (!localStorage.getItem('hiddenUsers')) {
    console.log('Inicializando lista de usuários ocultos');
    localStorage.setItem('hiddenUsers', JSON.stringify([]));
  }

  // Inicializar a lista de feedbacks ocultos se não existir
  if (!localStorage.getItem('hiddenFeedbacks')) {
    console.log('Inicializando lista de feedbacks ocultos');
    localStorage.setItem('hiddenFeedbacks', JSON.stringify([]));
  }
};

// Componente para rotas protegidas
const PrivateRoute = ({ element, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Se não estiver autenticado, redireciona para login
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  // Se a rota exigir admin e o usuário não for admin
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  // Se estiver tudo certo, renderiza o componente
  return element;
};

// Componente principal da aplicação
function App() {
  // Inicializar dados do aplicativo quando o componente for montado
  useEffect(() => {
    initializeAppData();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rotas protegidas para funcionários */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute 
                element={<EmployeeDashboard />} 
              />
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <PrivateRoute 
                element={<ProfilePage />} 
              />
            } 
          />
          
          {/* Rotas protegidas para administradores */}
          <Route 
            path="/admin" 
            element={
              <PrivateRoute 
                element={<AdminDashboard />} 
                requireAdmin={true}
              />
            } 
          />
          
          <Route 
            path="/admin/settings" 
            element={
              <PrivateRoute 
                element={<AdminSettings />} 
                requireAdmin={true}
              />
            } 
          />
          
          {/* Redirecionar raiz para login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Página 404 - rota não encontrada */}
          <Route path="*" element={
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100vh',
              textAlign: 'center',
              padding: '20px'
            }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>404 - Página não encontrada</h1>
              <p style={{ fontSize: '1.2rem', marginBottom: '24px' }}>
                A página que você está procurando não existe ou foi movida.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Voltar para a página inicial
              </button>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;