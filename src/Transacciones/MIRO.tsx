import React, { useState } from 'react';
import '../App.css';
import { DocumentService } from '../services/documentService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenMIRO: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [reference, setReference] = useState('');
    const [poNumber, setPoNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const handlePost = () => {
        if (!poNumber || !amount) {
            setMessage('Ingrese Pedido e Importe.');
            return;
        }

        // Verify PO exists
        const allPOs = DocumentService.getAllPOs();
        const po = allPOs.find(p => p.documentNumber === poNumber);

        if (!po) {
            setMessage('Pedido no encontrado.');
            return;
        }

        // Simulate posting
        setMessage(`Factura ${reference || 'INT-' + Math.floor(Math.random() * 1000)} contabilizada y bloqueada para pago.`);
        setPoNumber('');
        setAmount('');
        setReference('');
    };

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <button onClick={handlePost} className="sap-action-button" title="Contabilizar">💾 Contabilizar</button>
                <div style={{ flex: 1 }}></div>
                {message && <span className="sap-status-green">{message}</span>}
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Datos de Cabecera</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Fecha factura:</label>
                        <input
                            type="date"
                            className="sap-input w-md"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Referencia:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Importe:</label>
                        <input
                            type="number"
                            className="sap-input w-md"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <span style={{ marginLeft: '5px' }}>USD</span>
                    </div>
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Referencia a Pedido</div>
                <div className="sap-form-row">
                    <label className="sap-label">Pedido:</label>
                    <input
                        type="text"
                        className="sap-input w-md"
                        value={poNumber}
                        onChange={(e) => setPoNumber(e.target.value)}
                        placeholder="Número de pedido"
                    />
                </div>
            </div>
        </div>
    );
};

export default ScreenMIRO;
