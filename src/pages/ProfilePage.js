// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import { AlertCircle, CheckCircle } from 'lucide-react';

// Estilos inline para o componente de perfil
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '32px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#4b5563',
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#111827',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '16px',
  },
  select: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    fontSize: '16px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  saveButton: {
    padding: '12px 24px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    marginRight: '12px',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: 'white',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  success: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '24px',
  },
  avatarPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '16px'
  },
  avatarImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #e5e7eb'
  },
  avatarSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '12px'
  },
  avatarOption: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    cursor: 'pointer',
    objectFit: 'cover',
    border: '2px solid transparent',
    transition: 'all 0.2s ease'
  },
  avatarOptionSelected: {
    border: '2px solid #4f46e5',
    transform: 'scale(1.1)'
  },
  avatarName: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: '#111827'
  },
  changeAvatarButton: {
    padding: '8px 12px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#4b5563',
    marginLeft: '12px',
    transition: 'all 0.2s'
  }
};

const ProfilePage = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // URLs de avatares originais
  const maleAvatarUrl = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  const femaleAvatarUrl = 'https://cdn-icons-png.flaticon.com/512/3135/3135789.png';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    gender: 'male',
    avatarUrl: maleAvatarUrl,
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  useEffect(() => {
    // Carregar dados do usuário quando o componente é montado
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        department: currentUser.department || 'TI',
        gender: currentUser.gender || 'male',
        avatarUrl: currentUser.avatarUrl || maleAvatarUrl,
      });
    }
  }, [currentUser]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleAvatarChange = (gender) => {
    setFormData({
      ...formData,
      gender,
      avatarUrl: gender === 'male' ? maleAvatarUrl : femaleAvatarUrl
    });
  };

  const toggleAvatarSelector = () => {
    setShowAvatarSelector(!showAvatarSelector);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    
    try {
      // Verificar se há mudanças
      if (!formData.name.trim()) {
        setStatus({ 
          type: 'error', 
          message: 'Por favor, preencha seu nome completo' 
        });
        setLoading(false);
        return;
      }
      
      // Preparar dados para atualização
      const userData = {
        name: formData.name,
        department: formData.department,
        gender: formData.gender,
        avatarUrl: formData.gender === 'female' ? femaleAvatarUrl : maleAvatarUrl
      };
      
      // Chamar o serviço de API para atualizar
      await apiService.auth.updateUserProfile(userData);
      
      // Importante: Atualizar manualmente o localStorage para garantir que a navbar veja as alterações
      const currentStoredUser = localStorage.getItem('user');
      if (currentStoredUser) {
        const parsedUser = JSON.parse(currentStoredUser);
        const updatedUser = {
          ...parsedUser,
          ...userData
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Disparar um evento global para notificar outros componentes (incluindo a navbar)
        window.dispatchEvent(new Event('userProfileUpdated'));
        
        // Adicionar um log para depuração
        console.log('Perfil atualizado, novo avatar:', updatedUser.avatarUrl);
      }
      
      setStatus({ 
        type: 'success', 
        message: 'Perfil atualizado com sucesso!' 
      });
      
      // Ocultar seletor de avatar após salvar
      setShowAvatarSelector(false);
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setStatus({ 
        type: 'error', 
        message: 'Ocorreu um erro ao atualizar seu perfil. Por favor, tente novamente.' 
      });
    } finally {
      setLoading(false);
      
      // Limpar mensagem de sucesso após alguns segundos
      if (status.type === 'success') {
        setTimeout(() => {
          setStatus({ type: '', message: '' });
        }, 3000);
      }
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Perfil de Usuário</h1>
        <p style={styles.subtitle}>Atualize suas informações pessoais</p>
      </div>
      
      {status.message && (
        <div style={styles[status.type]}>
          {status.type === 'success' 
            ? <CheckCircle size={20} /> 
            : <AlertCircle size={20} />}
          {status.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Informações Pessoais</h2>
          
          <div style={styles.avatarSection}>
            <div style={styles.avatarPreview}>
              <img 
                src={formData.avatarUrl} 
                alt="Avatar" 
                style={styles.avatarImage} 
              />
              <div>
                <span style={styles.avatarName}>{formData.name || 'Seu Nome'}</span>
                <button 
                  type="button"
                  style={styles.changeAvatarButton}
                  onClick={toggleAvatarSelector}
                >
                  {showAvatarSelector ? 'Cancelar' : 'Alterar avatar'}
                </button>
              </div>
            </div>
            
            {showAvatarSelector && (
              <div style={styles.avatarSelector}>
                <img 
                  src={maleAvatarUrl} 
                  alt="Avatar Masculino" 
                  style={{
                    ...styles.avatarOption,
                    ...(formData.gender === 'male' ? styles.avatarOptionSelected : {})
                  }}
                  onClick={() => handleAvatarChange('male')}
                />
                <img 
                  src={femaleAvatarUrl} 
                  alt="Avatar Feminino" 
                  style={{
                    ...styles.avatarOption,
                    ...(formData.gender === 'female' ? styles.avatarOptionSelected : {})
                  }}
                  onClick={() => handleAvatarChange('female')}
                />
                <span style={{ marginLeft: '8px', color: '#6b7280', fontSize: '14px' }}>
                  Selecione um avatar
                </span>
              </div>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              style={styles.input}
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              style={styles.input}
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="department">Departamento</label>
            <select
              id="department"
              name="department"
              style={styles.select}
              value={formData.department}
              onChange={handleInputChange}
              required
            >
              <option value="Gestão">Gestão</option>
              <option value="TI">TI</option>
              <option value="Copywriter">Copywriter</option>
              <option value="Gestão de Tráfego">Gestão de Tráfego</option>
              <option value="Edição de Vídeo">Edição de Vídeo</option>
              <option value="Email Marketing">Email Marketing</option>
              <option value="Assistentes">Assistentes</option>
            </select>
          </div>
        </div>
        
        <div style={{marginTop: '24px', display: 'flex'}}>
          <button 
            type="submit" 
            style={{
              ...styles.saveButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button 
            type="button" 
            style={styles.cancelButton} 
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;