// src/components/admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionConfirmOpen, setActionConfirmOpen] = useState(false);
  const [userToAction, setUserToAction] = useState(null);
  const [actionType, setActionType] = useState(''); // 'hide' ou 'show'
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);
  const [actionError, setActionError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showHidden, setShowHidden] = useState(false);

  // Estado para manter o controle dos usuários ocultos
  // Carregar do localStorage ao inicializar
  const [hiddenUsers, setHiddenUsers] = useState(() => {
    const saved = localStorage.getItem('hiddenUsers');
    return saved ? JSON.parse(saved) : [];
  });

  // Função para buscar usuários
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Buscar usuários da API
      const response = await apiService.admin.getAllUsers();
      setUsers(response);
      
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      setError('Ocorreu um erro ao carregar os usuários. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  // Carregar usuários ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Abrir o modal de confirmação para ocultar ou mostrar usuário
  const confirmAction = (user, action) => {
    setUserToAction(user);
    setActionType(action);
    setActionConfirmOpen(true);
    setActionError(''); // Limpar erros anteriores
  };

  // Cancelar a ação
  const cancelAction = () => {
    setUserToAction(null);
    setActionConfirmOpen(false);
    setActionType('');
  };

  // Função para salvar os usuários ocultos no localStorage e notificar outros componentes
  const saveHiddenUsers = (hiddenIds) => {
    const hiddenUsersString = JSON.stringify(hiddenIds);
    localStorage.setItem('hiddenUsers', hiddenUsersString);
    
    // Disparar um evento personalizado para notificar outros componentes
    document.dispatchEvent(new CustomEvent('userVisibilityChanged', {
      detail: { hiddenUsers: hiddenIds }
    }));
    
    // Também simular um evento de storage para compatibilidade
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'hiddenUsers',
      newValue: hiddenUsersString
    }));
  };

  // Função para ocultar um usuário
  const hideUser = async () => {
    if (!userToAction) return;
    
    try {
      setActionLoading(true);
      setActionError('');
      
      // Adicionar o ID do usuário à lista de usuários ocultos
      const updatedHiddenUsers = [...hiddenUsers, userToAction.id];
      setHiddenUsers(updatedHiddenUsers);
      
      // Salvar no localStorage para persistir entre recarregamentos e notificar outros componentes
      saveHiddenUsers(updatedHiddenUsers);
      
      // Atualizar no backend
      await apiService.admin.updateUserVisibility(userToAction.id, false);
      
      // Atualizar a contagem de usuários
      updateUserCount(-1);
      
      // Fechar o modal de confirmação
      setActionConfirmOpen(false);
      setUserToAction(null);
      setActionSuccess(true);
      
      // Exibir mensagem de sucesso por 2 segundos
      setTimeout(() => {
        setActionSuccess(false);
      }, 2000);
      
    } catch (err) {
      console.error('Erro ao ocultar usuário:', err);
      setActionError('Ocorreu um erro ao ocultar o usuário. Por favor, tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  // Função para mostrar um usuário oculto
  const showUser = async () => {
    if (!userToAction) return;
    
    try {
      setActionLoading(true);
      setActionError('');
      
      // Remover o ID do usuário da lista de usuários ocultos
      const updatedHiddenUsers = hiddenUsers.filter(id => id !== userToAction.id);
      setHiddenUsers(updatedHiddenUsers);
      
      // Salvar no localStorage para persistir entre recarregamentos e notificar outros componentes
      saveHiddenUsers(updatedHiddenUsers);
      
      // Atualizar no backend
      await apiService.admin.updateUserVisibility(userToAction.id, true);
      
      // Atualizar a contagem de usuários
      updateUserCount(1);
      
      // Fechar o modal de confirmação
      setActionConfirmOpen(false);
      setUserToAction(null);
      setActionSuccess(true);
      
      // Exibir mensagem de sucesso por 2 segundos
      setTimeout(() => {
        setActionSuccess(false);
      }, 2000);
      
    } catch (err) {
      console.error('Erro ao mostrar usuário:', err);
      setActionError('Ocorreu um erro ao mostrar o usuário. Por favor, tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  // Função para atualizar a contagem de usuários (simula a API)
  const updateUserCount = (change) => {
    // Em um ambiente real, esta função seria substituída por uma chamada 
    // à API para atualizar a contagem no servidor
    const savedCount = localStorage.getItem('simulatedUserCount');
    if (savedCount) {
      const currentCount = parseInt(savedCount);
      const newCount = Math.max(currentCount + change, 0); // Garantir que não vá abaixo de 0
      localStorage.setItem('simulatedUserCount', newCount.toString());
      
      // Notificar mudança na contagem
      document.dispatchEvent(new CustomEvent('userCountChanged', {
        detail: { count: newCount }
      }));
    }
  };

  // Filtrar usuários com base no termo de pesquisa e no estado de visibilidade
  const filteredUsers = users.filter(user => {
    // Primeiro filtrar pelo termo de pesquisa
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Depois filtrar pelo estado de visibilidade
    if (showHidden) {
      // Se estamos mostrando ocultos, então incluir todos os que passaram pelo filtro de pesquisa
      return matchesSearch;
    } else {
      // Se não estamos mostrando ocultos, então incluir apenas os visíveis que passaram pelo filtro de pesquisa
      return matchesSearch && !hiddenUsers.includes(user.id);
    }
  });

  // Paginação
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Verificar se um usuário está oculto
  const isUserHidden = (userId) => {
    return hiddenUsers.includes(userId);
  };

  // Estilização
  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '32px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#4f46e5',
      margin: 0
    },
    searchBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px'
    },
    controlsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    searchInput: {
      flex: 1,
      padding: '10px 16px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '14px'
    },
    toggleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    toggleLabel: {
      fontSize: '14px',
      color: '#4b5563'
    },
    toggleButton: {
      padding: '8px 12px',
      backgroundColor: '#f3f4f6',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#4b5563'
    },
    toggleButtonActive: {
      backgroundColor: '#e0e7ff',
      borderColor: '#4f46e5',
      color: '#4f46e5'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#f9fafb',
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      borderBottom: '1px solid #e5e7eb'
    },
    tableCell: {
      padding: '12px 16px',
      fontSize: '14px',
      color: '#4b5563',
      borderBottom: '1px solid #e5e7eb'
    },
    tableCellHidden: {
      padding: '12px 16px',
      fontSize: '14px',
      color: '#9ca3af',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb',
      fontStyle: 'italic'
    },
    adminBadge: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      padding: '2px 8px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500'
    },
    employeeBadge: {
      backgroundColor: '#e0e7ff',
      color: '#4338ca',
      padding: '2px 8px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500'
    },
    hiddenBadge: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      padding: '2px 8px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500'
    },
    actionButton: {
      border: 'none',
      borderRadius: '4px',
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    editButton: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      marginRight: '8px'
    },
    hideButton: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c'
    },
    showButton: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '40px'
    },
    loadingSpinner: {
      border: '4px solid #f3f4f6',
      borderTop: '4px solid #4f46e5',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 16px'
    },
    errorContainer: {
      backgroundColor: '#fee2e2',
      padding: '16px',
      borderRadius: '8px',
      color: '#b91c1c',
      marginBottom: '24px'
    },
    successContainer: {
      backgroundColor: '#d1fae5',
      padding: '16px',
      borderRadius: '8px',
      color: '#065f46',
      marginBottom: '24px'
    },
    paginationContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '24px'
    },
    paginationInfo: {
      fontSize: '14px',
      color: '#6b7280'
    },
    paginationControls: {
      display: 'flex',
      gap: '8px'
    },
    paginationButton: {
      padding: '6px 12px',
      borderRadius: '6px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      color: '#4b5563',
      cursor: 'pointer'
    },
    paginationButtonActive: {
      backgroundColor: '#4f46e5',
      color: 'white',
      border: '1px solid #4f46e5'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#6b7280',
      fontSize: '16px'
    },
    // Estilos para o modal de confirmação
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#111827'
    },
    modalText: {
      marginBottom: '24px',
      color: '#4b5563'
    },
    modalHighlight: {
      color: '#b91c1c',
      fontWeight: '500'
    },
    modalError: {
      color: '#b91c1c',
      marginBottom: '16px',
      backgroundColor: '#fee2e2',
      padding: '8px',
      borderRadius: '4px'
    },
    modalButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px'
    },
    cancelModalBtn: {
      padding: '8px 16px',
      borderRadius: '8px',
      backgroundColor: 'white',
      border: '1px solid #d1d5db',
      color: '#4b5563',
      cursor: 'pointer'
    },
    confirmActionBtn: (actionType) => ({
      padding: '8px 16px',
      borderRadius: '8px',
      backgroundColor: actionType === 'hide' ? '#ef4444' : '#10b981',
      border: 'none',
      color: 'white',
      cursor: 'pointer'
    })
  };

  // Modal de confirmação de ação
  const ActionConfirmationModal = () => {
    if (!actionConfirmOpen) return null;
    
    const isHideAction = actionType === 'hide';
    const actionText = isHideAction ? 'ocultar' : 'mostrar';
    const buttonText = isHideAction ? 'Ocultar Usuário' : 'Mostrar Usuário';
    const actionFunction = isHideAction ? hideUser : showUser;
    
    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <h3 style={styles.modalTitle}>Confirmar ação</h3>
          <p style={styles.modalText}>
            Tem certeza que deseja {actionText} o usuário <strong>{userToAction?.name}</strong>?
            {isHideAction && ' Este usuário não aparecerá mais nas listagens padrão.'}
          </p>
          
          {userToAction?.role === 'admin' && isHideAction && (
            <p style={styles.modalText}>
              <span style={styles.modalHighlight}>Atenção:</span> Este usuário possui privilégios de administrador!
            </p>
          )}
          
          {actionError && (
            <div style={styles.modalError}>
              {actionError}
            </div>
          )}
          
          <div style={styles.modalButtons}>
            <button 
              style={styles.cancelModalBtn} 
              onClick={cancelAction}
              disabled={actionLoading}
            >
              Cancelar
            </button>
            <button 
              style={styles.confirmActionBtn(actionType)} 
              onClick={actionFunction}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processando...' : buttonText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p>Carregando usuários...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Gerenciamento de Usuários</h2>
      </div>
      
      {error && (
        <div style={styles.errorContainer}>
          <p>{error}</p>
          <button 
            style={{
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '8px'
            }}
            onClick={fetchUsers}
          >
            Tentar novamente
          </button>
        </div>
      )}
      
      {actionSuccess && (
        <div style={styles.successContainer}>
          <p>Operação realizada com sucesso!</p>
        </div>
      )}
      
      <div style={styles.controlsContainer}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Buscar por nome, email ou departamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        
        <div style={styles.toggleContainer}>
          <span style={styles.toggleLabel}>Mostrar usuários ocultos:</span>
          <button
            style={{
              ...styles.toggleButton,
              ...(showHidden ? styles.toggleButtonActive : {})
            }}
            onClick={() => setShowHidden(!showHidden)}
          >
            {showHidden ? 'Sim' : 'Não'}
          </button>
        </div>
      </div>
      
      {currentUsers.length === 0 ? (
        <div style={styles.emptyState}>
          {searchTerm 
            ? `Nenhum usuário encontrado para a pesquisa "${searchTerm}".` 
            : 'Nenhum usuário cadastrado.'}
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Nome</th>
                  <th style={styles.tableHeader}>Email</th>
                  <th style={styles.tableHeader}>Departamento</th>
                  <th style={styles.tableHeader}>Função</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => {
                  const userHidden = isUserHidden(user.id);
                  return (
                    <tr key={user.id}>
                      <td style={userHidden ? styles.tableCellHidden : styles.tableCell}>{user.name}</td>
                      <td style={userHidden ? styles.tableCellHidden : styles.tableCell}>{user.email}</td>
                      <td style={userHidden ? styles.tableCellHidden : styles.tableCell}>{user.department}</td>
                      <td style={userHidden ? styles.tableCellHidden : styles.tableCell}>
                        <span style={user.role === 'admin' ? styles.adminBadge : styles.employeeBadge}>
                          {user.role === 'admin' ? 'Administrador' : 'Funcionário'}
                        </span>
                      </td>
                      <td style={userHidden ? styles.tableCellHidden : styles.tableCell}>
                        {userHidden && (
                          <span style={styles.hiddenBadge}>
                            Oculto
                          </span>
                        )}
                        {!userHidden && (
                          <span style={{
                            backgroundColor: '#d1fae5',
                            color: '#065f46',
                            padding: '2px 8px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            Visível
                          </span>
                        )}
                      </td>
                      <td style={userHidden ? styles.tableCellHidden : styles.tableCell}>
                        <button 
                          style={{...styles.actionButton, ...styles.editButton}}
                          onClick={() => alert('Funcionalidade de edição não implementada')}
                        >
                          Editar
                        </button>
                        {!userHidden ? (
                          <button 
                            style={{...styles.actionButton, ...styles.hideButton}}
                            onClick={() => confirmAction(user, 'hide')}
                          >
                            Ocultar
                          </button>
                        ) : (
                          <button 
                            style={{...styles.actionButton, ...styles.showButton}}
                            onClick={() => confirmAction(user, 'show')}
                          >
                            Mostrar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Paginação */}
          <div style={styles.paginationContainer}>
            <div style={styles.paginationInfo}>
              Mostrando {indexOfFirstUser + 1} a {Math.min(indexOfLastUser, filteredUsers.length)} de {filteredUsers.length} usuários
            </div>
            <div style={styles.paginationControls}>
              <button 
                style={styles.paginationButton}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Lógica para mostrar 5 páginas por vez
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else {
                  const middlePage = Math.min(Math.max(currentPage, 3), totalPages - 2);
                  pageNum = middlePage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    style={{
                      ...styles.paginationButton,
                      ...(currentPage === pageNum ? styles.paginationButtonActive : {})
                    }}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button 
                style={styles.paginationButton}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Modal de confirmação de ação */}
      <ActionConfirmationModal />
    </div>
  );
};

export default UserManagement;