import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import ExportReport from '../../components/ExportReport';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [period, setPeriod] = useState('last-week');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  // Estado para armazenar os dados reais do dashboard
  const [dashboardData, setDashboardData] = useState({
    stats: {
      responseRate: 0,
      supportYesPercentage: 0,
      supportPartialPercentage: 0,
      supportNoPercentage: 0,
      totalEmployees: 0,
      pendingFeedbacks: 0
    },
    recentFeedbacks: []
  });

  // Função para buscar os dados do backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simular busca de dados - substitua pela sua API real
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      // Buscar estatísticas
      const statsResponse = await fetch(`${API_URL}/admin/stats?period=${period}`, {
        method: 'GET',
        headers
      });
      
      if (!statsResponse.ok) {
        throw new Error('Erro ao buscar estatísticas');
      }
      
      const stats = await statsResponse.json();
      
      // Buscar feedbacks recentes
      const feedbacksResponse = await fetch(`${API_URL}/admin/feedbacks/recent?limit=5`, {
        method: 'GET',
        headers
      });
      
      if (!feedbacksResponse.ok) {
        throw new Error('Erro ao buscar feedbacks recentes');
      }
      
      const recentFeedbacks = await feedbacksResponse.json();
      
      // Atualizar o estado com os dados reais
      setDashboardData({
        stats,
        recentFeedbacks
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError('Ocorreu um erro ao carregar os dados. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  // Abrir o modal de confirmação para excluir feedback
  const confirmDeleteFeedback = (feedback) => {
    setFeedbackToDelete(feedback);
    setDeleteConfirmOpen(true);
    setDeleteError(''); // Limpar erros anteriores
  };

  // Cancelar a exclusão
  const cancelDelete = () => {
    setFeedbackToDelete(null);
    setDeleteConfirmOpen(false);
  };

  // Excluir feedback
  const deleteFeedback = async () => {
    if (!feedbackToDelete) return;
    
    try {
      setDeleteLoading(true);
      setDeleteError('');
      
      console.log('Tentando excluir feedback ID:', feedbackToDelete.id);
      
      // Chamar API para excluir o feedback
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/feedback/${feedbackToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir: ${response.status} ${response.statusText}`);
      }
      
      // Fechar o modal de confirmação
      setDeleteConfirmOpen(false);
      setFeedbackToDelete(null);
      setDeleteSuccess(true);
      
      // Exibir mensagem de sucesso por 2 segundos
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 2000);
      
      // Atualizar os dados para refletir a exclusão
      await fetchDashboardData();
      
    } catch (err) {
      console.error('Erro ao excluir feedback:', err);
      setDeleteError('Ocorreu um erro ao excluir o feedback. Por favor, tente novamente.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Buscar dados ao carregar o componente ou quando o período mudar
  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  // Estilos para o dashboard
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    },
    content: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0
    },
    controls: {
      display: 'flex',
      gap: '12px'
    },
    select: {
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid #d1d5db'
    },
    exportButton: {
      backgroundColor: '#7e22ce',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer'
    },
    dashboard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    dashboardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    dashboardTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#7e22ce',
      margin: 0
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
      marginBottom: '32px'
    },
    statCard: (index) => {
      const colors = ['#eef2ff', '#f0fdfa', '#faf5ff'];
      const borderColors = ['#4f46e5', '#10b981', '#9333ea'];
      return {
        background: `linear-gradient(to bottom right, ${colors[index % 3]}, white)`,
        padding: '24px',
        borderRadius: '12px',
        borderBottom: `4px solid ${borderColors[index % 3]}`,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      };
    },
    statTitle: {
      fontSize: '16px',
      fontWeight: '500',
      marginTop: 0,
      marginBottom: '8px',
      color: '#374151'
    },
    statValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      margin: 0
    },
    statTrend: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      marginTop: '8px',
      color: '#10b981'
    },
    statDetail: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '8px'
    },
    feedbacksSection: {
      marginTop: '32px'
    },
    feedbacksTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#111827'
    },
    feedbacksList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    feedbackItem: {
      borderLeft: '4px solid #4f46e5',
      padding: '16px',
      borderRadius: '8px',
      backgroundColor: '#f9fafb',
      position: 'relative'
    },
    feedbackHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
      position: 'relative',
      paddingRight: '70px'  // Espaço para o botão de exclusão
    },
    feedbackAuthor: {
      fontWeight: '500',
      color: '#4f46e5'
    },
    feedbackDept: {
      backgroundColor: '#f3f4f6',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '14px',
      color: '#6b7280'
    },
    feedbackStats: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      marginBottom: '12px'
    },
    feedbackStat: {
      backgroundColor: '#eef2ff',
      padding: '4px 12px',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#4f46e5'
    },
    feedbackSuggestion: {
      backgroundColor: '#fff7ed',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#9a3412',
      borderLeft: '3px solid #f59e0b',
      marginTop: '12px'
    },
    deleteButton: {
      position: 'absolute',
      top: '0',
      right: '0',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '6px 12px',
      fontSize: '12px',
      cursor: 'pointer'
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '50px'
    },
    loadingSpinner: {
      border: '5px solid #f3f4f6',
      borderTop: '5px solid #4f46e5',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 20px auto'
    },
    errorContainer: {
      backgroundColor: '#fee2e2',
      padding: '16px',
      borderRadius: '8px',
      color: '#b91c1c',
      marginBottom: '24px'
    },
    successContainer: {
      backgroundColor: '#d1fae5',
      padding: '16px',
      borderRadius: '8px',
      color: '#065f46',
      marginBottom: '24px'
    },
    retryButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      marginTop: '8px'
    },
    emptyState: {
      padding: '24px',
      textAlign: 'center',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      color: '#6b7280'
    },
    // Estilos para o modal de confirmação
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#111827'
    },
    modalText: {
      marginBottom: '24px',
      color: '#4b5563'
    },
    modalError: {
      color: '#b91c1c',
      marginBottom: '16px',
      backgroundColor: '#fee2e2',
      padding: '8px',
      borderRadius: '4px'
    },
    modalButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px'
    },
    cancelModalBtn: {
      padding: '8px 16px',
      borderRadius: '8px',
      backgroundColor: 'white',
      border: '1px solid #d1d5db',
      color: '#4b5563',
      cursor: 'pointer'
    },
    confirmDeleteBtn: {
      padding: '8px 16px',
      borderRadius: '8px',
      backgroundColor: '#ef4444',
      border: 'none',
      color: 'white',
      cursor: 'pointer'
    }
  };

  // Modal de confirmação para exclusão
  const DeleteConfirmationModal = () => {
    if (!deleteConfirmOpen) return null;
    
    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <h3 style={styles.modalTitle}>Confirmar exclusão</h3>
          <p style={styles.modalText}>
            Tem certeza que deseja excluir o feedback de <strong>{feedbackToDelete?.name}</strong>? 
            Esta ação não pode ser desfeita.
          </p>
          
          {deleteError && (
            <div style={styles.modalError}>
              {deleteError}
            </div>
          )}
          
          <div style={styles.modalButtons}>
            <button 
              style={styles.cancelModalBtn} 
              onClick={cancelDelete}
              disabled={deleteLoading}
            >
              Cancelar
            </button>
            <button 
              style={styles.confirmDeleteBtn} 
              onClick={deleteFeedback}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Excluindo...' : 'Excluir Feedback'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Navbar />
        <div style={styles.content}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p>Carregando dados do dashboard...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navbar />
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Visão Geral da Equipe</h1>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <p>{error}</p>
            <button 
              style={styles.retryButton}
              onClick={fetchDashboardData}
            >
              Tentar novamente
            </button>
          </div>
        )}
        
        {deleteSuccess && (
          <div style={styles.successContainer}>
            <p>Feedback excluído com sucesso!</p>
          </div>
        )}

        <div style={styles.dashboard}>
          <div style={styles.dashboardHeader}>
            <h2 style={styles.dashboardTitle}>Painel de Análises</h2>
            <div style={styles.controls}>
              <select 
                style={styles.select} 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="last-week">Última semana</option>
                <option value="last-month">Último mês</option>
                <option value="last-quarter">Último trimestre</option>
                <option value="year-to-date">Desde o início do ano</option>
              </select>
              <button 
                style={styles.exportButton}
                onClick={() => setExportModalOpen(true)}
              >
                Exportar
              </button>
            </div>
          </div>

          {/* Estatísticas - apenas as 3 solicitadas */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard(0)}>
              <h3 style={styles.statTitle}>Taxa de Resposta</h3>
              <p style={styles.statValue}>{dashboardData.stats.responseRate}%</p>
              <div style={styles.statTrend}>
                <span style={{ marginRight: '4px' }}>↑</span>
                +5% em relação à semana anterior
              </div>
            </div>
            
            <div style={styles.statCard(1)}>
              <h3 style={styles.statTitle}>Apoio da Equipe</h3>
              <p style={styles.statValue}>{dashboardData.stats.supportYesPercentage}%</p>
              <div style={styles.statDetail}>
                Sim: {dashboardData.stats.supportYesPercentage}% | 
                Em partes: {dashboardData.stats.supportPartialPercentage}% | 
                Não: {dashboardData.stats.supportNoPercentage}%
              </div>
            </div>
            
            <div style={styles.statCard(2)}>
              <h3 style={styles.statTitle}>Pendentes</h3>
              <p style={styles.statValue}>{dashboardData.stats.pendingFeedbacks}</p>
              <div style={styles.statDetail}>
                De um total de {dashboardData.stats.totalEmployees} funcionários
              </div>
            </div>
          </div>

          {/* Feedback recentes */}
          <div style={styles.feedbacksSection}>
            <h3 style={styles.feedbacksTitle}>Feedbacks Recentes</h3>
            
            {dashboardData.recentFeedbacks.length === 0 ? (
              <div style={styles.emptyState}>
                <p>Nenhum feedback encontrado para o período selecionado.</p>
              </div>
            ) : (
              <div style={styles.feedbacksList}>
                {dashboardData.recentFeedbacks.map((feedback) => (
                  <div key={feedback.id} style={styles.feedbackItem}>
                    <div style={styles.feedbackHeader}>
                      <span style={styles.feedbackAuthor}>{feedback.name}</span>
                      <span style={styles.feedbackDept}>{feedback.dept}</span>
                      <button 
                        style={styles.deleteButton}
                        onClick={() => confirmDeleteFeedback(feedback)}
                      >
                        Excluir
                      </button>
                    </div>
                    <div style={styles.feedbackStats}>
                      <span style={styles.feedbackStat}>Motivação: {feedback.motivation}/10</span>
                      <span style={styles.feedbackStat}>Carga: {feedback.workload}/10</span>
                      <span style={styles.feedbackStat}>Rendimento: {feedback.performance}/10</span>
                      <span style={styles.feedbackStat}>Apoio: {feedback.support}</span>
                    </div>
                    {feedback.improvementSuggestion && (
                      <div style={styles.feedbackSuggestion}>
                        <strong>Sugestão:</strong> {feedback.improvementSuggestion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para confirmação de exclusão */}
      <DeleteConfirmationModal />

      {/* Modal para exportação */}
      <ExportReport 
        isOpen={exportModalOpen} 
        onClose={() => setExportModalOpen(false)} 
      />
    </div>
  );
};

export default AdminDashboard;