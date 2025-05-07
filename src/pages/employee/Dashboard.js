// src/pages/employee/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import FeedbackForm from '../../components/FeedbackForm';
import FeedbackHistory from '../../components/FeedbackHistory';
import Navbar from '../../components/Navbar';
import theme from '../../styles/theme';

// Estilos atualizados com largura máxima e melhor centralização
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: theme.colors.background.default
  },
  content: {
    flex: 1,
    padding: '20px',
    width: '100%',
    maxWidth: '1300px', // Definindo uma largura máxima maior
    margin: '0 auto',  // Centralizando o conteúdo
    boxSizing: 'border-box'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    width: '100%'
  },
  pageTitle: {
    fontSize: 'min(2.25rem, 8vw)',
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    margin: '0 0 16px 0',
    width: '100%'
  },
  welcomeSection: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    borderLeft: `4px solid ${theme.colors.info.main}`,
    boxShadow: theme.shadows.md,
    width: '100%',
    boxSizing: 'border-box'
  },
  welcomeTitle: {
    fontSize: 'min(1.5rem, 6vw)',
    fontWeight: 'bold',
    color: theme.colors.info.main,
    marginTop: 0,
    marginBottom: '8px'
  },
  welcomeText: {
    fontSize: 'min(1rem, 4vw)',
    color: theme.colors.text.secondary,
    marginBottom: 0
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    backgroundColor: theme.colors.background.default,
    width: '100%'
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: `5px solid ${theme.colors.grey[200]}`,
    borderTopColor: theme.colors.primary.main,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  loadingText: {
    color: theme.colors.text.secondary,
    fontSize: '1rem',
    fontWeight: '500'
  },
  errorMessage: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: theme.colors.error.dark,
    padding: '16px',
    marginBottom: '24px',
    borderRadius: '8px',
    borderLeft: `4px solid ${theme.colors.error.main}`,
    width: '100%',
    boxSizing: 'border-box'
  },
  // Estilos específicos para o formulário de feedback
  feedbackFormContainer: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: theme.colors.background.paper,
    borderRadius: '12px',
    boxShadow: theme.shadows.sm,
    overflow: 'hidden'
  },
  // Estilos específicos para o histórico de feedback
  feedbackHistoryContainer: {
    width: '100%',
    boxSizing: 'border-box',
    marginTop: '30px'
  },
  // Card para envolver o conteúdo e dar mais estrutura visual
  card: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: '12px',
    boxShadow: theme.shadows.sm,
    padding: '24px',
    marginBottom: '24px',
    width: '100%',
    boxSizing: 'border-box'
  }
};

const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userFeedback, setUserFeedback] = useState([]);
  
  // Efeito para detectar mudanças no tamanho da tela
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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
  
  useEffect(() => {
    // Carregar dados do usuário
    const loadUserData = async () => {
      try {
        if (currentUser?.id) {
          setLoading(true);
          setError('');
          
          // Buscar feedbacks do usuário
          const feedbacks = await apiService.feedback.getMyFeedbacks();
          setUserFeedback(feedbacks);
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
    // Adicionar o novo feedback ao início do array de feedbacks (mais recente primeiro)
    setUserFeedback([newFeedback, ...userFeedback]);
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
            Hoje é {getCurrentDate()}. Compartilhe como está sendo sua experiência na empresa!
          </p>
        </div>
        
        {/* Container de feedback sempre disponível */}
        <div style={styles.feedbackFormContainer}>
          <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
        </div>
        
        {/* Histórico de feedback */}
        <div style={styles.feedbackHistoryContainer}>
          <FeedbackHistory feedbacks={userFeedback} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;