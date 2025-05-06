// src/services/exportService.js
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const exportService = {
  // Exportar para PDF
  exportToPDF: (data, options) => {
    try {
      const { selectedData, dateRange } = options;
      
      // Criar novo documento PDF
      const doc = new jsPDF();
      
      // Adicionar título
      doc.setFontSize(16);
      doc.text('Relatório de Feedbacks', 105, 15, { align: 'center' });
      
      // Adicionar período
      let periodoTexto = '';
      switch (dateRange) {
        case 'last-week': periodoTexto = 'Última Semana'; break;
        case 'last-month': periodoTexto = 'Último Mês'; break;
        case 'last-quarter': periodoTexto = 'Último Trimestre'; break;
        case 'year-to-date': periodoTexto = 'Desde o Início do Ano'; break;
        default: periodoTexto = 'Período Personalizado';
      }
      
      doc.setFontSize(12);
      doc.text(`Período: ${periodoTexto}`, 105, 25, { align: 'center' });
      doc.text(`Data de Exportação: ${new Date().toLocaleDateString('pt-BR')}`, 105, 32, { align: 'center' });
      
      // Adicionar dados dos feedbacks
      let yPos = 50;
      
      // Verificar se há dados para exportar
      if (!data || data.length === 0) {
        doc.text('Nenhum feedback encontrado para o período selecionado.', 20, yPos);
      } else {
        // Para cada feedback
        data.forEach((feedback, index) => {
          // Verificar se ainda há espaço na página
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          
          // Cabeçalho do feedback
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text(`Feedback #${index + 1} - ${feedback.name || 'Funcionário'} (${feedback.date || 'Data não informada'})`, 20, yPos);
          yPos += 10;
          
          // Dados selecionados
          doc.setFont(undefined, 'normal');
          doc.setFontSize(10);
          
          if (selectedData.motivation) {
            doc.text(`Motivação: ${feedback.motivation || 0}/10`, 25, yPos);
            yPos += 7;
          }
          
          if (selectedData.workload) {
            doc.text(`Carga de Trabalho: ${feedback.workload || 0}/10`, 25, yPos);
            yPos += 7;
          }
          
          if (selectedData.performance) {
            doc.text(`Rendimento: ${feedback.performance || 0}/10`, 25, yPos);
            yPos += 7;
          }
          
          if (selectedData.support) {
            doc.text(`Apoio da Equipe: ${feedback.support || 'Não informado'}`, 25, yPos);
            yPos += 7;
          }
          
          if (selectedData.comments && feedback.improvementSuggestion) {
            doc.text(`Sugestões: ${feedback.improvementSuggestion}`, 25, yPos);
            yPos += 7;
          }
          
          // Linha separadora
          doc.setDrawColor(200, 200, 200);
          doc.line(20, yPos, 190, yPos);
          yPos += 15;
        });
      }
      
      // Gerar e fazer download do PDF
      doc.save(`relatorio_feedbacks_${dateRange}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      return true;
    } catch (error) {
      console.error('Erro ao exportar para PDF:', error);
      throw error;
    }
  },
  
  // Exportar para Excel
  exportToExcel: (data, options) => {
    try {
      const { selectedData, dateRange } = options;
      
      // Preparar dados para exportação
      const worksheetData = [];
      
      // Adicionar cabeçalho
      const headers = ['Nome', 'Departamento', 'Data'];
      if (selectedData.motivation) headers.push('Motivação');
      if (selectedData.workload) headers.push('Carga de Trabalho');
      if (selectedData.performance) headers.push('Rendimento');
      if (selectedData.support) headers.push('Apoio da Equipe');
      if (selectedData.comments) headers.push('Sugestões');
      
      worksheetData.push(headers);
      
      // Adicionar dados
      if (data && data.length > 0) {
        data.forEach(feedback => {
          const row = [
            feedback.name || '',
            feedback.dept || '',
            feedback.date || ''
          ];
          
          if (selectedData.motivation) row.push(feedback.motivation || 0);
          if (selectedData.workload) row.push(feedback.workload || 0);
          if (selectedData.performance) row.push(feedback.performance || 0);
          if (selectedData.support) row.push(feedback.support || '');
          if (selectedData.comments) row.push(feedback.improvementSuggestion || '');
          
          worksheetData.push(row);
        });
      }
      
      // Criar planilha
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Criar workbook e adicionar planilha
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Feedbacks');
      
      // Gerar arquivo e fazer download
      let periodoTexto = '';
      switch (dateRange) {
        case 'last-week': periodoTexto = 'ultima_semana'; break;
        case 'last-month': periodoTexto = 'ultimo_mes'; break;
        case 'last-quarter': periodoTexto = 'ultimo_trimestre'; break;
        case 'year-to-date': periodoTexto = 'ano_atual'; break;
        default: periodoTexto = 'personalizado';
      }
      
      XLSX.writeFile(wb, `relatorio_feedbacks_${periodoTexto}_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      return true;
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      throw error;
    }
  }
};

export default exportService;