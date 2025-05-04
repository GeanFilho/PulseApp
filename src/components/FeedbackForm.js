// src/components/FeedbackForm.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import theme from '../styles/theme';

// Manter todos os estilos originais
const styles = {
  // Container do formulário
  formContainer: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    borderLeft: `4px solid ${theme.colors.primary.main}`,
    boxShadow: theme.shadows.lg
  },
  
  // Cabeçalho
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.md
  },
  description: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md
  },
  
  // Seção de avaliação
  ratingSection: {
    marginBottom: theme.spacing.xl
  },
  ratingLabel: {
    display: 'block',
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary
  },
  
  // Botões de escala
  scaleButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm
  },
  scaleButton: (selected) => ({
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: `2px solid ${theme.colors.primary.main}`,
    backgroundColor: selected ? theme.colors.primary.main : 'transparent',
    color: selected ? 'white' : theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.bold,
    cursor: 'pointer',
    transition: `all ${theme.transitions.speed.normal} ${theme.transitions.easing.easeInOut}`
  }),
  
  // Legenda da escala
  scaleLegend: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl
  },
  
  // Grupo de opções de rádio
  radioGroup: {
    display: 'flex',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    cursor: 'pointer'
  },
  radioInput: {
    width: '18px',
    height: '18px'
  },
  
  // Campo de texto
  formGroup: {
    marginBottom: theme.spacing.xl
  },
  textArea: {
    width: '100%',
    padding: theme.spacing.md,
    border: `1px solid ${theme.colors.grey[300]}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.md,
    minHeight: '100px',
    resize: 'vertical'
  },
  
  // Botão de envio
  submitButton: (disabled) => ({
    background: `linear-gradient(to right, ${theme.colors.primary.main}, ${theme.colors.secondary.main})`,
    color: 'white',
    border: 'none',
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    borderRadius: theme.borderRadius.md,
    fontWeight: theme.typography.fontWeight.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.7 : 1
  }),
  
  // Mensagem de sucesso
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: theme.colors.success.dark,
    borderRadius: theme.borderRadius.md,
    borderLeft: `4px solid ${theme.colors.success.main}`
  },
  successIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md
  }
};

const FeedbackForm = ({ onFeedbackSubmitted }) => {
  const { currentUser } = useAuth();
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    motivation: null,
    workload: null,
    performance: null,
    support: null,
    improvementSuggestion: ''
  });
  
  // Atualizar o campo do formulário
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  // Verificar se o formulário está completo (campos obrigatórios preenchidos)
  const isFormComplete = () => {
    return (
      formData.motivation !== null &&
      formData.workload !== null &&
      formData.performance !== null &&
      formData.support !== null
    );
  };
  
  // Enviar o feedback
  const handleSubmit = async () => {
    if (!isFormComplete() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const feedbackData = {
        userId: currentUser.id,
        date: new Date().toISOString().split('T')[0],
        motivation: formData.motivation,
        workload: formData.workload,
        performance: formData.performance,
        support: formData.support,
        improvementSuggestion: formData.improvementSuggestion
      };
      
      // Enviar para a API
      const savedFeedback = await apiService.feedback.submitFeedback(feedbackData);
      
      // Marcar como enviado e resetar o formulário após alguns segundos
      setFeedbackSent(true);
      
      // Chamar o callback (se fornecido) com os dados reais salvos
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(savedFeedback);
      }
      
      // Resetar após 3 segundos
      setTimeout(() => {
        setFeedbackSent(false);
        setFormData({
          motivation: null,
          workload: null,
          performance: null,
          support: null,
          improvementSuggestion: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      alert('Ocorreu um erro ao enviar seu feedback. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Renderizar botões de escala (0-10)
  const renderScaleButtons = (field, value) => {
    return (
      <div style={styles.scaleButtons}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            type="button"
            style={styles.scaleButton(value === num)}
            onClick={() => handleChange(field, num)}
          >
            {num}
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div style={styles.formContainer}>
      <div style={styles.header}>
        <h2 style={styles.title}>📝 Pesquisa de Clima Organizacional Semanal</h2>
        <h3 style={styles.subtitle}>🚀 Como foi sua semana na Profitlabs?</h3>
        <p style={styles.description}>
          Leva menos de 3 minutos! Sua resposta é super importante para melhorar nosso ambiente de trabalho.
        </p>
      </div>
      
      <div style={styles.ratingSection}>
        <label style={styles.ratingLabel}>
          1. De 0 a 10, como você avalia seu nível de motivação esta semana?
        </label>
        {renderScaleButtons('motivation', formData.motivation)}
        <div style={styles.scaleLegend}>
          <span>Nada motivado</span>
          <span>Super motivado</span>
        </div>
      </div>
      
      <div style={styles.ratingSection}>
        <label style={styles.ratingLabel}>
          2. De 0 a 10, como você avalia sua carga de trabalho esta semana?
        </label>
        {renderScaleButtons('workload', formData.workload)}
        <div style={styles.scaleLegend}>
          <span>Extremamente sobrecarregado</span>
          <span>Bem equilibrado</span>
        </div>
      </div>
      
      <div style={styles.ratingSection}>
        <label style={styles.ratingLabel}>
          3. De 0 a 10, como você avaliaria o seu próprio rendimento esta semana?
        </label>
        {renderScaleButtons('performance', formData.performance)}
        <div style={styles.scaleLegend}>
          <span>Muito abaixo do esperado</span>
          <span>Muito produtivo e eficiente</span>
        </div>
      </div>
      
      <div style={styles.ratingSection}>
        <label style={styles.ratingLabel}>
          4. Você sentiu que teve apoio suficiente do seu time e líderes para executar seu trabalho?
        </label>
        <div style={styles.radioGroup}>
          {['Sim', 'Não', 'Em partes'].map((option) => (
            <label key={option} style={styles.radioLabel}>
              <input
                type="radio"
                name="support"
                value={option}
                checked={formData.support === option}
                onChange={() => handleChange('support', option)}
                style={styles.radioInput}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.ratingLabel}>
          5. Existe algo que poderíamos melhorar para a próxima semana?
        </label>
        <textarea
          style={styles.textArea}
          placeholder="Suas sugestões são valiosas para nós..."
          value={formData.improvementSuggestion}
          onChange={(e) => handleChange('improvementSuggestion', e.target.value)}
        ></textarea>
      </div>
      
      <button
        style={styles.submitButton(!isFormComplete() || isLoading)}
        onClick={handleSubmit}
        disabled={!isFormComplete() || isLoading}
      >
        {isLoading ? 'Enviando...' : 'Enviar Feedback'}
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
  );
};

export default FeedbackForm;