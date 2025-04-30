// src/pages/admin/Settings.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import theme from '../../styles/theme';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.colors.background.default
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl
  },
  pageTitle: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    margin: 0
  },
  settingsCard: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    boxShadow: theme.shadows.md
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.secondary.main,
    marginTop: 0,
    marginBottom: theme.spacing.lg
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing.xl
  },
  formGroup: {
    marginBottom: theme.spacing.lg
  },
  label: {
    display: 'block',
    marginBottom: theme.spacing.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary
  },
  input: {
    width: '100%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.grey[300]}`,
    fontSize: theme.typography.fontSize.md
  },
  select: {
    width: '100%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.grey[300]}`,
    backgroundColor: 'white',
    fontSize: theme.typography.fontSize.md
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm
  },
  checkboxLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    cursor: 'pointer'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl
  },
  cancelButton: {
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    border: `1px solid ${theme.colors.grey[300]}`,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'white',
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    cursor: 'pointer'
  },
  saveButton: {
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.secondary.main,
    color: 'white',
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    cursor: 'pointer'
  },
  successMessage: {
    padding: theme.spacing.md,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: theme.colors.success.dark,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md
  },
  successIcon: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableHeader: {
    backgroundColor: theme.colors.primary.light + '20',
    padding: theme.spacing.md,
    borderBottom: `1px solid ${theme.colors.grey[300]}`,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  tableCell: {
    padding: theme.spacing.md,
    borderBottom: `1px solid ${theme.colors.grey[200]}`,
  }
};

const AdminSettings = () => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  
  // Estados para as configurações
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'ProfitLabs',
    feedbackFrequency: 'weekly',
    reminderDay: 'friday',
    allowAnonymous: true,
    requireApproval: false
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    sendEmailReminders: true,
    sendPushNotifications: true,
    alertLowParticipation: true,
    alertNegativeTrends: true
  });
  
  // Lista de departamentos para demonstração
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Desenvolvimento', manager: 'João Silva', memberCount: 12 },
    { id: 2, name: 'Marketing', manager: 'Ana Oliveira', memberCount: 8 },
    { id: 3, name: 'RH', manager: 'Maria Santos', memberCount: 5 },
    { id: 4, name: 'Vendas', manager: 'Roberto Alves', memberCount: 10 },
    { id: 5, name: 'Financeiro', manager: 'Fernanda Costa', memberCount: 6 }
  ]);
  
  // Handler para mudanças nas configurações gerais
  const handleGeneralChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handler para mudanças nas configurações de notificação
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };
  
  // Simulação de salvar as configurações
  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar no backend
    console.log('Salvando configurações:', { generalSettings, notificationSettings });
    
    setSaved(true);
    
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };
  
  return (
    <div style={styles.container}>
      <Navbar />
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Configurações do Sistema</h1>
        </div>
        
        {saved && (
          <div style={styles.successMessage}>
            <div style={styles.successIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={theme.colors.success.dark} viewBox="0 0 16 16">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
              </svg>
            </div>
            Configurações salvas com sucesso!
          </div>
        )}
        
        <div style={styles.settingsCard}>
          <h2 style={styles.cardTitle}>Configurações Gerais</h2>
          
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="companyName">Nome da Empresa</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={generalSettings.companyName}
                onChange={handleGeneralChange}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="feedbackFrequency">Frequência do Feedback</label>
              <select
                id="feedbackFrequency"
                name="feedbackFrequency"
                value={generalSettings.feedbackFrequency}
                onChange={handleGeneralChange}
                style={styles.select}
              >
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="biweekly">Quinzenal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="reminderDay">Dia do Lembrete</label>
              <select
                id="reminderDay"
                name="reminderDay"
                value={generalSettings.reminderDay}
                onChange={handleGeneralChange}
                style={styles.select}
              >
                <option value="monday">Segunda-feira</option>
                <option value="tuesday">Terça-feira</option>
                <option value="wednesday">Quarta-feira</option>
                <option value="thursday">Quinta-feira</option>
                <option value="friday">Sexta-feira</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Opções Adicionais</label>
              
              <div style={styles.checkbox}>
                <input
                  type="checkbox"
                  id="allowAnonymous"
                  name="allowAnonymous"
                  checked={generalSettings.allowAnonymous}
                  onChange={handleGeneralChange}
                />
                <label style={styles.checkboxLabel} htmlFor="allowAnonymous">
                  Permitir feedback anônimo
                </label>
              </div>
              
              <div style={styles.checkbox}>
                <input
                  type="checkbox"
                  id="requireApproval"
                  name="requireApproval"
                  checked={generalSettings.requireApproval}
                  onChange={handleGeneralChange}
                />
                <label style={styles.checkboxLabel} htmlFor="requireApproval">
                  Exigir aprovação para feedback público
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.settingsCard}>
          <h2 style={styles.cardTitle}>Configurações de Notificação</h2>
          
          <div style={styles.formGroup}>
            <div style={styles.checkbox}>
              <input
                type="checkbox"
                id="sendEmailReminders"
                name="sendEmailReminders"
                checked={notificationSettings.sendEmailReminders}
                onChange={handleNotificationChange}
              />
              <label style={styles.checkboxLabel} htmlFor="sendEmailReminders">
                Enviar lembretes por e-mail
              </label>
            </div>
            
            <div style={styles.checkbox}>
              <input
                type="checkbox"
                id="sendPushNotifications"
                name="sendPushNotifications"
                checked={notificationSettings.sendPushNotifications}
                onChange={handleNotificationChange}
              />
              <label style={styles.checkboxLabel} htmlFor="sendPushNotifications">
                Enviar notificações push
              </label>
            </div>
            
            <div style={styles.checkbox}>
              <input
                type="checkbox"
                id="alertLowParticipation"
                name="alertLowParticipation"
                checked={notificationSettings.alertLowParticipation}
                onChange={handleNotificationChange}
              />
              <label style={styles.checkboxLabel} htmlFor="alertLowParticipation">
                Alertar sobre baixa participação
              </label>
            </div>
            
            <div style={styles.checkbox}>
              <input
                type="checkbox"
                id="alertNegativeTrends"
                name="alertNegativeTrends"
                checked={notificationSettings.alertNegativeTrends}
                onChange={handleNotificationChange}
              />
              <label style={styles.checkboxLabel} htmlFor="alertNegativeTrends">
                Alertar sobre tendências negativas
              </label>
            </div>
          </div>
        </div>
        
        <div style={styles.settingsCard}>
          <h2 style={styles.cardTitle}>Gerenciamento de Departamentos</h2>
          
          <div style={{
            overflowX: 'auto',
            marginBottom: theme.spacing.lg
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: theme.typography.fontSize.md
            }}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Nome do Departamento</th>
                  <th style={styles.tableHeader}>Gerente</th>
                  <th style={styles.tableHeader}>Número de Membros</th>
                  <th style={styles.tableHeader}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(dept => (
                  <tr key={dept.id}>
                    <td style={styles.tableCell}>{dept.name}</td>
                    <td style={styles.tableCell}>{dept.manager}</td>
                    <td style={styles.tableCell}>{dept.memberCount}</td>
                    <td style={styles.tableCell}>
                      <button 
                        style={{
                          backgroundColor: theme.colors.primary.main,
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: theme.borderRadius.sm,
                          marginRight: theme.spacing.sm,
                          cursor: 'pointer'
                        }}
                      >
                        Editar
                      </button>
                      <button 
                        style={{
                          backgroundColor: 'white',
                          color: theme.colors.error.main,
                          border: `1px solid ${theme.colors.error.main}`,
                          padding: '6px 12px',
                          borderRadius: theme.borderRadius.sm,
                          cursor: 'pointer'
                        }}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button 
            style={{
              backgroundColor: theme.colors.primary.main,
              color: 'white',
              border: 'none',
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer'
            }}
          >
            Adicionar Departamento
          </button>
        </div>
        
        <div style={styles.buttonGroup}>
          <button 
            style={styles.cancelButton}
            onClick={() => navigate('/admin')}
          >
            Cancelar
          </button>
          <button 
            style={styles.saveButton}
            onClick={handleSave}
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;