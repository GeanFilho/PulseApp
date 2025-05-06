// src/components/UserMenu.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';

const styles = {
  userMenuContainer: {
    position: 'relative'
  },
  userButton: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    transition: `background-color ${theme.transitions.speed.normal}`
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${theme.colors.info.light}20` // Fundo claro como fallback
  },
  userAvatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  userAvatarFallback: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.info.main
  },
  userName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary
  },
  userRole: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary
  },
  userMenu: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    boxShadow: theme.shadows.lg,
    width: '200px',
    zIndex: 200,
    overflow: 'hidden'
  },
  menuItem: {
    padding: theme.spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    color: theme.colors.text.primary,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: `background-color ${theme.transitions.speed.normal}`
  },
  menuItemHover: {
    backgroundColor: theme.colors.grey[100]
  },
  menuDivider: {
    height: '1px',
    backgroundColor: theme.colors.grey[200],
    margin: `${theme.spacing.xs} 0`
  },
  logoutItem: {
    color: theme.colors.error.main
  }
};

const UserMenu = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  // URLs de avatares padrão
  const maleAvatarUrl = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  const femaleAvatarUrl = 'https://cdn-icons-png.flaticon.com/512/3135/3135789.png';
  
  // Função para obter as iniciais do usuário (como fallback)
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Função para lidar com o logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determinar a URL do avatar com base no gênero
  const getAvatarUrl = () => {
    if (currentUser?.avatarUrl) {
      return currentUser.avatarUrl;
    }
    
    return currentUser?.gender === 'female' ? femaleAvatarUrl : maleAvatarUrl;
  };
  
  return (
    <div style={styles.userMenuContainer}>
      <button 
        style={styles.userButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={styles.userAvatar}>
          {currentUser?.avatarUrl || currentUser?.gender ? (
            <img 
              src={getAvatarUrl()} 
              alt={`Avatar de ${currentUser?.name || 'usuário'}`}
              style={styles.userAvatarImage}
            />
          ) : (
            <span style={styles.userAvatarFallback}>
              {getInitials(currentUser?.name)}
            </span>
          )}
        </div>
        <div>
          <div style={styles.userName}>{currentUser?.name || 'Usuário'}</div>
          <div style={styles.userRole}>{isAdmin ? 'Administrador' : 'Funcionário'}</div>
        </div>
      </button>
      
      {isOpen && (
        <div style={styles.userMenu}>
          <div 
            style={styles.menuItem}
            onClick={() => {
              navigate('/profile');
              setIsOpen(false);
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.grey[100]}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={theme.colors.grey[500]} viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
            Meu Perfil
          </div>
          
          {isAdmin && (
            <div 
              style={styles.menuItem}
              onClick={() => {
                navigate('/admin/settings');
                setIsOpen(false);
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.grey[100]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={theme.colors.grey[500]} viewBox="0 0 16 16">
                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/>
              </svg>
              Configurações
            </div>
          )}
          
          <div style={styles.menuDivider}></div>
          
          <div 
            style={{...styles.menuItem, ...styles.logoutItem}}
            onClick={handleLogout}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.grey[100]}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={theme.colors.error.main} viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
            Sair
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;