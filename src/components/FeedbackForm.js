// src/components/FeedbackForm.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

// Estilos otimizados para mobile
const styles = {
  // Container do formulário
  formContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    borderLeft: '4px solid #4f46e5',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box'
  },
  
  // Cabeçalho
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    width: '100%'
  },
  title: {
    fontSize: '18px',
    color: '#4f46e5',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#111827',
    fontWeight: 'bold',
    marginBottom: '12px'
  },
  description: {
    color: '#4b5563',
    fontSize: '14px'
  },
  
  // Seção de avaliação
  ratingSection: {
    marginBottom: '16px',
    width: '100%'
  },
  ratingLabel: {
    display: 'block',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#374151',
    fontSize: '14px'
  },
  
  // Botões de escala - com ajustes para mobile
  scaleButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    width: '100%',
    flexWrap: 'wrap',
    gap: '2px'
  },
  scaleButton: (selected) => ({
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '2px solid #4f46e5',
    backgroundColor: selected ? '#4f46e5' : 'transparent',
    color: selected ? 'white' : '#4f46e5',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    fontSize: '12px',
    padding: 0, // Remover padding
    margin: '2px', // Adicionar pequena margem
    flexShrink: 0 // Evitar encolhimento
  }),
  
  // Legenda da escala
  scaleLegend: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '16px',
    width: '100%'
  },
  
  // Grupo de opções de rádio
  radioGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px',
    flexWrap: 'wrap',
    width: '100%'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '4px' // Adicionar margem para separação vertical
  },
  radioInput: {
    width: '16px',
    height: '16px'
  },
  
  // Campo de texto
  formGroup: {
    marginBottom: '16px',
    width: '100%'
  },
  textArea: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  
  // Botão de envio
  submitButton: (disabled) => ({
    background: disabled 
      ? '#9ca3af' 
      : 'linear-gradient(to right, #4f46e5, #7e22ce)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.7 : 1,
    fontSize: '14px',
    transition: 'all 0.2s ease',
    width: '100%',
    maxWidth: '100%',
    display: 'block',
    margin: '0 auto'
  }),
  
  // Mensagem de sucesso
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '16px',
    padding: '12px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#065f46',
    borderRadius: '8px',
    borderLeft: '4px solid #10b981',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '14px'
  },
  successIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
    flexShrink: 0
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
  
  // Renderizar botões de escala (0-10) com ajustes para mobile
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
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