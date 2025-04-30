// src/components/Navbar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Notifications from './Notifications';
import UserMenu from './UserMenu';
import theme from '../styles/theme';

// Estilos simplificados da navbar
const styles = {
  navbar: {
    display: 'flex',
    backgroundColor: 'white',
    boxShadow: theme.shadows.md,
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: theme.borderRadius.md,
    background: `linear-gradient(to right, ${theme.colors.primary.main}, ${theme.colors.secondary.main})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    cursor: 'pointer'
  },
  logoText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    cursor: 'pointer'
  },
  navItems: {
    display: 'flex',
    alignItems: 'center'
  },
  navMenu: {
    display: 'flex',
    marginRight: theme.spacing.xl,
    gap: theme.spacing.lg
  },
  navLink: {
    color: theme.colors.text.secondary,
    textDecoration: 'none',
    fontWeight: theme.typography.fontWeight.medium,
    fontSize: theme.typography.fontSize.md,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    transition: `all ${theme.transitions.speed.normal}`,
    cursor: 'pointer'
  },
  navLinkActive: {
    color: theme.colors.primary.main,
    backgroundColor: `${theme.colors.primary.light}20`
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md
  },
  notificationButton: {
    position: 'relative',
    backgroundColor: 'white',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows.sm,
    cursor: 'pointer'
  },
  notificationCount: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    width: '20px',
    height: '20px',
    backgroundColor: theme.colors.error.main,
    color: 'white',
    fontSize: theme.typography.fontSize.xs,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows.sm
  }
};

const Navbar = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Função para navegar para o dashboard
  const navigateToDashboard = () => {
    navigate(isAdmin ? '/admin' : '/dashboard');
  };
  
  // Verificar rota atual para destacar o link ativo
  const isActive = (path) => window.location.pathname === path;
  
  return (
    <nav style={styles.navbar}>
      <div style={styles.logoSection}>
        <div style={styles.logoIcon} onClick={navigateToDashboard}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="white">
            <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
          </svg>
        </div>
        <h1 style={styles.logoText} onClick={navigateToDashboard}>Pulse</h1>
      </div>
      
      <div style={styles.navItems}>
        <div style={styles.navMenu}>
          <a 
            style={{
              ...styles.navLink,
              ...(isActive(isAdmin ? '/admin' : '/dashboard') ? styles.navLinkActive : {})
            }}
            onClick={navigateToDashboard}
          >
            Dashboard
          </a>
          <a 
            style={{
              ...styles.navLink,
              ...(isActive('/profile') ? styles.navLinkActive : {})
            }}
            onClick={() => navigate('/profile')}
          >
            Perfil
          </a>
          {isAdmin && (
            <a 
              style={{
                ...styles.navLink,
                ...(isActive('/admin/settings') ? styles.navLinkActive : {})
              }}
              onClick={() => navigate('/admin/settings')}
            >
              Configurações
            </a>
          )}
        </div>
        
        <div style={styles.userSection}>
          <button 
            style={styles.notificationButton}
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill={theme.colors.primary.main} viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
            </svg>
            <span style={styles.notificationCount}>3</span>
          </button>
          
          {/* Agora usando o componente UserMenu */}
          <UserMenu />
        </div>
      </div>
      
      {notificationsOpen && (
        <Notifications 
          isOpen={notificationsOpen} 
          onClose={() => setNotificationsOpen(false)} 
        />
      )}
    </nav>
  );
};

export default Navbar;