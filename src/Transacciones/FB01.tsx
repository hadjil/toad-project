import React, { useState } from 'react';
import '../App.css';
import DocumentHeader from '../components/DocumentHeader';
import LineItemTable from '../components/LineItemTable';
import { DocumentService } from '../services/documentService';
import { MasterDataService } from '../services/masterDataService';

interface ScreenProps {
  tCode: string;
  tDescription: string;
}

const ScreenFB01: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
  // Header State
  const [header, setHeader] = useState({
    documentDate: new Date().toISOString().split('T')[0],
    postingDate: new Date().toISOString().split('T')[0],
    type: 'SA',
    companyCode: '1000',
    currency: 'USD',
    reference: '',
    headerText: ''
  });

  // Items State
  const [items, setItems] = useState<any[]>([]);

  // UI State
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  // Master Data
  const glAccounts = MasterDataService.getGLAccounts();

  // Handlers
  const handleHeaderChange = (field: string, value: string) => {
    setHeader(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    setItems(prev => [...prev, {
      lineId: prev.length + 1,
      postingKey: '40',
      account: '',
      description: '',
      amount: 0,
      costCenter: '',
      text: ''
    }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };

      // Auto-lookup description if account changes
      if (field === 'account') {
        const account = glAccounts.find(a => a.account === value);
        if (account) {
          newItems[index].description = account.description;
        } else {
          newItems[index].description = '';
        }
      }
      return newItems;
    });
  };

  const handlePost = () => {
    // Validation
    if (items.length < 2) {
      setStatusMessage({ type: 'error', text: 'El documento debe tener al menos 2 posiciones.' });
      return;
    }

    let debit = 0;
    let credit = 0;

    items.forEach(item => {
      const amount = parseFloat(item.amount);
      if (item.postingKey === '40') debit += amount;
      if (item.postingKey === '50') credit += amount;
    });

    if (Math.abs(debit - credit) > 0.01) {
      setStatusMessage({ type: 'error', text: `El documento no cuadra. Debe: ${debit.toFixed(2)}, Haber: ${credit.toFixed(2)}, Diferencia: ${(debit - credit).toFixed(2)}` });
      return;
    }

    // Save
    try {
      const doc = DocumentService.saveFIDocument({
        ...header,
        period: header.postingDate.substring(5, 7),
        items: items,
        status: 'Posted'
      });

      setStatusMessage({ type: 'success', text: `Documento ${doc.documentNumber} contabilizado en la sociedad ${header.companyCode}` });

      // Reset form
      setItems([]);
      setHeader(prev => ({ ...prev, reference: '', headerText: '' }));
    } catch (e) {
      setStatusMessage({ type: 'error', text: 'Error al guardar el documento.' });
    }
  };

  // Columns for Line Item Table
  const itemColumns = [
    { key: 'postingKey', label: 'ClvCT', width: '50px' },
    { key: 'account', label: 'Cuenta', width: '100px' },
    { key: 'description', label: 'Descripción', width: '200px' },
    { key: 'amount', label: 'Importe', width: '100px', type: 'number' },
    { key: 'costCenter', label: 'CeCo', width: '80px' },
    { key: 'text', label: 'Texto', width: '150px' }
  ];

  return (
    <div className="sap-transaction-wrapper">
      <div className="sap-page-title">{tDescription} ({tCode})</div>

      {/* Toolbar */}
      <div className="sap-toolbar" style={{ marginBottom: '10px' }}>
        <button onClick={handlePost} className="sap-action-button sap-action-create">
          Contabilizar
        </button>
        <div style={{ flex: 1 }}></div>
        {statusMessage && (
          <span className={statusMessage.type === 'error' ? 'sap-status-red' : 'sap-status-green'} style={{ fontWeight: 'bold' }}>
            {statusMessage.text}
          </span>
        )}
      </div>

      <DocumentHeader data={header} onChange={handleHeaderChange} />

      <LineItemTable
        items={items}
        columns={itemColumns}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
        onUpdateItem={handleUpdateItem}
      />

      {/* Helper text for search */}
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        * Para buscar cuenta, ingrese el número directamente.
        <br />
        * Clave 40 = Debe, Clave 50 = Haber.
      </div>
    </div>
  );
};

export default ScreenFB01;