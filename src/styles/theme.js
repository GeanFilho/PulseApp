// src/styles/theme.js
const themeColors = {
    // Cores principais
    primary: {
      light: '#6366f1',
      main: '#4f46e5',
      dark: '#4338ca',
      contrastText: '#ffffff'
    },
    secondary: {
      light: '#9333ea',
      main: '#7e22ce',
      dark: '#6b21a8',
      contrastText: '#ffffff'
    },
    success: {
      light: '#10b981',
      main: '#059669',
      dark: '#047857',
      contrastText: '#ffffff'
    },
    warning: {
      light: '#f59e0b',
      main: '#d97706',
      dark: '#b45309',
      contrastText: '#ffffff'
    },
    error: {
      light: '#ef4444',
      main: '#dc2626',
      dark: '#b91c1c',
      contrastText: '#ffffff'
    },
    info: {
      light: '#3b82f6',
      main: '#2563eb',
      dark: '#1d4ed8',
      contrastText: '#ffffff'
    },
    
    // Tons neutros
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },
    
    // Outras cores
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
      sidebar: 'linear-gradient(to bottom, #4f46e5, #7e22ce)'
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      disabled: '#9ca3af',
      hint: '#6b7280'
    },
    divider: '#e5e7eb'
  };
  
  // Variáveis de espaçamento e tamanhos
  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  };
  
  // Configurações de sombras
  const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  };
  
  // Configurações de bordas arredondadas
  const borderRadius = {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  };
  
  // Configurações de fontes
  const typography = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      md: '1rem',      // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      xxl: '1.5rem',   // 24px
      xxxl: '1.875rem', // 30px
      huge: '2.25rem'  // 36px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  };
  
  // Configurações de animações
  const transitions = {
    speed: {
      slow: '0.3s',
      normal: '0.2s',
      fast: '0.1s'
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    }
  };
  
  // Componentes comuns - estilos reutilizáveis
  const components = {
    card: {
      container: {
        backgroundColor: 'white',
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        boxShadow: shadows.md
      },
      title: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: themeColors.text.primary,
        marginTop: 0,
        marginBottom: spacing.md
      }
    },
    button: {
      primary: {
        backgroundColor: themeColors.primary.main,
        color: themeColors.primary.contrastText,
        border: 'none',
        padding: `${spacing.md} ${spacing.xl}`,
        borderRadius: borderRadius.md,
        fontWeight: typography.fontWeight.medium,
        cursor: 'pointer',
        transition: `background-color ${transitions.speed.normal} ${transitions.easing.easeInOut}`,
        '&:hover': {
          backgroundColor: themeColors.primary.dark
        }
      },
      secondary: {
        backgroundColor: 'white',
        color: themeColors.grey[700],
        border: `1px solid ${themeColors.grey[300]}`,
        padding: `${spacing.md} ${spacing.xl}`,
        borderRadius: borderRadius.md,
        fontWeight: typography.fontWeight.medium,
        cursor: 'pointer',
        transition: `background-color ${transitions.speed.normal} ${transitions.easing.easeInOut}`,
        '&:hover': {
          backgroundColor: themeColors.grey[100]
        }
      }
    },
    input: {
      container: {
        marginBottom: spacing.lg
      },
      label: {
        display: 'block',
        marginBottom: spacing.sm,
        fontWeight: typography.fontWeight.medium,
        color: themeColors.text.primary
      },
      field: {
        width: '100%',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        border: `1px solid ${themeColors.grey[300]}`,
        fontSize: typography.fontSize.md,
        transition: `border-color ${transitions.speed.normal} ${transitions.easing.easeInOut}`,
        '&:focus': {
          outline: 'none',
          borderColor: themeColors.primary.main
        }
      }
    }
  };
  
  // Exportar tema completo
  const theme = {
    colors: themeColors,
    spacing,
    shadows,
    borderRadius,
    typography,
    transitions,
    components
  };
  
  export default theme;