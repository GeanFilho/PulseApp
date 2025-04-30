// src/components/Notifications.js
import React, { useState } from 'react';

const styles = {
  notificationPanel: {
    position: 'absolute',
    top: '60px',
    right: '20px',
    width: '320px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    zIndex: 1000,
    overflow: 'hidden',
    maxHeight: '500px',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  },
  clearButton: {
    background: 'none',
    border: 'none',
    color: '#4f46e5',
    fontSize: '14px',
    cursor: 'pointer'
  },
  notificationList: {
    overflowY: 'auto',
    padding: '8px 0',
    flexGrow: 1
  },
  notificationItem: {
    padding: '12px 16px',
    borderBottom: '1px solid #f3f4f6',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  },
  unread: {
    backgroundColor: '#eef2ff'
  },
  notificationIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  reminderIcon: {
    backgroundColor: '#dbeafe',
    color: '#2563eb'
  },
  alertIcon: {
    backgroundColor: '#fee2e2',
    color: '#dc2626'
  },
  successIcon: {
    backgroundColor: '#d1fae5',
    color: '#059669'
  },
  notificationContent: {
    flex: 1
  },
  notificationTitle: {
    fontWeight: '500',
    marginBottom: '4px',
    fontSize: '14px'
  },
  notificationMessage: {
    fontSize: '13px',
    color: '#4b5563',
    margin: 0
  },
  notificationTime: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px'
  },
  indicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    position: 'absolute',
    top: '16px',
    right: '16px'
  },
  empty: {
    padding: '24px 16px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px'
  }
};

const Notifications = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'reminder',
      title: 'Lembrete Semanal',
      message: 'Não se esqueça de preencher a pesquisa de clima desta semana até sexta-feira.',
      time: 'Há 2 horas',
      read: false
    },
    {
      id: 2,
      type: 'alert',
      title: 'Atenção!',
      message: 'Reunião de equipe agendada para amanhã às 14h00. Sua presença é importante.',
      time: 'Há 1 dia',
      read: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Feedback Enviado',
      message: 'Seu feedback da semana passada foi recebido. Obrigado pela contribuição!',
      time: 'Há 3 dias',
      read: true
    }
  ]);

  if (!isOpen) return null;

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? {...notification, read: true} 
        : notification
    ));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'reminder':
        return (
          <div style={{...styles.notificationIcon, ...styles.reminderIcon}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
            </svg>
          </div>
        );
      case 'alert':
        return (
          <div style={{...styles.notificationIcon, ...styles.alertIcon}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
          </div>
        );
      case 'success':
        return (
          <div style={{...styles.notificationIcon, ...styles.successIcon}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.notificationPanel}>
      <div style={styles.header}>
        <h3 style={styles.title}>Notificações</h3>
        {notifications.length > 0 && (
          <button style={styles.clearButton} onClick={clearAll}>
            Limpar tudo
          </button>
        )}
      </div>
      
      <div style={styles.notificationList}>
        {notifications.length === 0 ? (
          <div style={styles.empty}>
            Você não tem novas notificações.
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              style={{
                ...styles.notificationItem, 
                ...(notification.read ? {} : styles.unread)
              }}
              onClick={() => markAsRead(notification.id)}
            >
              {getIcon(notification.type)}
              
              <div style={styles.notificationContent}>
                <h4 style={styles.notificationTitle}>{notification.title}</h4>
                <p style={styles.notificationMessage}>{notification.message}</p>
                <span style={styles.notificationTime}>{notification.time}</span>
              </div>
              
              {!notification.read && <div style={styles.indicator}></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;