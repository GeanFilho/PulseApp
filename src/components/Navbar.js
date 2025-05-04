// src/components/Navbar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  }
};

const Navbar = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
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
          {/* UserMenu é mantido, apenas removemos o componente de notificações */}
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;