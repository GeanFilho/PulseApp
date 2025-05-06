// src/pages/admin/Settings.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import apiService from '../../services/apiService';
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
  infoBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.info.light + '10',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
    borderLeft: `4px solid ${theme.colors.info.main}`
  },
  infoTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.info.main,
    margin: 0
  },
  infoText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    margin: 0
  },
  infoList: {
    margin: `${theme.spacing.sm} 0`,
    paddingLeft: theme.spacing.xl
  },
  infoListItem: {
    margin: `${theme.spacing.xs} 0`,
    color: theme.colors.text.secondary
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
  },
  addDepartmentForm: {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl
  },
  addButton: {
    backgroundColor: theme.colors.primary.main,
    color: 'white',
    border: 'none',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer'
  },
  removeButton: {
    backgroundColor: theme.colors.error.main,
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: theme.borderRadius.sm,
    cursor: 'pointer'
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: `2px solid ${theme.colors.grey[200]}`,
    borderTop: `2px solid ${theme.colors.primary.main}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: theme.spacing.sm
  }
};

const AdminSettings = () => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Estados para as configurações
  const [companyName, setCompanyName] = useState('ProfitLabs');
  
  // Estado para novo departamento
  const [newDepartment, setNewDepartment] = useState('');
  
  // Lista de departamentos
  const [departments, setDepartments] = useState([]);
  const [departmentLoading, setDepartmentLoading] = useState(false);
  const [departmentActionId, setDepartmentActionId] = useState(null);
  
  // Buscar configurações iniciais
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Carregar nome da empresa do localStorage
        const savedCompanyName = localStorage.getItem('companyName');
        if (savedCompanyName) {
          setCompanyName(savedCompanyName);
        } else {
          // Valor padrão se não tiver sido salvo ainda
          setCompanyName('ProfitLabs');
          localStorage.setItem('companyName', 'ProfitLabs');
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };
    
    // Buscar departamentos
    const fetchDepartments = async () => {
      try {
        setDepartmentLoading(true);
        
        // Carregar departamentos do localStorage
        const savedDepartments = localStorage.getItem('departments');
        
        if (savedDepartments) {
          // Usar departamentos salvos se existirem
          setDepartments(JSON.parse(savedDepartments));
          setDepartmentLoading(false);
        } else {
          // Dados iniciais padrão se não houver nada salvo
          const defaultDepartments = [
            { id: 1, name: 'Gestão Empresarial' },
            { id: 2, name: 'TI' },
            { id: 3, name: 'Copywriters' },
            { id: 4, name: 'Gestão de Tráfego' },
            { id: 5, name: 'Edição de Vídeo' },
            { id: 6, name: 'Email Marketing' },
            { id: 7, name: 'Assistentes' }
          ];
          
          setDepartments(defaultDepartments);
          localStorage.setItem('departments', JSON.stringify(defaultDepartments));
          setDepartmentLoading(false);
        }
      } catch (error) {
        console.error('Erro ao carregar departamentos:', error);
        setDepartmentLoading(false);
      }
    };
    
    fetchSettings();
    fetchDepartments();
  }, []);
  
  // Adicionar departamento
  const handleAddDepartment = () => {
    if (!newDepartment.trim()) return;
    
    setDepartmentLoading(true);
    
    // Simulação da chamada para API
    setTimeout(() => {
      // Gerar ID único (em produção, o backend faria isso)
      const id = Math.max(...departments.map(d => d.id), 0) + 1;
      
      // Criar novo array de departamentos
      const updatedDepartments = [...departments, { id, name: newDepartment }];
      
      // Atualizar estado
      setDepartments(updatedDepartments);
      
      // Salvar no localStorage para persistência
      localStorage.setItem('departments', JSON.stringify(updatedDepartments));
      
      // Limpar campo
      setNewDepartment('');
      setDepartmentLoading(false);
      
      // Mostrar feedback visual
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };
  
  // Remover departamento
  const handleRemoveDepartment = (id) => {
    setDepartmentActionId(id);
    setDepartmentLoading(true);
    
    // Simulação da chamada para API
    setTimeout(() => {
      // Filtrar para remover o departamento
      const updatedDepartments = departments.filter(dept => dept.id !== id);
      
      // Atualizar estado
      setDepartments(updatedDepartments);
      
      // Salvar no localStorage para persistência
      localStorage.setItem('departments', JSON.stringify(updatedDepartments));
      
      setDepartmentLoading(false);
      setDepartmentActionId(null);
      
      // Mostrar feedback visual
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };
  
  // Salvar configurações gerais
  const handleSave = () => {
    setLoading(true);
    
    // Simulação de chamada para API
    setTimeout(() => {
      // Salvar nome da empresa no localStorage
      localStorage.setItem('companyName', companyName);
      
      console.log('Salvando configurações:', { companyName });
      
      setLoading(false);
      setSaved(true);
      
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    }, 800);
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
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="companyName">Nome da Empresa</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              style={styles.input}
            />
          </div>
          
          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>Funções Administrativas Disponíveis</h3>
            <p style={styles.infoText}>
              Nesta página de configurações, você como administrador pode realizar as seguintes atividades:
            </p>
            <ul style={styles.infoList}>
              <li style={styles.infoListItem}>Alterar o nome da empresa exibido em todo o sistema</li>
              <li style={styles.infoListItem}>Gerenciar departamentos - adicionar novos ou remover existentes</li>
              <li style={styles.infoListItem}>Configurar as opções disponíveis para os usuários ao se cadastrarem</li>
              <li style={styles.infoListItem}>Personalizar a estrutura organizacional da empresa no sistema</li>
              <li style={styles.infoListItem}>Definir configurações que afetam a experiência de todos os usuários</li>
            </ul>
            <p style={styles.infoText}>
              As alterações realizadas aqui serão aplicadas em todo o sistema Pulse, afetando todos os usuários.
              Certifique-se de revisar cuidadosamente antes de salvar.
            </p>
          </div>
        </div>
        
        <div style={styles.settingsCard}>
          <h2 style={styles.cardTitle}>Gerenciamento de Departamentos</h2>
          
          <div style={styles.addDepartmentForm}>
            <input
              type="text"
              placeholder="Novo departamento"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              style={{ ...styles.input, flex: 1 }}
              disabled={departmentLoading}
            />
            <button 
              style={styles.addButton}
              onClick={handleAddDepartment}
              disabled={departmentLoading || !newDepartment.trim()}
            >
              {departmentLoading ? (
                <span style={styles.loadingSpinner}></span>
              ) : 'Adicionar'}
            </button>
          </div>
          
          <div style={{
            overflowX: 'auto',
            marginBottom: theme.spacing.lg
          }}>
            {departmentLoading && !departmentActionId && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ ...styles.loadingSpinner, margin: '0 auto', width: '30px', height: '30px' }}></div>
                <p style={{ marginTop: '10px', color: theme.colors.text.secondary }}>Carregando departamentos...</p>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}
            
            {!departmentLoading && departments.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px',
                color: theme.colors.text.secondary,
                backgroundColor: theme.colors.grey[50],
                borderRadius: theme.borderRadius.md
              }}>
                Nenhum departamento cadastrado. Adicione o primeiro!
              </div>
            )}
            
            {departments.length > 0 && (
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: theme.typography.fontSize.md
              }}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Nome do Departamento</th>
                    <th style={{ ...styles.tableHeader, width: '100px', textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map(dept => (
                    <tr key={dept.id}>
                      <td style={styles.tableCell}>{dept.name}</td>
                      <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                        <button 
                          style={styles.removeButton}
                          onClick={() => handleRemoveDepartment(dept.id)}
                          disabled={departmentLoading}
                        >
                          {departmentLoading && departmentActionId === dept.id ? (
                            <span style={{ ...styles.loadingSpinner, width: '12px', height: '12px', margin: 0 }}></span>
                          ) : 'Remover'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
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
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={{ ...styles.loadingSpinner, marginRight: '8px' }}></span>
                Salvando...
              </>
            ) : 'Salvar Configurações'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;