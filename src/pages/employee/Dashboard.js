import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PulseApp from '../../components/PulseApp';

const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userFeedback, setUserFeedback] = useState([]);
  
  useEffect(() => {
    // Simular carregamento de dados
    const loadUserData = async () => {
      try {
        // Em uma implementação real, você faria uma chamada à API
        // Para nosso exemplo, vamos simular os dados
        setTimeout(() => {
          setUserFeedback([
            { 
              id: 1, 
              date: '2025-04-22', 
              productivity: 4, 
              wellbeing: 5, 
              comment: 'Semana produtiva, mas estou preocupado com os prazos do próximo projeto.' 
            },
            { 
              id: 2, 
              date: '2025-04-15', 
              productivity: 3, 
              wellbeing: 4, 
              comment: 'Semana média, tive alguns desafios com a nova tecnologia.' 
            },
            { 
              id: 3, 
              date: '2025-04-08', 
              productivity: 5, 
              wellbeing: 4, 
              comment: 'Excelente semana, consegui concluir todas as tarefas previstas.' 
            },
          ]);
          setLoading(false);
        }, 1000); // Simula um atraso de rede de 1 segundo
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [currentUser]);
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f4f6',
          borderTopColor: '#4f46e5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }}></div>
        <p style={{
          color: '#4b5563',
          fontSize: '16px',
          fontWeight: '500'
        }}>Carregando seus dados...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  return <PulseApp userFeedback={userFeedback} />;
};

export default EmployeeDashboard;