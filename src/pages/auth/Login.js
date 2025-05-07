// src/pages/auth/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Estilos para a versão desktop e mobile
const styles = {
  // Container principal - vai ser ajustado com media queries
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom right, #eef2ff, #e0e7ff)',
    padding: '20px'
  },
  
  // Container da versão desktop - lado a lado
  desktopContainer: {
    display: 'flex',
    width: '900px',
    maxWidth: '100%',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  
  // Imagem lateral para desktop
  desktopImage: {
    flex: '1',
    backgroundColor: '#4f46e5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    padding: '40px'
  },
  
  desktopImageLogo: {
    width: '80px',
    height: '80px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '30px'
  },
  
  desktopImageHeading: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '16px',
    textAlign: 'center'
  },
  
  desktopImageText: {
    fontSize: '16px',
    textAlign: 'center',
    opacity: '0.9',
    lineHeight: '1.5'
  },
  
  // Container do formulário - usado nas duas versões
  formContainer: {
    backgroundColor: 'white',
    padding: '40px',
    width: '100%',
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  
  // Mobile formulário - ocupa toda a tela
  mobileFormContainer: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'white',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderRadius: '12px',
    padding: '30px'
  },
  
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px'
  },
  
  logoIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    background: 'linear-gradient(to right, #4f46e5, #7e22ce)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '8px',
    color: '#111827'
  },
  
  subtitle: {
    fontSize: '14px',
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '32px'
  },
  
  formGroup: {
    marginBottom: '20px'
  },
  
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '16px'
  },
  
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    background: 'linear-gradient(to right, #4f46e5, #7e22ce)',
    color: 'white',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '8px'
  },
  
  buttonDisabled: {
    opacity: '0.7',
    cursor: 'not-allowed'
  },
  
  error: {
    backgroundColor: '#fee2e2',
    borderLeft: '4px solid #ef4444',
    color: '#b91c1c',
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '4px'
  },
  
  registerSection: {
    marginTop: '24px',
    textAlign: 'center',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '16px'
  },
  
  registerText: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '12px'
  },
  
  registerLink: {
    display: 'inline-block',
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    color: '#374151',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const navigate = useNavigate();
  
  // Use o hook useAuth para acessar o contexto
  const { login } = useAuth();
  
  // Efeito para detectar mudanças no tamanho da tela
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const isDesktop = windowWidth >= 768; // Ponto de quebra para desktop
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Usar o método de login do novo contexto
      const user = await login(email, password);
      
      // Se o login for bem-sucedido, redirecionar com base no papel do usuário
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro de login:', error);
      
      // Mensagem de erro genérica para manter a simplicidade
      setError('Email ou senha incorretos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Conteúdo do formulário de login
  const loginForm = (
    <>
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20" fill="white">
            <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
          </svg>
        </div>
      </div>
      
      <h2 style={styles.title}>Pulse</h2>
      <p style={styles.subtitle}>Faça login para acessar seu espaço</p>
      
      <form onSubmit={handleSubmit}>
        {error && <div style={styles.error}>{error}</div>}
        
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>
        
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
          disabled={loading}
        >
          {loading ? 'Processando...' : 'Entrar'}
        </button>
      </form>
      
      <div style={styles.registerSection}>
        <p style={styles.registerText}>
          Ainda não tem uma conta?
        </p>
        <Link 
          to="/register" 
          style={styles.registerLink}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
        >
          Criar uma conta
        </Link>
      </div>
    </>
  );

  // Interface desktop com duas colunas
  if (isDesktop) {
    return (
      <div style={styles.container}>
        <div style={styles.desktopContainer}>
          <div style={styles.desktopImage}>
            <div style={styles.desktopImageLogo}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 20 20" fill="white">
                <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
              </svg>
            </div>
            <h2 style={styles.desktopImageHeading}>Bem-vindo ao Pulse</h2>
            <p style={styles.desktopImageText}>
              Sua plataforma completa para monitoramento de clima organizacional.
              Acompanhe o progresso da sua equipe e mantenha todos motivados.
            </p>
          </div>
          <div style={styles.formContainer}>
            {loginForm}
          </div>
        </div>
      </div>
    );
  }

  // Interface mobile simplificada
  return (
    <div style={styles.container}>
      <div style={styles.mobileFormContainer}>
        {loginForm}
      </div>
    </div>
  );
};

export default Login;