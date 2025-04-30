// src/pages/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import Navbar from '../../components/Navbar';
import ExportReport from '../../components/ExportReport';
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
  adminDashboard: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    borderTop: `4px solid ${theme.colors.secondary.main}`,
    boxShadow: theme.shadows.lg
  },
  dashboardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl
  },
  dashboardTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.secondary.main,
    margin: 0
  },
  dashboardControls: {
    display: 'flex',
    gap: theme.spacing.md
  },
  periodSelect: {
    border: `1px solid ${theme.colors.grey[300]}`,
    borderRadius: theme.borderRadius.md,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: 'white'
  },
  exportButton: {
    backgroundColor: theme.colors.secondary.main,
    color: 'white',
    border: 'none',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing.xl
  },
  statCard: (index) => {
    const colors = ['#eef2ff', '#d1fae5', '#faf5ff'];
    const borderColors = [theme.colors.primary.main, theme.colors.success.main, theme.colors.secondary.main];
    return {
      background: `linear-gradient(to bottom right, ${colors[index]}, white)`,
      padding: theme.spacing.xl,
      borderRadius: theme.borderRadius.lg,
      borderBottom: `4px solid ${borderColors[index]}`,
      boxShadow: theme.shadows.sm
    };
  },
  statTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
    marginTop: 0,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary
  },
  statValue: {
    fontSize: theme.typography.fontSize.huge,
    fontWeight: theme.typography.fontWeight.bold,
    margin: 0
  },
  statTrend: (isPositive = true) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.sm,
    color: isPositive ? theme.colors.success.main : theme.colors.error.main
  }),
  statTrendIcon: {
    marginRight: theme.spacing.xs
  },
  statDetail: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    borderLeft: `4px solid ${theme.colors.primary.main}`
  },
  chartTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.lg,
    color: theme.colors.text.primary
  },
  chart: {
    height: '250px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg
  },
  chartBar: (value, max = 10) => ({
    height: `${(value / max) * 100}%`,
    flex: 1,
    backgroundColor: theme.colors.primary.main,
    borderRadius: `${theme.borderRadius.sm} ${theme.borderRadius.sm} 0 0`,
    position: 'relative'
  }),
  chartBarValue: {
    position: 'absolute',
    top: '-24px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary
  },
  chartLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm
  },
  feedbackListTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.lg,
    color: theme.colors.text.primary
  },
  feedbackList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg
  },
  feedbackItem: {
    borderBottom: `1px solid ${theme.colors.grey[200]}`,
    paddingBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    transition: `background-color ${theme.transitions.speed.normal}`,
    '&:hover': {
      backgroundColor: theme.colors.grey[50]
    }
  },
  feedbackItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm
  },
  feedbackAuthor: {
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.main
  },
  feedbackDept: {
    backgroundColor: theme.colors.grey[100],
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: '9999px',
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary
  },
  feedbackMetrics: {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md
  },
  metricBadge: (type) => {
    const colors = {
      motivation: {
        bg: '#eef2ff',
        text: theme.colors.primary.main
      },
      workload: {
        bg: '#f0fdfa',
        text: theme.colors.success.dark
      },
      performance: {
        bg: '#fdf2f8',
        text: theme.colors.secondary.dark
      },
      support: {
        bg: '#f0f9ff',
        text: theme.colors.info.dark
      }
    };
    
    return {
      backgroundColor: colors[type].bg,
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: theme.borderRadius.sm,
      fontSize: theme.typography.fontSize.sm,
      color: colors[type].text
    };
  },
  feedbackComments: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing.md
  },
  commentBox: (type) => ({
    backgroundColor: type === 'positive' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
    color: type === 'positive' ? theme.colors.success.dark : theme.colors.warning.dark,
    borderLeft: `3px solid ${type === 'positive' ? theme.colors.success.main : theme.colors.warning.main}`
  }),
  viewAllButton: {
    display: 'flex',
    alignItems: 'center',
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.medium,
    background: 'none',
    border: 'none',
    padding: 0,
    marginTop: theme.spacing.xl,
    cursor: 'pointer'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    backgroundColor: theme.colors.background.default
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: `5px solid ${theme.colors.grey[200]}`,
    borderTopColor: theme.colors.secondary.main,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: theme.spacing.lg
  },
  loadingText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium
  }
};

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('last-week');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      responseRate: 0,
      motivationAvg: 0,
      workloadAvg: 0,
      performanceAvg: 0,
      supportYesPercentage: 0,
      supportPartialPercentage: 0,
      supportNoPercentage: 0,
      totalEmployees: 0,
      pendingFeedbacks: 0
    },
    recentFeedbacks: []
  });
  
  useEffect(() => {
    // Carregar dados do dashboard do admin
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Buscar estatísticas
        const stats = await apiService.admin.getDashboardStats(period);
        
        // Buscar feedbacks recentes
        const recentFeedbacks = await apiService.admin.getRecentFeedbacks(5);
        
        setDashboardData({
          stats,
          recentFeedbacks
        });
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        alert('Ocorreu um erro ao carregar os dados do dashboard. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [period]);
  
  // Dados do gráfico de tendência (simulados para demo)
  const trendData = [7.2, 6.8, 7.0, 7.4, 7.6, 7.5, 7.8, 7.9];
  
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Carregando dashboard...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      <Navbar />
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Visão Geral da Equipe</h1>
        </div>
        
        <div style={styles.adminDashboard}>
          <div style={styles.dashboardHeader}>
            <h2 style={styles.dashboardTitle}>Painel de Análises</h2>
            <div style={styles.dashboardControls}>
              <select 
                style={styles.periodSelect}
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
              
              <ExportReport 
                isOpen={exportModalOpen} 
                onClose={() => setExportModalOpen(false)} 
              />
            </div>
          </div>
          
          <div style={styles.statsGrid}>
            <div style={styles.statCard(0)}>
              <h3 style={styles.statTitle}>Taxa de Resposta</h3>
              <p style={styles.statValue}>{dashboardData.stats.responseRate}%</p>
              <div style={styles.statTrend()}>
                <span style={styles.statTrendIcon}>↑</span>
                +5% em relação à semana anterior
              </div>
            </div>
            <div style={styles.statCard(1)}>
              <h3 style={styles.statTitle}>Média de Motivação</h3>
              <p style={styles.statValue}>{dashboardData.stats.motivationAvg}/10</p>
              <div style={styles.statTrend()}>
                <span style={styles.statTrendIcon}>↑</span>
                +0.3 em relação à semana anterior
              </div>
            </div>
            <div style={styles.statCard(2)}>
              <h3 style={styles.statTitle}>Carga de Trabalho</h3>
              <p style={styles.statValue}>{dashboardData.stats.workloadAvg}/10</p>
              <div style={styles.statTrend(true)}>
                <span style={styles.statTrendIcon}>↑</span>
                +0.5 em relação à semana anterior
              </div>
            </div>
          </div>
          
          {/* Segundo conjunto de estatísticas */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard(1)}>
              <h3 style={styles.statTitle}>Rendimento</h3>
              <p style={styles.statValue}>{dashboardData.stats.performanceAvg}/10</p>
              <div style={styles.statTrend()}>
                <span style={styles.statTrendIcon}>↑</span>
                +0.2 em relação à semana anterior
              </div>
            </div>
            <div style={styles.statCard(0)}>
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
          
          {/* Gráfico de tendência */}
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>Tendência de Motivação</h3>
            
            <div style={styles.chart}>
              {trendData.map((value, index) => (
                <div key={index} style={styles.chartBar(value)}>
                  <span style={styles.chartBarValue}>{value}</span>
                </div>
              ))}
            </div>
            
            <div style={styles.chartLabels}>
              <span>Semana 1</span>
              <span>Semana 2</span>
              <span>Semana 3</span>
              <span>Semana 4</span>
              <span>Semana 5</span>
              <span>Semana 6</span>
              <span>Semana 7</span>
              <span>Atual</span>
            </div>
          </div>
          
          <h3 style={styles.feedbackListTitle}>Feedbacks Recentes</h3>
          <div style={styles.feedbackList}>
            {dashboardData.recentFeedbacks.map((item) => (
              <div key={item.id} style={styles.feedbackItem}>
                <div style={styles.feedbackItemHeader}>
                  <span style={styles.feedbackAuthor}>{item.name}</span>
                  <span style={styles.feedbackDept}>{item.dept}</span>
                </div>
                
                <div style={styles.feedbackMetrics}>
                  <span style={styles.metricBadge('motivation')}>
                    Motivação: {item.motivation}/10
                  </span>
                  <span style={styles.metricBadge('workload')}>
                    Carga: {item.workload}/10
                  </span>
                  <span style={styles.metricBadge('performance')}>
                    Rendimento: {item.performance}/10
                  </span>
                  <span style={styles.metricBadge('support')}>
                    Apoio: {item.support}
                  </span>
                </div>
                
                <div style={styles.feedbackComments}>
                  {item.positiveEvent && (
                    <div style={styles.commentBox('positive')}>
                      <strong>Positivo:</strong> {item.positiveEvent}
                    </div>
                  )}
                  
                  {item.improvementSuggestion && (
                    <div style={styles.commentBox('improvement')}>
                      <strong>Sugestão:</strong> {item.improvementSuggestion}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <button style={styles.viewAllButton}>
            Ver todos os feedbacks
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ marginLeft: '4px' }}>
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;