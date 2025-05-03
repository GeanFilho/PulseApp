// src/pages/employee/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserFeedbacks, getLatestFeedback } from '../../services/feedbackService';
import FeedbackForm from '../../components/FeedbackForm';
import FeedbackHistory from '../../components/FeedbackHistory';
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
  welcomeSection: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    borderLeft: `4px solid ${theme.colors.info.main}`,
    boxShadow: theme.shadows.md
  },
  welcomeTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.info.main,
    marginTop: 0,
    marginBottom: theme.spacing.sm
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: 0
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
    borderTopColor: theme.colors.primary.main,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: theme.spacing.lg
  },
  loadingText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium
  },
  errorMessage: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: theme.colors.error.dark,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    borderLeft: `4px solid ${theme.colors.error.main}`
  }
};

const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userFeedback, setUserFeedback] = useState([]);
  const [latestFeedback, setLatestFeedback] = useState(null);
  
  // Verificar se o usuário já enviou feedback esta semana
  const [weeklyFeedbackSubmitted, setWeeklyFeedbackSubmitted] = useState(false);
  
  useEffect(() => {
    // Carregar dados do usuário
    const loadUserData = async () => {
      try {
        if (currentUser?.id) {
          setLoading(true);
          setError('');
          
          // Buscar feedbacks do usuário
          const feedbacks = await getUserFeedbacks(currentUser.id);
          setUserFeedback(feedbacks);
          
          // Verificar se já enviou feedback esta semana
          const latest = await getLatestFeedback(currentUser.id);
          setLatestFeedback(latest);
          
          if (latest) {
            const today = new Date();
            const latestDate = new Date(latest.date);
            const diffTime = Math.abs(today - latestDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Se o último feedback foi há menos de 7 dias, considerar como enviado esta semana
            setWeeklyFeedbackSubmitted(diffDays < 7);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
        setError('Ocorreu um erro ao carregar seus dados. Por favor, recarregue a página ou tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [currentUser]);
  
  // Função para lidar com o envio de feedback
  const handleFeedbackSubmitted = (newFeedback) => {
    // Adicionar o novo feedback ao estado
    setUserFeedback([newFeedback, ...userFeedback]);
    setLatestFeedback(newFeedback);
    setWeeklyFeedbackSubmitted(true);
  };
  
  // Função para formatar a data atual
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('pt-BR', options);
  };
  
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Carregando seus dados...</p>
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
          <h1 style={styles.pageTitle}>Meu Espaço</h1>
        </div>
        
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <div style={styles.welcomeSection}>
          <h2 style={styles.welcomeTitle}>Olá, {currentUser?.name || 'Usuário'}!</h2>
          <p style={styles.welcomeText}>
            Hoje é {getCurrentDate()}. {weeklyFeedbackSubmitted 
              ? 'Você já enviou seu feedback desta semana. Obrigado por contribuir!' 
              : 'Não esqueça de compartilhar como foi sua semana.'}
          </p>
        </div>
        
        {/* Mostrar formulário apenas se ainda não enviou feedback esta semana */}
        {!weeklyFeedbackSubmitted && (
          <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
        )}
        
        {/* Histórico de feedback */}
        <FeedbackHistory feedbacks={userFeedback} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;