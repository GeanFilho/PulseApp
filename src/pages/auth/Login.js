// src/pages/auth/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Estilos inline para o componente de login
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom right, #eef2ff, #e0e7ff)',
    padding: '20px'
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    width: '100%',
    maxWidth: '400px'
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
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  checkbox: {
    marginRight: '8px'
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#374151'
  },
  forgotPassword: {
    fontSize: '14px',
    color: '#4f46e5',
    textDecoration: 'none'
  },
  demoSection: {
    marginTop: '24px',
    textAlign: 'center',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '16px'
  },
  demoText: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '8px'
  },
  demoButtons: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center'
  },
  demoButton: {
    fontSize: '12px',
    padding: '8px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#374151'
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
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  // Use o hook useAuth para acessar o contexto
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Usar o método de login do Firebase através do contexto
      const user = await login(email, password);
      
      // Se o login for bem-sucedido, redirecionar com base no papel do usuário
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro de login:', error);
      
      // Mensagens de erro mais específicas baseadas no código de erro do Firebase
      if (error.message.includes('user-not-found') || error.message.includes('wrong-password')) {
        setError('Email ou senha incorretos. Por favor, tente novamente.');
      } else if (error.message.includes('too-many-requests')) {
        setError('Muitas tentativas de login. Por favor, tente novamente mais tarde.');
      } else {
        setError('Falha no login. Por favor, verifique suas credenciais.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Para fins de demonstração
  const handleDemoLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@exemplo.com');
      setPassword('senha123');
    } else {
      setEmail('usuario@exemplo.com');
      setPassword('senha123');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
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
          
          <div style={styles.flexBetween}>
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="remember"
                style={styles.checkbox}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label style={styles.checkboxLabel} htmlFor="remember">Lembrar-me</label>
            </div>
            
            <a href="#" style={styles.forgotPassword}>Esqueceu a senha?</a>
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
        
        <div style={styles.demoSection}>
          <p style={styles.demoText}>Demo (para fins de teste):</p>
          <div style={styles.demoButtons}>
            <button
              style={styles.demoButton}
              onClick={() => handleDemoLogin('admin')}
              type="button"
            >
              Login como Admin
            </button>
            <button
              style={styles.demoButton}
              onClick={() => handleDemoLogin('employee')}
              type="button"
            >
              Login como Funcionário
            </button>
          </div>
        </div>
        
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
      </div>
    </div>
  );
};

export default Login;