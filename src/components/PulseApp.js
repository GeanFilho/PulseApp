// src/components/PulseApp.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ExportReport from './ExportReport';

// Estilos embutidos como objetos JavaScript
const styles = {
  // Layout principal
  container: {
    display: 'flex',
    height: '100vh'
  },
  sidebar: {
    width: '280px',
    background: 'linear-gradient(to bottom, #4f46e5, #7e22ce)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    color: 'white'
  },
  mainContent: {
    flex: 1,
    padding: '32px',
    overflow: 'auto',
    backgroundColor: '#f9fafb'
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto'
  },

  // Sidebar
  sidebarHeader: {
    padding: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    display: 'flex',
    alignItems: 'center'
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    backgroundColor: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  sidebarContent: {
    padding: '24px'
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center'
  },
  userAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(to right, #14b8a6, #0ea5e9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginRight: '16px'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontWeight: '500',
    margin: 0
  },
  userRole: {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0
  },
  sidebarNav: {
    marginTop: '24px'
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0
  },
  navItem: {
    marginBottom: '8px'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '12px',
    color: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left'
  },
  navLinkActive: {
    backgroundColor: 'white',
    color: '#4f46e5',
    fontWeight: '500',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  navIcon: {
    marginRight: '12px'
  },

  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  pageTitle: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  },

  // Feedback Form
  feedbackForm: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '24px',
    borderLeft: '4px solid #4f46e5',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#4f46e5',
    marginTop: 0,
    marginBottom: '8px'
  },
  formSubtitle: {
    color: '#4b5563',
    marginBottom: '24px'
  },
  ratingSection: {
    marginBottom: '24px'
  },
  ratingLabel: {
    display: 'block',
    fontWeight: '500',
    marginBottom: '12px',
    color: '#374151'
  },
  ratingButtons: {
    display: 'flex',
    gap: '16px',
    marginBottom: '8px'
  },
  ratingButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '2px solid #4f46e5',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#4f46e5',
    cursor: 'pointer'
  },
  ratingButtonSelected: {
    backgroundColor: '#4f46e5',
    color: 'white'
  },
  emojiButtons: {
    display: 'flex',
    gap: '16px',
    marginBottom: '12px'
  },
  emojiButton: (index) => {
    const colors = ['#ef4444', '#f59e0b', '#4f46e5', '#10b981', '#9333ea'];
    return {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      border: `2px solid ${colors[index]}`,
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      cursor: 'pointer'
    };
  },
  emojiButtonSelected: (index) => {
    const colors = ['#ef4444', '#f59e0b', '#4f46e5', '#10b981', '#9333ea'];
    return {
      backgroundColor: colors[index]
    };
  },
  formGroup: {
    marginBottom: '24px'
  },
  formControl: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    minHeight: '100px',
    resize: 'vertical'
  },
  submitButton: {
    background: 'linear-gradient(to right, #4f46e5, #9333ea)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '500',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer'
  },
  submitButtonDisabled: {
    opacity: '0.7',
    cursor: 'not-allowed'
  },
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '16px',
    padding: '16px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#065f46',
    borderRadius: '8px',
    borderLeft: '4px solid #10b981'
  },
  successIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px'
  },

  // Admin Dashboard
  adminDashboard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    borderTop: '4px solid #9333ea',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  dashboardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  dashboardTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#9333ea',
    margin: 0
  },
  dashboardControls: {
    display: 'flex',
    gap: '12px'
  },
  periodSelect: {
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px 12px'
  },
  exportButton: {
    backgroundColor: '#9333ea',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginBottom: '32px'
  },
  statCard: (index) => {
    const colors = ['#eef2ff', '#d1fae5', '#faf5ff'];
    const borderColors = ['#4f46e5', '#10b981', '#9333ea'];
    return {
      background: `linear-gradient(to bottom right, ${colors[index]}, white)`,
      padding: '24px',
      borderRadius: '16px',
      borderBottom: `4px solid ${borderColors[index]}`,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    };
  },
  statTitle: {
    fontSize: '1.125rem',
    fontWeight: '500',
    marginTop: 0,
    marginBottom: '8px',
    color: '#374151'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0
  },
  statTrend: (isPositive = true) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    marginTop: '8px',
    color: isPositive ? '#10b981' : '#ef4444'
  }),
  statTrendIcon: {
    marginRight: '4px'
  },
  statDetail: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '8px'
  },
  feedbackListTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#1f2937'
  },
  feedbackList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  feedbackItem: {
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '16px',
    padding: '16px',
    borderRadius: '8px',
    transition: 'background-color 0.2s ease'
  },
  feedbackItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  feedbackAuthor: {
    fontWeight: '500',
    color: '#4f46e5'
  },
  feedbackDept: {
    backgroundColor: '#f3f4f6',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  feedbackContent: {
    color: '#374151',
    margin: 0
  },
  viewAllButton: {
    display: 'flex',
    alignItems: 'center',
    color: '#4f46e5',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    padding: 0,
    marginTop: '24px',
    cursor: 'pointer'
  },
  
  // Feedback History
  historyContainer: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    marginTop: '32px',
    borderLeft: '4px solid #4f46e5',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  historyTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#4f46e5',
    marginTop: 0,
    marginBottom: '24px'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  historyItem: {
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  },
  historyItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  historyDate: {
    fontWeight: '500',
    color: '#4f46e5'
  },
  historyRatings: {
    display: 'flex',
    gap: '16px'
  },
  historyRating: {
    fontSize: '14px',
    color: '#374151'
  },
  historyComment: {
    margin: '0',
    color: '#4b5563'
  },
  historyEmptyState: {
    padding: '24px',
    textAlign: 'center',
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    marginTop: '32px'
  }
};

// Componente principal do aplicativo Pulse
const PulseApp = ({ userFeedback = [], adminData = {} }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  
  // Novo estado para a pesquisa de clima
  const [surveyData, setSurveyData] = useState({
    motivation: null,
    workload: null,
    performance: null,
    support: null, // 'Sim', 'Não' ou 'Em partes'
    positiveEvent: '',
    improvementSuggestion: ''
  });
  
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Atualizar a função para lidar com as mudanças nos inputs do formulário
  const handleSurveyChange = (field, value) => {
    setSurveyData({
      ...surveyData,
      [field]: value
    });
  };

  // Verificar se o formulário está completo
  const isFormComplete = () => {
    return (
      surveyData.motivation !== null &&
      surveyData.workload !== null &&
      surveyData.performance !== null &&
      surveyData.support !== null
    );
  };

  // Atualizar a função de envio
  const handleSubmitFeedback = async () => {
    try {
      // Em produção, seria algo como:
      // await api.post('/feedback', {
      //   userId: currentUser.id,
      //   date: new Date().toISOString().split('T')[0],
      //   ...surveyData
      // });
      
      console.log("Dados enviados:", surveyData);
      
      // Simulando sucesso
      setFeedbackSent(true);
      
      // Resetar após 3 segundos
      setTimeout(() => {
        setFeedbackSent(false);
        setSurveyData({
          motivation: null,
          workload: null,
          performance: null,
          support: null,
          positiveEvent: '',
          improvementSuggestion: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
    }
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Componente de histórico de feedback
  const FeedbackHistory = ({ userFeedback }) => {
    if (!userFeedback || userFeedback.length === 0) {
      return (
        <div style={styles.historyEmptyState}>
          <p>Nenhum feedback anterior encontrado.</p>
        </div>
      );
    }
    
    // Função para renderizar as avaliações numéricas como barras coloridas
    const renderRatingBar = (rating, maxRating = 10) => {
      // Determinar a cor com base na pontuação
      const getColor = (score) => {
        if (score <= 3) return '#ef4444'; // Vermelho para pontuações baixas
        if (score <= 6) return '#f59e0b'; // Amarelo para pontuações médias
        return '#10b981'; // Verde para pontuações altas
      };
      
      const percentage = (rating / maxRating) * 100;
      
      return (
        <div style={{
          width: '100%',
          backgroundColor: '#f3f4f6',
          height: '8px',
          borderRadius: '4px',
          marginTop: '4px',
          position: 'relative'
        }}>
          <div style={{
            width: `${percentage}%`,
            backgroundColor: getColor(rating),
            height: '8px',
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      );
    };
    
    return (
      <div style={styles.historyContainer}>
        <h3 style={styles.historyTitle}>Histórico de Pesquisas Semanais</h3>
        
        <div style={styles.historyList}>
          {userFeedback.map((feedback) => {
            const date = new Date(feedback.date);
            const formattedDate = date.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
            
            // Adaptar o histórico para o novo formato de pesquisa
            // Estamos assumindo que os dados antigos têm campos compatíveis ou foram migrados
            return (
              <div key={feedback.id} style={styles.historyItem}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '8px'
                }}>
                  <span style={{
                    fontWeight: '600',
                    color: '#4f46e5',
                    fontSize: '1.1rem'
                  }}>Semana: {formattedDate}</span>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>Motivação: {feedback.motivation || feedback.wellbeing || 0}/10</p>
                    {renderRatingBar(feedback.motivation || feedback.wellbeing)}
                  </div>
                  
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>Carga de Trabalho: {feedback.workload || 5}/10</p>
                    {renderRatingBar(feedback.workload || 5)}
                  </div>
                  
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>Rendimento: {feedback.performance || feedback.productivity}/10</p>
                    {renderRatingBar(feedback.performance || feedback.productivity)}
                  </div>
                  
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>
                      Apoio da equipe: {feedback.support || 'Não informado'}
                    </p>
                  </div>
                </div>
    
                
                {/* Sugestões de melhoria */}
                {feedback.improvementSuggestion && (
                  <div style={{
                    backgroundColor: '#fff7ed',
                    padding: '12px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #f59e0b'
                  }}>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '500', color: '#9a3412' }}>
                      Sugestões de melhoria:
                    </p>
                    <p style={{ margin: 0, color: '#9a3412' }}>
                      {feedback.improvementSuggestion}
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

  // Formulário de feedback semanal atualizado
  const WeeklyForm = () => {
    // Estilo para cabeçalho e título
    const headerStyle = {
      textAlign: 'center',
      marginBottom: '24px'
    };
    
    // Estilo para os botões de escala
    const scaleButtonsStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px'
    };
    
    // Estilo para legenda da escala
    const scaleLegendStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.8rem',
      color: '#6b7280',
      marginBottom: '24px'
    };
    
    // Estilo para botões de rádio
    const radioGroupStyle = {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px'
    };
    
    // Estilo para label de rádio
    const radioLabelStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer'
    };
    
    // Renderizar botões de escala (0-10)
    const renderScaleButtons = (field, value) => {
      return (
        <div style={scaleButtonsStyle}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              type="button"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '2px solid #4f46e5',
                backgroundColor: value === num ? '#4f46e5' : 'transparent',
                color: value === num ? 'white' : '#4f46e5',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => handleSurveyChange(field, num)}
            >
              {num}
            </button>
          ))}
        </div>
      );
    };
    
    return (
      <div>
        <div style={styles.feedbackForm}>
          <div style={headerStyle}>
            <h2 style={{
              fontSize: '1.75rem',
              color: '#4f46e5',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              📝 Pesquisa de Clima Organizacional Semanal
            </h2>
            <h3 style={{
              fontSize: '1.5rem',
              color: '#111827',
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              🚀 Como foi sua semana na Profitlabs?
            </h3>
            <p style={{
              color: '#4b5563',
              fontSize: '1rem'
            }}>
              Leva menos de 3 minutos! Sua resposta é super importante para melhorar nosso ambiente de trabalho. Vamos juntos crescer!
            </p>
          </div>
          
          <div style={styles.ratingSection}>
            <label style={styles.ratingLabel}>
              1. De 0 a 10, como você avalia seu nível de motivação esta semana?
            </label>
            {renderScaleButtons('motivation', surveyData.motivation)}
            <div style={scaleLegendStyle}>
              <span>Nada motivado</span>
              <span>Super motivado</span>
            </div>
          </div>
          
          <div style={styles.ratingSection}>
            <label style={styles.ratingLabel}>
              2. De 0 a 10, como você avalia sua carga de trabalho esta semana?
            </label>
            {renderScaleButtons('workload', surveyData.workload)}
            <div style={scaleLegendStyle}>
              <span>Extremamente sobrecarregado</span>
              <span>Bem equilibrado</span>
            </div>
          </div>
          
          <div style={styles.ratingSection}>
            <label style={styles.ratingLabel}>
              3. De 0 a 10, como você avaliaria o seu próprio rendimento esta semana?
            </label>
            {renderScaleButtons('performance', surveyData.performance)}
            <div style={scaleLegendStyle}>
              <span>Muito abaixo do esperado</span>
              <span>Muito produtivo e eficiente</span>
            </div>
          </div>
          
          <div style={styles.ratingSection}>
            <label style={styles.ratingLabel}>
              4. Você sentiu que teve apoio suficiente do seu time e líderes para executar seu trabalho?
            </label>
            <div style={radioGroupStyle}>
              {['Sim', 'Não', 'Em partes'].map((option) => (
                <label key={option} style={radioLabelStyle}>
                  <input
                    type="radio"
                    name="support"
                    value={option}
                    checked={surveyData.support === option}
                    onChange={() => handleSurveyChange('support', option)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.ratingLabel}>
              5. Conte-nos sobre algo positivo que aconteceu na sua semana
            </label>
            <textarea
              style={styles.formControl}
              placeholder="Compartilhe conosco os pontos altos da sua semana..."
              value={surveyData.positiveEvent}
              onChange={(e) => handleSurveyChange('positiveEvent', e.target.value)}
            ></textarea>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.ratingLabel}>
              6. Existe algo que poderíamos melhorar para a próxima semana?
            </label>
            <textarea
              style={styles.formControl}
              placeholder="Suas sugestões são valiosas para nós..."
              value={surveyData.improvementSuggestion}
              onChange={(e) => handleSurveyChange('improvementSuggestion', e.target.value)}
            ></textarea>
          </div>
          
          <button
            style={{
              ...styles.submitButton,
              ...(isFormComplete() ? {} : styles.submitButtonDisabled)
            }}
            onClick={handleSubmitFeedback}
            disabled={!isFormComplete()}
          >
            Enviar Feedback
          </button>
          
          {feedbackSent && (
            <div style={styles.successMessage}>
              <div style={styles.successIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              Feedback enviado com sucesso! Obrigado pela sua participação.
            </div>
          )}
        </div>
        
        {userFeedback && userFeedback.length > 0 && <FeedbackHistory userFeedback={userFeedback} />}
      </div>
    );
  };

  // Painel de administrador atualizado
  const AdminDashboard = () => {
    // Obter os dados da prop adminData
    const stats = adminData?.stats || {
      responseRate: 0,
      motivationAvg: 0,
      workloadAvg: 0,
      performanceAvg: 0,
      supportYesPercentage: 0,
      supportPartialPercentage: 0,
      supportNoPercentage: 0,
      totalEmployees: 0,
      pendingFeedbacks: 0
    };
    
    const recentFeedbacks = adminData?.recentFeedbacks || [];

    return (
      <div style={styles.adminDashboard}>
        <div style={styles.dashboardHeader}>
          <h2 style={styles.dashboardTitle}>Painel de Análises</h2>
          <div style={styles.dashboardControls}>
            <select style={styles.periodSelect}>
              <option>Última semana</option>
              <option>Último mês</option>
              <option>Último trimestre</option>
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
            <p style={styles.statValue}>{stats.responseRate}%</p>
            <div style={styles.statTrend()}>
              <span style={styles.statTrendIcon}>↑</span>
              +5% em relação à semana anterior
            </div>
          </div>
          <div style={styles.statCard(1)}>
            <h3 style={styles.statTitle}>Média de Motivação</h3>
            <p style={styles.statValue}>{stats.motivationAvg}/10</p>
            <div style={styles.statTrend()}>
              <span style={styles.statTrendIcon}>↑</span>
              +0.3 em relação à semana anterior
            </div>
          </div>
          <div style={styles.statCard(2)}>
            <h3 style={styles.statTitle}>Carga de Trabalho</h3>
            <p style={styles.statValue}>{stats.workloadAvg}/10</p>
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
            <p style={styles.statValue}>{stats.performanceAvg}/10</p>
            <div style={styles.statTrend()}>
              <span style={styles.statTrendIcon}>↑</span>
              +0.2 em relação à semana anterior
            </div>
          </div>
          <div style={styles.statCard(0)}>
            <h3 style={styles.statTitle}>Apoio da Equipe</h3>
            <p style={styles.statValue}>{stats.supportYesPercentage}%</p>
            <div style={styles.statDetail}>
              Sim: {stats.supportYesPercentage}% | 
              Em partes: {stats.supportPartialPercentage}% | 
              Não: {stats.supportNoPercentage}%
            </div>
          </div>
          <div style={styles.statCard(2)}>
            <h3 style={styles.statTitle}>Pendentes</h3>
            <p style={styles.statValue}>{stats.pendingFeedbacks}</p>
            <div style={styles.statDetail}>
              De um total de {stats.totalEmployees} funcionários
            </div>
          </div>
        </div>

        {/* Gráfico de tendência (visualização simplificada) */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
          borderLeft: '4px solid #4f46e5'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#1f2937'
          }}>Tendência de Motivação</h3>
          
          <div style={{
            height: '200px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px',
            marginBottom: '16px'
          }}>
            {[7.2, 6.8, 7.0, 7.4, 7.6, 7.5, 7.8, 7.6].map((value, index) => (
              <div key={index} style={{
                height: `${(value / 10) * 100}%`,
                flex: 1,
                backgroundColor: '#4f46e5',
                borderRadius: '4px 4px 0 0',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  top: '-24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.875rem',
                  color: '#4b5563'
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
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
          {recentFeedbacks.map((item) => (
            <div key={item.id} style={styles.feedbackItem}>
              <div style={styles.feedbackItemHeader}>
                <span style={styles.feedbackAuthor}>{item.name}</span>
                <span style={styles.feedbackDept}>{item.dept}</span>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <span style={{
                  backgroundColor: '#eef2ff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  color: '#4f46e5'
                }}>
                  Motivação: {item.motivation}/10
                </span>
                <span style={{
                  backgroundColor: '#f0fdfa',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  color: '#0f766e'
                }}>
                  Carga: {item.workload}/10
                </span>
                <span style={{
                  backgroundColor: '#fdf2f8',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  color: '#9d174d'
                }}>
                  Rendimento: {item.performance}/10
                </span>
                <span style={{
                  backgroundColor: '#f0f9ff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  color: '#0369a1'
                }}>
                  Apoio: {item.support}
                </span>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                {item.positiveEvent && (
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#065f46',
                    borderLeft: '3px solid #10b981'
                  }}>
                    <strong>Positivo:</strong> {item.positiveEvent}
                  </div>
                )}
                
                {item.improvementSuggestion && (
                  <div style={{
                    backgroundColor: '#fff7ed',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#9a3412',
                    borderLeft: '3px solid #f59e0b'
                  }}>
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
    );
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="#4f46e5">
                <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
              </svg>
            </div>
            <h1 style={styles.logoText}>Pulse</h1>
          </div>
        </div>
        
        <div style={styles.sidebarContent}>
          <div style={styles.userCard}>
            <div style={styles.userAvatar}>
              {currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'MS'}
            </div>
            <div style={styles.userInfo}>
              <p style={styles.userName}>{currentUser?.name || 'Maria Santos'}</p>
              <p style={styles.userRole}>{isAdmin ? 'Administrador' : 'Funcionário'}</p>
            </div>
          </div>
          
          <nav style={styles.sidebarNav}>
            <ul style={styles.navList}>
              <li style={styles.navItem}>
                <button 
                  style={{
                    ...styles.navLink,
                    ...(activeTab === 'home' ? styles.navLinkActive : {})
                  }}
                  onClick={() => setActiveTab('home')}
                >
                  <span style={styles.navIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V7zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0V9z"/>
                      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                    </svg>
                  </span>
                  <span>Início</span>
                </button>
              </li>
              <li style={styles.navItem}>
                <button 
                  style={{
                    ...styles.navLink,
                    ...(activeTab === 'profile' ? styles.navLinkActive : {})
                  }}
                  onClick={() => navigate('/profile')}
                >
                  <span style={styles.navIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                    </svg>
                  </span>
                  <span>Perfil</span>
                </button>
              </li>
              {isAdmin && (
                <li style={styles.navItem}>
                  <button 
                    style={{
                      ...styles.navLink,
                      ...(activeTab === 'settings' ? styles.navLinkActive : {})
                    }}
                    onClick={() => setActiveTab('settings')}
                  >
                    <span style={styles.navIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                      </svg>
                    </span>
                    <span>Configurações</span>
                  </button>
                </li>
              )}
              <li style={styles.navItem}>
                <button 
                  style={styles.navLink}
                  onClick={handleLogout}
                >
                  <span style={styles.navIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                      <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                    </svg>
                  </span>
                  <span>Sair</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.contentContainer}>
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>
              {isAdmin ? 'Visão Geral da Equipe' : 'Meu Espaço'}
            </h1>
          </div>
          
          {isAdmin ? <AdminDashboard /> : <WeeklyForm />}
        </div>
      </div>
    </div>
  );
};

export default PulseApp;