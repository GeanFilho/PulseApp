// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#e0e7ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#4f46e5',
    marginRight: '24px',
  },
  uploadButton: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

const ProfilePage = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    phone: '',
    notificationPreferences: {
      email: true,
      push: true,
      weekly: true,
    },
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  
  useEffect(() => {
    // Simulação de carregamento dos dados do usuário
    if (currentUser) {
      // Em uma aplicação real, você buscaria essas informações da API
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        department: 'Desenvolvimento',
        position: 'Desenvolvedor Front-end',
        phone: '(11) 98765-4321',
        notificationPreferences: {
          email: true,
          push: true,
          weekly: true,
        },
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
  
  const handleNotificationChange = (type) => {
    setFormData({
      ...formData,
      notificationPreferences: {
        ...formData.notificationPreferences,
        [type]: !formData.notificationPreferences[type],
      },
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aqui seria implementada a lógica para salvar os dados
    console.log('Dados a serem salvos:', formData);
    
    // Simulação de sucesso
    setStatus({ 
      type: 'success', 
      message: 'Perfil atualizado com sucesso!' 
    });
    
    // Limpa a mensagem após 3 segundos
    setTimeout(() => {
      setStatus({ type: '', message: '' });
    }, 3000);
  };
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Perfil de Usuário</h1>
        <p style={styles.subtitle}>Atualize suas informações pessoais e preferências</p>
      </div>
      
      {status.message && (
        <div style={styles[status.type]}>
          {status.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Informações Pessoais</h2>
          
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              {getInitials(formData.name)}
            </div>
            <button type="button" style={styles.uploadButton}>
              Alterar foto
            </button>
          </div>
          
          <div style={styles.formRow}>
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
          </div>
          
          <div style={styles.formRow}>
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
                <option value="Desenvolvimento">Desenvolvimento</option>
                <option value="Marketing">Marketing</option>
                <option value="RH">RH</option>
                <option value="Vendas">Vendas</option>
                <option value="Financeiro">Financeiro</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="position">Cargo</label>
              <input
                type="text"
                id="position"
                name="position"
                style={styles.input}
                value={formData.position}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="phone">Telefone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              style={styles.input}
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Preferências de Notificação</h2>
          
          <div style={{...styles.formGroup, display: 'flex', gap: '16px', flexDirection: 'column'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
              <input
                type="checkbox"
                checked={formData.notificationPreferences.email}
                onChange={() => handleNotificationChange('email')}
              />
              Receber notificações por email
            </label>
            
            <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
              <input
                type="checkbox"
                checked={formData.notificationPreferences.push}
                onChange={() => handleNotificationChange('push')}
              />
              Receber notificações push
            </label>
            
            <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
              <input
                type="checkbox"
                checked={formData.notificationPreferences.weekly}
                onChange={() => handleNotificationChange('weekly')}
              />
              Receber resumo semanal de atividades
            </label>
          </div>
        </div>
        
        <div style={{marginTop: '24px', display: 'flex'}}>
          <button type="submit" style={styles.saveButton}>
            Salvar Alterações
          </button>
          <button type="button" style={styles.cancelButton} onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;