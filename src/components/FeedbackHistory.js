// src/components/FeedbackHistory.js
import React from 'react';
import theme from '../styles/theme';

const styles = {
  container: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
    borderLeft: `4px solid ${theme.colors.primary.main}`,
    boxShadow: theme.shadows.lg
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    marginTop: 0,
    marginBottom: theme.spacing.xl
  },
  feedbackList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg
  },
  feedbackItem: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.grey[200]}`,
    backgroundColor: theme.colors.grey[50]
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    borderBottom: `1px solid ${theme.colors.grey[200]}`,
    paddingBottom: theme.spacing.sm
  },
  dateLabel: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.main,
    fontSize: theme.typography.fontSize.lg
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg
  },
  statItem: {
    marginBottom: 0
  },
  statLabel: {
    margin: `0 0 ${theme.spacing.xs} 0`,
    fontWeight: theme.typography.fontWeight.medium
  },
  ratingBar: {
    width: '100%',
    backgroundColor: theme.colors.grey[200],
    height: '8px',
    borderRadius: '4px',
    marginTop: theme.spacing.xs,
    position: 'relative'
  },
  ratingFill: (rating, maxRating = 10) => ({
    width: `${(rating / maxRating) * 100}%`,
    backgroundColor: getColorByRating(rating),
    height: '8px',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  }),
  commentBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeft: `4px solid ${theme.colors.warning.main}`
  },
  commentTitle: {
    margin: `0 0 ${theme.spacing.xs} 0`,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.warning.dark
  },
  commentText: {
    margin: 0,
    color: theme.colors.warning.dark
  },
  emptyState: {
    padding: theme.spacing.xl,
    textAlign: 'center',
    color: theme.colors.grey[500],
    backgroundColor: theme.colors.grey[50],
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.grey[200]}`,
    marginTop: theme.spacing.xl
  }
};

// Função para determinar a cor com base na pontuação
const getColorByRating = (score) => {
  if (score <= 3) return theme.colors.error.main; // Vermelho para pontuações baixas
  if (score <= 6) return theme.colors.warning.main; // Amarelo para pontuações médias
  return theme.colors.success.main; // Verde para pontuações altas
};

const FeedbackHistory = ({ feedbacks = [] }) => {
  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>Nenhum feedback anterior encontrado.</p>
        <p>Seu histórico de feedbacks aparecerá aqui quando você enviar seu primeiro feedback.</p>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Histórico de Pesquisas Semanais</h3>
      
      <div style={styles.feedbackList}>
        {feedbacks.map((feedback) => {
          const date = new Date(feedback.date);
          const formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          
          // Garantir consistência nos nomes de campo
          const motivation = feedback.motivation !== undefined ? feedback.motivation : (feedback.wellbeing || 0);
          const workload = feedback.workload !== undefined ? feedback.workload : 5;
          const performance = feedback.performance !== undefined ? feedback.performance : (feedback.productivity || 0);
          const support = feedback.support || 'Não informado';
          const improvementSuggestion = feedback.improvementSuggestion || '';
          
          return (
            <div key={feedback.id} style={styles.feedbackItem}>
              <div style={styles.itemHeader}>
                <span style={styles.dateLabel}>Semana: {formattedDate}</span>
              </div>
              
              <div style={styles.statsGrid}>
                <div style={styles.statItem}>
                  <p style={styles.statLabel}>
                    Motivação: {motivation}/10
                  </p>
                  <div style={styles.ratingBar}>
                    <div style={styles.ratingFill(motivation)}></div>
                  </div>
                </div>
                
                <div style={styles.statItem}>
                  <p style={styles.statLabel}>
                    Carga de Trabalho: {workload}/10
                  </p>
                  <div style={styles.ratingBar}>
                    <div style={styles.ratingFill(workload)}></div>
                  </div>
                </div>
                
                <div style={styles.statItem}>
                  <p style={styles.statLabel}>
                    Rendimento: {performance}/10
                  </p>
                  <div style={styles.ratingBar}>
                    <div style={styles.ratingFill(performance)}></div>
                  </div>
                </div>
                
                <div style={styles.statItem}>
                  <p style={styles.statLabel}>
                    Apoio da equipe: {support}
                  </p>
                </div>
              </div>
              
              {/* Sugestões de melhoria */}
              {improvementSuggestion && (
                <div style={styles.commentBox}>
                  <p style={styles.commentTitle}>
                    Sugestões de melhoria:
                  </p>
                  <p style={styles.commentText}>
                    {improvementSuggestion}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeedbackHistory;