import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PulseApp from '../../components/PulseApp';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState({
    stats: {},
    recentFeedbacks: []
  });
  
  useEffect(() => {
    // Simular carregamento de dados
    const loadAdminData = async () => {
      try {
        // Em uma implementação real, você faria uma chamada à API
        setTimeout(() => {
          setAdminData({
            stats: {
              responseRate: 87,
              motivationAvg: 7.6,
              workloadAvg: 6.2,
              performanceAvg: 7.8,
              supportYesPercentage: 64,
              supportPartialPercentage: 28,
              supportNoPercentage: 8,
              totalEmployees: 42,
              pendingFeedbacks: 5
            },
            recentFeedbacks: [
              { 
                id: 1, 
                name: 'Ana Silva', 
                dept: 'Marketing', 
                date: '2025-04-24', 
                motivation: 9,
                workload: 7,
                performance: 8,
                support: 'Sim',
                improvementSuggestion: 'Gostaria de ter mais oportunidades de colaboração entre equipes.'
              },
              { 
                id: 2, 
                name: 'Carlos Mendes', 
                dept: 'Desenvolvimento', 
                date: '2025-04-23', 
                motivation: 5,
                workload: 3,
                performance: 6,
                support: 'Em partes',
                improvementSuggestion: 'Estamos com alguns problemas técnicos que estão atrasando entregas.'
              },
            
                { 
                  id: 3, 
                  name: 'Julia Oliveira', 
                  dept: 'RH', 
                  date: '2025-04-22', 
                  motivation: 10,
                  workload: 8,
                  performance: 9,
                  support: 'Sim',
                  improvementSuggestion: 'O novo programa de mentoria está recebendo feedback muito positivo!'
                },
                { 
                  id: 4, 
                  name: 'Roberto Alves', 
                  dept: 'Vendas', 
                  date: '2025-04-22', 
                  motivation: 8,
                  workload: 6,
                  performance: 9,
                  support: 'Sim',
                  improvementSuggestion: 'Conseguimos bater a meta mensal com uma semana de antecedência.'
                },              
                  { 
                    id: 5, 
                    name: 'Fernanda Costa', 
                    dept: 'Financeiro', 
                    date: '2025-04-21', 
                    motivation: 6,
                    workload: 5,
                    performance: 7,
                    support: 'Em partes',
                    improvementSuggestion: 'Precisamos de mais treinamento na nova ferramenta de gestão financeira.'
                  }
                ]
              });
              setLoading(false);
            }, 1000); // Simula um atraso de rede de 1 segundo
          } catch (error) {
            console.error('Erro ao carregar dados de admin:', error);
            setLoading(false);
          }
        };
        
        loadAdminData();
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
              borderTopColor: '#7e22ce', // Cor diferente para administrador
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '16px'
            }}></div>
            <p style={{
              color: '#4b5563',
              fontSize: '16px',
              fontWeight: '500'
            }}>Carregando dashboard...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        );
      }
      return <PulseApp adminData={adminData} />;
};

export default AdminDashboard;