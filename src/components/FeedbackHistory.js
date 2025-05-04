// src/components/FeedbackHistory.js
import React from 'react';
import WeeklyFeedbackDisplay from './WeeklyFeedbackDisplay';
import theme from '../styles/theme';

const styles = {
  container: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
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
        {feedbacks.map(feedback => (
          <WeeklyFeedbackDisplay
            key={feedback.id}
            feedbackData={{
              date: feedback.date,
              motivation: feedback.motivation !== undefined ? feedback.motivation : (feedback.wellbeing || 0),
              workload: feedback.workload !== undefined ? feedback.workload : 5,
              performance: feedback.performance !== undefined ? feedback.performance : (feedback.productivity || 0),
              support: feedback.support || 'Não informado',
              improvementSuggestion: feedback.improvementSuggestion || feedback.comment || ''
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedbackHistory;