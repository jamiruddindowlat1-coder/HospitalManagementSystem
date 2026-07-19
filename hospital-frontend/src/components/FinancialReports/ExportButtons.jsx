import React, { useState } from 'react';
import api from '../../services/api';

function ExportButtons({ startDate, endDate }) {
  const [exporting, setExporting] = useState(false);

  const downloadFile = async (type) => {
    setExporting(true);
    try {
      const response = await api.get(`/FinancialReports/export/${type}`, {
        params: { startDate, endDate },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const ext = type === 'pdf' ? 'pdf' : 'xlsx';
      link.setAttribute('download', `FinancialReport_${startDate}_${endDate}.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
      alert('ফাইল ডাউনলোড করতে সমস্যা হয়েছে');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-buttons">
      <button className="btn btn-danger" disabled={exporting} onClick={() => downloadFile('pdf')}>
        📄 PDF Export
      </button>
      <button className="btn btn-success" disabled={exporting} onClick={() => downloadFile('excel')}>
        📊 Excel Export
      </button>
    </div>
  );
}

export default ExportButtons;