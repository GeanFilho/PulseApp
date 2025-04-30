import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import EmployeeDashboard from './pages/employee/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
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
          <Route 
            path="/admin" 
            element={
              <PrivateRoute 
                element={<AdminDashboard />} 
                requireAdmin={true}
              />
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
    
  );
}

export default App;