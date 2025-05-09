// src/pages/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import ExportReport from '../../components/ExportReport';
import UserManagement from '../../components/admin/UserManagement';
import feedbackService from '../../services/feedbackService';
import apiService from '../../services/apiService';

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
  const [userCount, setUserCount] = useState(0);
  const [trendData, setTrendData] = useState({
    direction: 'up', // 'up', 'down', ou 'stable'
    percentage: 5,
    weeklyValues: [7.2, 6.8, 7.0, 7.4, 7.6, 7.5, 7.8]
  });
  
  // Estado para a guia ativa
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' ou 'users'
  
  // Estado para armazenar os dados do dashboard
  const [dashboardData, setDashboardData] = useState({
    stats: {
      responseRate: 0,
      productivityRate: 0,
      supportYesPercentage: 0,
      supportPartialPercentage: 0,
      supportNoPercentage: 0,
      totalEmployees: 0,
      pendingFeedbacks: 0
    },
    recentFeedbacks: []
  });

  // Estado para manter o controle dos feedbacks excluídos visualmente
  // Carregar do localStorage ao inicializar
  const [hiddenFeedbacks, setHiddenFeedbacks] = useState(() => {
    const saved = localStorage.getItem('hiddenFeedbacks');
    return saved ? JSON.parse(saved) : [];
  });

  // Função para obter o número de usuários cadastrados
  const fetchUserCount = async () => {
    try {
      console.log("Atualizando contagem de usuários...");
      
      // Verificar se o simulatedUserCount existe no localStorage
      let savedCount = localStorage.getItem('simulatedUserCount');
      
      // Se não existir ou for inválido, inicializar
      if (!savedCount || isNaN(parseInt(savedCount))) {
        // Inicializar com uma quantidade padrão de usuários
        savedCount = '3';
        localStorage.setItem('simulatedUserCount', savedCount);
      }
      
      const totalCount = parseInt(savedCount);
      
      // Obter a lista de usuários ocultos
      const hiddenUsers = localStorage.getItem('hiddenUsers');
      const hiddenUserIds = hiddenUsers ? JSON.parse(hiddenUsers) : [];
      const hiddenUserCount = hiddenUserIds.length;
      
      console.log('Contagem total de usuários:', totalCount);
      console.log('IDs de usuários ocultos:', hiddenUserIds);
      console.log('Quantidade de usuários ocultos:', hiddenUserCount);
      
      // Calcular contagem visível (total menos ocultos)
      // Garantir que não fique abaixo de zero
      const visibleCount = Math.max(totalCount - hiddenUserCount, 0);
      console.log('Contagem final de usuários visíveis:', visibleCount);
      
      // Atualizar o estado com a contagem visível
      setUserCount(visibleCount);
      
      return visibleCount;
    } catch (err) {
      console.error('Erro ao buscar contagem de usuários:', err);
      // Padrão para um valor razoável se tudo falhar
      setUserCount(3);
      return 3;
    }
  };
  
  // Adicione estas funções ao seu componente AdminDashboard
  useEffect(() => {
    // Função para lidar com eventos de mudança de visibilidade do usuário
    const handleVisibilityChange = (event) => {
      console.log('Evento de visibilidade de usuário detectado:', event.detail);
      
      // Forçar atualização da contagem completa
      fetchUserCount();
    };
    
    // Função específica para eventos de contagem
    const handleCountChange = (event) => {
      console.log('Evento de alteração de contagem detectado:', event.detail);
      
      // Se o evento incluir uma contagem atualizada, use-a diretamente
      if (event.detail && event.detail.count !== undefined) {
        const hiddenUsers = localStorage.getItem('hiddenUsers');
        const hiddenUserIds = hiddenUsers ? JSON.parse(hiddenUsers) : [];
        const visibleCount = Math.max(event.detail.count - hiddenUserIds.length, 0);
        
        console.log('Atualizando contagem diretamente para:', visibleCount);
        setUserCount(visibleCount);
      } else {
        // Caso contrário, faça uma nova busca completa
        fetchUserCount();
      }
    };
    
    // Função para lidar com o evento de storage
    const handleStorageChange = (event) => {
      if (event.key === 'hiddenUsers' || event.key === 'simulatedUserCount') {
        console.log('Evento de storage detectado para:', event.key);
        fetchUserCount();
      }
    };
    
    // Registrar os ouvintes de eventos
    document.addEventListener('userVisibilityChanged', handleVisibilityChange);
    document.addEventListener('userCountChanged', handleCountChange);
    window.addEventListener('storage', handleStorageChange);
    
    // Buscar contagem inicial
    fetchUserCount();
    
    // Configurar um intervalo para verificar periodicamente
    const interval = setInterval(fetchUserCount, 10000); // 10 segundos
    
    // Função de limpeza para remover os ouvintes
    return () => {
      document.removeEventListener('userVisibilityChanged', handleVisibilityChange);
      document.removeEventListener('userCountChanged', handleCountChange);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
   

  // Função para buscar os dados do backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar estatísticas e feedbacks usando o feedbackService
      const stats = await feedbackService.getDashboardStats(period);
      const recentFeedbacks = await feedbackService.getRecentFeedbacks(5);
      const trendDataResponse = await feedbackService.getFeedbackTrends(period);
      
      // Atualizar dados de tendência
      if (trendDataResponse) {
        setTrendData(trendDataResponse);
      }
      
      // Calcular a taxa de produtividade (média dos valores 'performance')
      const productivityValues = recentFeedbacks
        .map(feedback => feedback.performance || 0)
        .filter(value => value > 0);
      
      const averageProductivity = productivityValues.length > 0
        ? productivityValues.reduce((sum, value) => sum + value, 0) / productivityValues.length
        : 0;
      
      // Atualizar o estado com os dados reais e a taxa de produtividade calculada
      setDashboardData({
        stats: {
          ...stats,
          productivityRate: (averageProductivity * 10).toFixed(0) // Convertendo para percentual
        },
        recentFeedbacks
      });
      
      // Também buscar a contagem de usuários
      await fetchUserCount();
      
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

  // Função para ocultar feedback da visualização (sem excluir do banco de dados)
  const hideFeedback = async () => {
    if (!feedbackToDelete) return;
    
    try {
      setDeleteLoading(true);
      setDeleteError('');
      
      // Adicionar o ID do feedback à lista de feedbacks ocultos
      const updatedHiddenFeedbacks = [...hiddenFeedbacks, feedbackToDelete.id];
      setHiddenFeedbacks(updatedHiddenFeedbacks);
      
      // Salvar no localStorage para persistir entre recarregamentos
      localStorage.setItem('hiddenFeedbacks', JSON.stringify(updatedHiddenFeedbacks));
      
      // Fechar o modal de confirmação
      setDeleteConfirmOpen(false);
      setFeedbackToDelete(null);
      setDeleteSuccess(true);
      
      // Exibir mensagem de sucesso por 2 segundos
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 2000);
      
    } catch (err) {
      console.error('Erro ao ocultar feedback:', err);
      setDeleteError('Ocorreu um erro ao ocultar o feedback. Por favor, tente novamente.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Função para restaurar todos os feedbacks ocultos
  const restoreAllFeedbacks = () => {
    setHiddenFeedbacks([]);
    localStorage.removeItem('hiddenFeedbacks');
    // Mostrar mensagem de sucesso
    setDeleteSuccess(true);
    setTimeout(() => {
      setDeleteSuccess(false);
    }, 2000);
  };

  // Buscar dados ao carregar o componente ou quando o período mudar
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [period, activeTab]);

  // Filtrar feedbacks ocultos
  const visibleFeedbacks = dashboardData.recentFeedbacks.filter(
    feedback => !hiddenFeedbacks.includes(feedback.id)
  );

  // Determinar a cor e o ícone da tendência
  const getTrendColor = () => {
    switch (trendData.direction) {
      case 'up':
        return '#10b981'; // Verde
      case 'down':
        return '#ef4444'; // Vermelho
      default:
        return '#6b7280'; // Cinza
    }
  };

  const getTrendIcon = () => {
    switch (trendData.direction) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

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
    tabs: {
      display: 'flex',
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '24px'
    },
    tab: {
      padding: '12px 16px',
      fontSize: '16px',
      fontWeight: '500',
      color: '#6b7280',
      cursor: 'pointer',
      position: 'relative',
      borderBottom: '2px solid transparent'
    },
    activeTab: {
      color: '#4f46e5',
      borderBottom: '2px solid #4f46e5'
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
    restoreButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      marginLeft: '8px'
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
    statTrend: (color = '#10b981') => ({
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      marginTop: '8px',
      color: color
    }),
    statDetail: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '8px'
    },
    trendChart: {
      display: 'flex',
      alignItems: 'flex-end',
      height: '60px',
      gap: '2px',
      marginTop: '8px'
    },
    trendBar: (value, max, index, isLatest) => ({
      flex: 1,
      height: `${Math.max((value / 10) * 100, 15)}%`,
      backgroundColor: isLatest ? '#4f46e5' : '#a5b4fc',
      borderRadius: '2px',
      transition: 'height 0.3s ease'
    }),
    feedbacksSection: {
      marginTop: '32px'
    },
    feedbacksHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    feedbacksTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0
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
            Tem certeza que deseja ocultar o feedback de <strong>{feedbackToDelete?.name}</strong>?
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
              onClick={hideFeedback}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Processando...' : 'Ocultar Feedback'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Conteúdo do Dashboard
  const renderDashboardContent = () => {
    if (loading) {
      return (
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
      );
    }

    return (
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
            {hiddenFeedbacks.length > 0 && (
              <button 
                style={styles.restoreButton}
                onClick={restoreAllFeedbacks}
              >
                Restaurar
              </button>
            )}
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div style={styles.statsGrid}>
          {/* Card 1: Usuários Cadastrados */}
          <div style={styles.statCard(0)}>
            <h3 style={styles.statTitle}>Usuários Cadastrados</h3>
            <p style={styles.statValue}>{userCount}</p>
            <div style={styles.statTrend()}>
              <span style={{ marginRight: '4px' }}>↑</span>
              Atualizado em tempo real
            </div>
          </div>
          
          {/* Card 2: Taxa de Produtividade */}
          <div style={styles.statCard(1)}>
            <h3 style={styles.statTitle}>Taxa de Produtividade</h3>
            <p style={styles.statValue}>{dashboardData.stats.productivityRate}%</p>
            <div style={styles.statTrend()}>
              <span style={{ marginRight: '4px' }}>↑</span>
              Baseado nos feedbacks recentes
            </div>
          </div>
          
          {/* Card 3: Tendência de Motivação */}
          <div style={styles.statCard(2)}>
            <h3 style={styles.statTitle}>Tendência de Motivação</h3>
            <div style={styles.trendChart}>
              {trendData.weeklyValues.map((value, index) => (
                <div 
                  key={index} 
                  style={styles.trendBar(
                    value, 
                    10, 
                    index, 
                    index === trendData.weeklyValues.length - 1
                  )}
                />
              ))}
            </div>
            <div style={styles.statTrend(getTrendColor())}>
              <span style={{ marginRight: '4px' }}>{getTrendIcon()}</span>
              {trendData.percentage}% nas últimas semanas
            </div>
          </div>
        </div>

        {/* Feedback recentes */}
        <div style={styles.feedbacksSection}>
          <div style={styles.feedbacksHeader}>
            <h3 style={styles.feedbacksTitle}>Feedbacks Recentes</h3>
          </div>
          
          {visibleFeedbacks.length === 0 ? (
            <div style={styles.emptyState}>
              <p>Nenhum feedback encontrado para o período selecionado.</p>
            </div>
          ) : (
            <div style={styles.feedbacksList}>
              {visibleFeedbacks.map((feedback) => (
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
    );
  };

  return (
    <div style={styles.container}>
      <Navbar />
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Visão Geral da Equipe</h1>
        </div>

        {/* Abas de navegação */}
        <div style={styles.tabs}>
          <div 
            style={{
              ...styles.tab,
              ...(activeTab === 'dashboard' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </div>
          <div 
            style={{
              ...styles.tab,
              ...(activeTab === 'users' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('users')}
          >
            Usuários
          </div>
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
            <p>Operação realizada com sucesso!</p>
          </div>
        )}

        {/* Renderizar conteúdo com base na aba selecionada */}
        {activeTab === 'dashboard' && renderDashboardContent()}
        {activeTab === 'users' && <UserManagement />}
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