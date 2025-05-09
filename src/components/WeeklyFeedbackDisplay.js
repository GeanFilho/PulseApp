import React from 'react';

const WeeklyFeedbackDisplay = ({ feedbackData }) => {
  // Estilos atualizados com melhorias para mobile
  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      margin: '0 auto 20px auto',
      borderLeft: '4px solid #4f46e5',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box'
    },
    header: {
      color: '#6366f1',
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '16px'
    },
    weekContainer: {
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      marginBottom: '16px',
      width: '100%',
      boxSizing: 'border-box'
    },
    weekHeader: {
      fontSize: '16px',
      color: '#4f46e5',
      fontWeight: '600',
      marginBottom: '16px'
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '16px',
      marginBottom: '16px',
      width: '100%'
    },
    metricContainer: {
      marginBottom: '10px'
    },
    metricLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '6px'
    },
    metricTitle: {
      fontWeight: '500',
      color: '#374151',
      fontSize: '14px'
    },
    metricValue: {
      fontWeight: '500',
      color: '#4b5563',
      fontSize: '14px'
    },
    progressBar: {
      width: '100%',
      height: '10px',
      backgroundColor: '#e5e7eb',
      borderRadius: '5px',
      overflow: 'hidden'
    },
    progressFill: (value, color) => ({
      height: '100%',
      width: `${(value / 10) * 100}%`,
      backgroundColor: color,
      borderRadius: '5px'
    }),
    supportLabel: {
      fontWeight: '500',
      color: '#374151',
      fontSize: '14px',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '8px'
    },
    supportValue: {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '4px',
      backgroundColor: '#eef2ff',
      color: '#4f46e5',
      fontWeight: '500',
      fontSize: '14px'
    },
    suggestionsContainer: {
      backgroundColor: '#fffbeb',
      borderRadius: '8px',
      padding: '12px',
      marginTop: '16px',
      borderLeft: '4px solid #f59e0b',
      width: '100%',
      boxSizing: 'border-box'
    },
    suggestionsTitle: {
      fontWeight: '600',
      color: '#9a3412',
      marginBottom: '8px',
      fontSize: '14px'
    },
    suggestionsText: {
      color: '#9a3412',
      fontSize: '14px',
      lineHeight: '1.4'
    }
  };

  // Se não houver dados, mostra mensagem apropriada
  if (!feedbackData) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>Histórico de Pesquisas Semanais</div>
        <p>Nenhuma pesquisa encontrada.</p>
      </div>
    );
  }

  // Função auxiliar para determinar a cor baseada na pontuação
  const getColorByValue = (value) => {
    if (value <= 3) return '#ef4444'; // Vermelho para valores baixos
    if (value <= 6) return '#f59e0b'; // Amarelo para valores médios
    return '#10b981'; // Verde para valores altos
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Histórico de Pesquisas Semanais</div>
      
      <div style={styles.weekContainer}>
        <div style={styles.weekHeader}>
          Semana: {feedbackData.date || '02/05/2025'}
        </div>
        
        <div style={styles.metricsGrid}>
          <div style={styles.metricContainer}>
            <div style={styles.metricLabel}>
              <span style={styles.metricTitle}>Motivação:</span>
              <span style={styles.metricValue}>{feedbackData.motivation || 4}/10</span>
            </div>
            <div style={styles.progressBar}>
              <div 
                style={styles.progressFill(
                  feedbackData.motivation || 4, 
                  getColorByValue(feedbackData.motivation || 4)
                )}
              ></div>
            </div>
          </div>
          
          <div style={styles.metricContainer}>
            <div style={styles.metricLabel}>
              <span style={styles.metricTitle}>Carga de Trabalho:</span>
              <span style={styles.metricValue}>{feedbackData.workload || 9}/10</span>
            </div>
            <div style={styles.progressBar}>
              <div 
                style={styles.progressFill(
                  feedbackData.workload || 9, 
                  getColorByValue(feedbackData.workload || 9)
                )}
              ></div>
            </div>
          </div>
          
          <div style={styles.metricContainer}>
            <div style={styles.metricLabel}>
              <span style={styles.metricTitle}>Rendimento:</span>
              <span style={styles.metricValue}>{feedbackData.performance || 4}/10</span>
            </div>
            <div style={styles.progressBar}>
              <div 
                style={styles.progressFill(
                  feedbackData.performance || 4, 
                  getColorByValue(feedbackData.performance || 4)
                )}
              ></div>
            </div>
          </div>
          
          <div style={styles.metricContainer}>
            <span style={styles.supportLabel}>
              Apoio da equipe:
              <span style={styles.supportValue}>{feedbackData.support || 'Sim'}</span>
            </span>
          </div>
        </div>
        
        {(feedbackData.improvementSuggestion || 'teste yuri 2') && (
          <div style={styles.suggestionsContainer}>
            <div style={styles.suggestionsTitle}>
              Sugestões de melhoria:
            </div>
            <div style={styles.suggestionsText}>
              {feedbackData.improvementSuggestion || 'teste yuri 2'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyFeedbackDisplay;