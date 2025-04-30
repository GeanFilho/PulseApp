// src/components/ExportReport.js
import React, { useState } from 'react';

const styles = {
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
    color: '#111827'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    fontSize: '22px'
  },
  body: {
    padding: '20px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#374151'
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    fontSize: '16px'
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px'
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  },
  cancelButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  exportButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(to right, #4f46e5, #7e22ce)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  }
};

const ExportReport = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('last-week');
  const [selectedData, setSelectedData] = useState({
    motivation: true,
    workload: true,
    performance: true,
    support: true,
    comments: true
  });

  if (!isOpen) return null;

  const handleSelectedDataChange = (field) => {
    setSelectedData({
      ...selectedData,
      [field]: !selectedData[field]
    });
  };

  const handleExport = () => {
    // Aqui seria implementada a lógica de exportação
    console.log('Exportando relatório:', {
      format,
      dateRange,
      selectedData
    });
    
    // Simular conclusão da exportação
    setTimeout(() => {
      alert('Relatório exportado com sucesso!');
      onClose();
    }, 1000);
  };

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Exportar Relatório</h2>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div style={styles.body}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="format">Formato</label>
            <select 
              id="format" 
              style={styles.select} 
              value={format} 
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="dateRange">Período</label>
            <select 
              id="dateRange" 
              style={styles.select} 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="last-week">Última semana</option>
              <option value="last-month">Último mês</option>
              <option value="last-quarter">Último trimestre</option>
              <option value="year-to-date">Desde o início do ano</option>
              <option value="custom">Período personalizado</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Dados a incluir</label>
            <div style={styles.checkboxGroup}>
              <label style={styles.checkbox}>
                <input 
                  type="checkbox" 
                  checked={selectedData.motivation} 
                  onChange={() => handleSelectedDataChange('motivation')} 
                />
                Motivação
              </label>
              <label style={styles.checkbox}>
                <input 
                  type="checkbox" 
                  checked={selectedData.workload} 
                  onChange={() => handleSelectedDataChange('workload')} 
                />
                Carga de Trabalho
              </label>
              <label style={styles.checkbox}>
                <input 
                  type="checkbox" 
                  checked={selectedData.performance} 
                  onChange={() => handleSelectedDataChange('performance')} 
                />
                Rendimento
              </label>
              <label style={styles.checkbox}>
                <input 
                  type="checkbox" 
                  checked={selectedData.support} 
                  onChange={() => handleSelectedDataChange('support')} 
                />
                Apoio da Equipe
              </label>
              <label style={styles.checkbox}>
                <input 
                  type="checkbox" 
                  checked={selectedData.comments} 
                  onChange={() => handleSelectedDataChange('comments')} 
                />
                Comentários e Sugestões
              </label>
            </div>
          </div>
        </div>
        
        <div style={styles.footer}>
          <button style={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button style={styles.exportButton} onClick={handleExport}>
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportReport;