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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [feedbacksToExport, setFeedbacksToExport] = useState([]);
  
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

  // Efeito para detectar mudanças no tamanho da tela
  useEffect(() => {
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
  const isMobile = !isDesktop;

  // Estado para manter o controle dos feedbacks excluídos visualmente
  // Carregar do localStorage ao inicializar
  const [hiddenFeedbacks, setHiddenFeedbacks] = useState(() => {
    const saved = localStorage.getItem('hiddenFeedbacks');
    return saved ? JSON.parse(saved) : [];
  });

  // Função para obter o número de usuários cadastrados
  const fetchUserCount = async () => {
    try {
      // Obter contagem total de usuários
      const savedCount = localStorage.getItem('simulatedUserCount');
      const totalCount = savedCount ? parseInt(savedCount) : 3;
      
      // Obter lista de usuários ocultos
      const hiddenUsers = localStorage.getItem('hiddenUsers');
      const hiddenUserIds = hiddenUsers ? JSON.parse(hiddenUsers) : [];
      
      // Calcular contagem visível de forma simples
      const visibleCount = Math.max(totalCount - hiddenUserIds.length, 0);
      
      // Atualizar o estado
      setUserCount(visibleCount);
      
      return visibleCount;
    } catch (err) {
      console.error('Erro ao buscar contagem de usuários:', err);
      setUserCount(7); // Valor padrão
      return 7;
    }
  };
  
  // Função para atualizar o contador diretamente
  const updateUserCount = (count) => {
    setUserCount(parseInt(count)); // Garantir que seja um número
  };
  
  // useEffect específico para o contador de usuários
  useEffect(() => {
    // Função para lidar com eventos de mudança de visibilidade do usuário
    const handleVisibilityChange = (event) => {
      // Se temos um valor de contagem visível explícito e forceUpdate, usar diretamente
      if (event.detail && event.detail.visibleCount !== undefined && event.detail.forceUpdate) {
        setUserCount(event.detail.visibleCount);
      } else {
        // Caso contrário, recalcular
        fetchUserCount();
      }
    };
    
    // Registrar apenas este evento crucial
    document.addEventListener('userVisibilityChanged', handleVisibilityChange);
    
    // Fazer a primeira contagem
    fetchUserCount();
    
    // Limpar
    return () => {
      document.removeEventListener('userVisibilityChanged', handleVisibilityChange);
    };
  }, []);
   
  // Função para preparar a exportação e abrir o modal
  const handleExportButtonClick = async () => {
    try {
      // Tentar usar os feedbacks recentes já carregados
      if (dashboardData.recentFeedbacks && dashboardData.recentFeedbacks.length > 0) {
        setFeedbacksToExport(dashboardData.recentFeedbacks);
        setExportModalOpen(true);
        return;
      }
      
      // Se não tiver feedbacks recentes, buscar todos os feedbacks
      const allFeedbacks = await feedbackService.getAllFeedbacks({
        period: period
      });
      
      // Se conseguir obter os feedbacks, abra o modal com eles
      if (allFeedbacks && allFeedbacks.length > 0) {
        setFeedbacksToExport(allFeedbacks);
        setExportModalOpen(true);
      } else {
        // Se mesmo assim não houver dados, usar dados de exemplo
        const sampleFeedbacks = [
          {
            id: 1,
            name: "João Silva",
            dept: "Desenvolvimento",
            date: "2025-04-22",
            motivation: 8,
            workload: 7,
            performance: 9,
            support: "Sim",
            improvementSuggestion: "Exemplo de feedback para teste de exportação."
          },
          {
            id: 2,
            name: "Maria Santos",
            dept: "Marketing",
            date: "2025-04-20",
            motivation: 7,
            workload: 8,
            performance: 7,
            support: "Em partes",
            improvementSuggestion: "Exemplo de sugestão para teste de exportação."
          }
        ];
        
        setFeedbacksToExport(sampleFeedbacks);
        setExportModalOpen(true);
      }
    } catch (error) {
      console.error('Erro ao buscar feedbacks para exportação:', error);
      alert('Erro ao preparar dados para exportação. Por favor, tente novamente.');
    }
  };

  // Função para buscar os dados do backend - CORRIGIDA PARA MOSTRAR TODOS OS FEEDBACKS
// Função fetchDashboardData corrigida - utiliza o endpoint que está funcionando
// Função fetchDashboardData atualizada com limite muito alto
const fetchDashboardData = async () => {
  try {
    setLoading(true);
    
    // Buscar estatísticas
    const stats = await feedbackService.getDashboardStats(period);
    
    // CORREÇÃO: Usar o endpoint que funciona com um número MUITO alto
    // 1.000.000 de feedbacks deve ser suficiente para praticamente qualquer sistema
    const allFeedbacks = await feedbackService.getRecentFeedbacks(1000000);
    
    // Calcular a taxa de produtividade
    const productivityValues = allFeedbacks
      .map(feedback => feedback.performance || 0)
      .filter(value => value > 0);
    
    const averageProductivity = productivityValues.length > 0
      ? productivityValues.reduce((sum, value) => sum + value, 0) / productivityValues.length
      : 0;
    
    // Atualizar o estado com todos os feedbacks obtidos
    setDashboardData({
      stats: {
        ...stats,
        productivityRate: Math.round(averageProductivity * 10),
        responseRate: stats.responseRate || 100
      },
      recentFeedbacks: allFeedbacks
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

  // Estilos para o dashboard
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      width: '100%'
    },
    content: {
      padding: isMobile ? '10px' : '20px',
      width: '100%',
      maxWidth: '1300px', // Mesmo valor que o dashboard do funcionário
      margin: '0 auto'
    },
    header: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      marginBottom: '24px',
      gap: isMobile ? '16px' : '0',
      width: '100%'
    },
    title: {
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0
    },
    tabs: {
      display: 'flex',
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '24px',
      width: '100%'
    },
    tab: {
      padding: isMobile ? '8px 12px' : '12px 16px',
      fontSize: isMobile ? '14px' : '16px',
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
      gap: '12px',
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      width: isMobile ? '100%' : 'auto'
    },
    select: {
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      width: isMobile ? '100%' : 'auto'
    },
    exportButton: {
      backgroundColor: '#7e22ce',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      width: isMobile ? '100%' : 'auto'
    },
    restoreButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      marginLeft: isMobile ? '0' : '8px',
      width: isMobile ? '100%' : 'auto'
    },
    dashboard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: isMobile ? '16px' : '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      width: '100%'
    },
    dashboardHeader: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      marginBottom: '24px',
      gap: isMobile ? '16px' : '0',
      width: '100%'
    },
    dashboardTitle: {
      fontSize: isMobile ? '18px' : '20px',
      fontWeight: 'bold',
      color: '#7e22ce',
      margin: 0
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: '24px',
      marginBottom: '32px',
      width: '100%'
    },
    statCard: (index) => {
      const colors = ['#eef2ff', '#f0fdfa', '#faf5ff'];
      const borderColors = ['#4f46e5', '#10b981', '#9333ea'];
      return {
        background: `linear-gradient(to bottom right, ${colors[index % 3]}, white)`,
        padding: isMobile ? '16px' : '24px',
        borderRadius: '12px',
        borderBottom: `4px solid ${borderColors[index % 3]}`,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        width: '100%'
      };
    },
    statTitle: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '500',
      marginTop: 0,
      marginBottom: '8px',
      color: '#374151'
    },
    statValue: {
      fontSize: isMobile ? '24px' : '28px',
      fontWeight: 'bold',
      margin: 0
    },
    statTrend: (color = '#10b981') => ({
      display: 'flex',
      alignItems: 'center',
      fontSize: isMobile ? '12px' : '14px',
      marginTop: '8px',
      color: color
    }),
    statDetail: {
      fontSize: isMobile ? '12px' : '14px',
      color: '#6b7280',
      marginTop: '8px'
    },
    feedbacksSection: {
      marginTop: '32px',
      width: '100%'
    },
    feedbacksHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      width: '100%'
    },
    feedbacksTitle: {
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0
    },
    feedbacksList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      width: '100%'
    },
    feedbackItem: {
      borderLeft: '4px solid #4f46e5',
      padding: isMobile ? '12px' : '16px',
      borderRadius: '8px',
      backgroundColor: '#f9fafb',
      position: 'relative',
      width: '100%'
    },
    feedbackHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
      position: 'relative',
      paddingRight: '70px',  // Espaço para o botão de exclusão
      width: '100%'
    },
    feedbackAuthor: {
      fontWeight: '500',
      color: '#4f46e5',
      fontSize: isMobile ? '14px' : 'inherit'
    },
    feedbackDept: {
      backgroundColor: '#f3f4f6',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: isMobile ? '12px' : '14px',
      color: '#6b7280'
    },
    feedbackStats: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '12px',
      flexWrap: 'wrap',
      marginBottom: '12px',
      width: '100%'
    },
    feedbackStat: {
      backgroundColor: '#eef2ff',
      padding: '4px 12px',
      borderRadius: '8px',
      fontSize: isMobile ? '12px' : '14px',
      color: '#4f46e5',
      margin: isMobile ? '2px 0' : '0',
      boxSizing: 'border-box'
    },
    feedbackSuggestion: {
      backgroundColor: '#fff7ed',
      padding: '12px',
      borderRadius: '8px',
      fontSize: isMobile ? '12px' : '14px',
      color: '#9a3412',
      borderLeft: '3px solid #f59e0b',
      marginTop: '12px',
      width: '100%',
      boxSizing: 'border-box'
    },
    deleteButton: {
      position: 'absolute',
      top: '0',
      right: '0',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: isMobile ? '4px 8px' : '6px 12px',
      fontSize: isMobile ? '11px' : '12px',
      cursor: 'pointer'
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '50px',
      width: '100%'
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
      marginBottom: '24px',
      width: '100%'
    },
    successContainer: {
      backgroundColor: '#d1fae5',
      padding: '16px',
      borderRadius: '8px',
      color: '#065f46',
      marginBottom: '24px',
      width: '100%'
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
      color: '#6b7280',
      width: '100%'
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
      width: '90%',
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
    },
    // Adicionando paginação
    paginationContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '20px',
      padding: '10px',
      width: '100%'
    },
    paginationButton: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      backgroundColor: 'white',
      color: '#4b5563',
      cursor: 'pointer'
    },
    paginationButtonActive: {
      backgroundColor: '#4f46e5',
      color: 'white',
      border: '1px solid #4f46e5'
    },
    paginationInfo: {
      fontSize: '14px',
      color: '#6b7280'
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

  // Adicionando paginação para lidar com muitos feedbacks
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calcular os índices dos itens a serem exibidos na página atual
  const indexOfLastFeedback = currentPage * itemsPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - itemsPerPage;
  const currentFeedbacks = visibleFeedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);
  const totalPages = Math.ceil(visibleFeedbacks.length / itemsPerPage);

  // Funções para navegar entre as páginas
  const goToNextPage = () => {
    setCurrentPage(page => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(page => Math.max(page - 1, 1));
  };

  // Componente de paginação
  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div style={styles.paginationContainer}>
        <div style={styles.paginationInfo}>
          Mostrando {indexOfFirstFeedback + 1} a {Math.min(indexOfLastFeedback, visibleFeedbacks.length)} de {visibleFeedbacks.length} feedbacks
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            style={styles.paginationButton} 
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Lógica para mostrar páginas em torno da página atual
            let pageNum = i + 1;
            if (totalPages > 5) {
              if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
            }
            
            return (
              <button
                key={pageNum}
                style={{
                  ...styles.paginationButton,
                  ...(currentPage === pageNum ? styles.paginationButtonActive : {})
                }}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button 
            style={styles.paginationButton}
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Próxima
          </button>
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
              onClick={handleExportButtonClick}
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
            <p style={styles.statValue} id="user-counter-value">{userCount}</p>
            <div style={styles.statTrend()}>
              <span style={{ marginRight: '4px' }}>↑</span>
              Atualizados em tempo real
            </div>
          </div>
          
          {/* Card 2: Taxa de Produtividade */}
          <div style={styles.statCard(1)}>
            <h3 style={styles.statTitle}>Taxa de Produtividade</h3>
            <p style={styles.statValue}>{dashboardData.stats.productivityRate}%</p>
            <div style={styles.statTrend()}>
              <span style={{ marginRight: '4px' }}>↑</span>
              Baseado nos feedbacks enviados
            </div>
          </div>
          
          {/* Card 3: Taxa de Resposta */}
          <div style={styles.statCard(2)}>
            <h3 style={styles.statTitle}>Taxa de Resposta</h3>
            <p style={styles.statValue}>{dashboardData.stats.responseRate}%</p>
            <div style={styles.statTrend('#9333ea')}>
              <span style={{ marginRight: '4px' }}>↑</span>
              De funcionários participantes
            </div>
          </div>
        </div>

        {/* Feedback recentes */}
        <div style={styles.feedbacksSection}>
          <div style={styles.feedbacksHeader}>
            <h3 style={styles.feedbacksTitle}>Todos os Feedbacks</h3>
            <div style={{fontSize: '14px', color: '#6b7280'}}>
              Total: {visibleFeedbacks.length} feedbacks
            </div>
          </div>
          
          {visibleFeedbacks.length === 0 ? (
            <div style={styles.emptyState}>
              <p>Nenhum feedback encontrado para o período selecionado.</p>
            </div>
          ) : (
            <div style={styles.feedbacksList}>
              {currentFeedbacks.map((feedback) => (
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
          
          {/* Adiciona a paginação abaixo da lista de feedbacks */}
          <Pagination />
        </div>
      </div>
    );
  };

  // Renderização da página
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
        {activeTab === 'users' && <UserManagement onUserVisibilityChange={updateUserCount} />}
      </div>

      {/* Modal para confirmação de exclusão */}
      <DeleteConfirmationModal />

      {/* Modal para exportação */}
      <ExportReport 
        isOpen={exportModalOpen} 
        onClose={() => setExportModalOpen(false)} 
        feedbackData={feedbacksToExport}
      />
    </div>
  );
};

export default AdminDashboard;