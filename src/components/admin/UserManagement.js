// src/components/admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  // Abrir o modal de confirmação para excluir usuário
  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
    setDeleteError(''); // Limpar erros anteriores
  };

  // Cancelar a exclusão
  const cancelDelete = () => {
    setUserToDelete(null);
    setDeleteConfirmOpen(false);
  };

  // Função para excluir usuário
  const deleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setDeleteLoading(true);
      setDeleteError('');
      
      // Chamar a API para excluir o usuário
      await apiService.admin.deleteUser(userToDelete.id);
      
      // Atualizar a lista de usuários (remover o usuário excluído)
      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      // Fechar o modal de confirmação
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      setDeleteSuccess(true);
      
      // Limpar a mensagem de sucesso após alguns segundos
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
      setDeleteError('Ocorreu um erro ao excluir o usuário. Por favor, tente novamente.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtrar usuários com base no termo de pesquisa
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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
      marginBottom: '24px'
    },
    searchInput: {
      flex: 1,
      padding: '10px 16px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '14px'
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
    deleteButton: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c'
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
    confirmDeleteBtn: {
      padding: '8px 16px',
      borderRadius: '8px',
      backgroundColor: '#ef4444',
      border: 'none',
      color: 'white',
      cursor: 'pointer'
    }
  };

  // Modal de confirmação de exclusão
  const DeleteConfirmationModal = () => {
    if (!deleteConfirmOpen) return null;
    
    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <h3 style={styles.modalTitle}>Confirmar exclusão</h3>
          <p style={styles.modalText}>
            Tem certeza que deseja excluir o usuário <strong>{userToDelete?.name}</strong>?
            Esta ação não pode ser desfeita.
          </p>
          
          {userToDelete?.role === 'admin' && (
            <p style={styles.modalText}>
              <span style={styles.modalHighlight}>Atenção:</span> Este usuário possui privilégios de administrador!
            </p>
          )}
          
          {deleteError && (
            <div style={styles.modalError}>
              {deleteError}
            </div>
          )}
          
          <div style={styles.modalButtons}>
            <button 
              style={styles.cancelModalBtn} 
              onClick={cancelDelete}
              disabled={deleteLoading}
            >
              Cancelar
            </button>
            <button 
              style={styles.confirmDeleteBtn} 
              onClick={deleteUser}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Excluindo...' : 'Excluir Usuário'}
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
      
      {deleteSuccess && (
        <div style={styles.successContainer}>
          <p>Usuário excluído com sucesso!</p>
        </div>
      )}
      
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Buscar por nome, email ou departamento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
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
                  <th style={styles.tableHeader}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={styles.tableCell}>{user.name}</td>
                    <td style={styles.tableCell}>{user.email}</td>
                    <td style={styles.tableCell}>{user.department}</td>
                    <td style={styles.tableCell}>
                      <span style={user.role === 'admin' ? styles.adminBadge : styles.employeeBadge}>
                        {user.role === 'admin' ? 'Administrador' : 'Funcionário'}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <button 
                        style={{...styles.actionButton, ...styles.editButton}}
                        onClick={() => alert('Funcionalidade de edição não implementada')}
                      >
                        Editar
                      </button>
                      <button 
                        style={{...styles.actionButton, ...styles.deleteButton}}
                        onClick={() => confirmDeleteUser(user)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
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
      
      {/* Modal de confirmação de exclusão */}
      <DeleteConfirmationModal />
    </div>
  );
};

export default UserManagement;