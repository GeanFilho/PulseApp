// src/pages/auth/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
    maxWidth: '500px'
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
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
  select: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
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
    marginTop: '12px'
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
  success: {
    backgroundColor: '#d1fae5',
    borderLeft: '4px solid #10b981',
    color: '#065f46',
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '4px'
  },
  loginSection: {
    marginTop: '24px',
    textAlign: 'center',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '16px'
  },
  loginText: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '12px'
  },
  loginLink: {
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

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Desenvolvimento',
    role: 'employee' // Valor padrão é funcionário
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Por favor, informe seu nome completo');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Por favor, informe seu e-mail');
      return false;
    }
    
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Por favor, informe um e-mail válido');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Registrar o usuário usando o novo contexto de autenticação
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        role: formData.role
      };
      
      await register(userData);
      
      setSuccess('Conta criada com sucesso! Redirecionando...');
      
      // Redirecionar após um breve atraso
      setTimeout(() => {
        if (formData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (error) {
      console.error('Erro no registro:', error);
      
      if (error.message && error.message.includes('já está em uso')) {
        setError('Este e-mail já está em uso. Por favor, use outro e-mail ou faça login.');
      } else {
        setError('Falha no registro. Por favor, tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
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
        
        <h2 style={styles.title}>Criar Conta</h2>
        <p style={styles.subtitle}>Preencha os campos abaixo para se registrar no Pulse</p>
        
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">Nome Completo *</label>
            <input
              id="name"
              type="text"
              name="name"
              style={styles.input}
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="password">Senha *</label>
              <input
                id="password"
                type="password"
                name="password"
                style={styles.input}
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="confirmPassword">Confirmar Senha *</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                style={styles.input}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                required
              />
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="department">Departamento *</label>
            <select
              id="department"
              name="department"
              style={styles.select}
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="Desenvolvimento">Desenvolvimento</option>
              <option value="Marketing">Marketing</option>
              <option value="RH">RH</option>
              <option value="Vendas">Vendas</option>
              <option value="Financeiro">Financeiro</option>
            </select>
          </div>
          
          {/* Campo para selecionar a função (employee ou admin) */}
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="role">Função *</label>
            <select
              id="role"
              name="role"
              style={styles.select}
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="employee">Funcionário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? 'Processando...' : 'Criar Conta'}
          </button>
        </form>
        
        <div style={styles.loginSection}>
          <p style={styles.loginText}>
            Já tem uma conta?
          </p>
          <Link 
            to="/login" 
            style={styles.loginLink}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            Fazer Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;