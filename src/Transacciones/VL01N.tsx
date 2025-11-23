import React, { useState } from 'react';
import '../App.css';
import { DocumentService } from '../services/documentService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenVL01N: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [shippingPoint, setShippingPoint] = useState('1000');
    const [salesOrder, setSalesOrder] = useState('');
    const [message, setMessage] = useState('');

    const handleSave = () => {
        if (!salesOrder) {
            setMessage('Ingrese un pedido de cliente.');
            return;
        }

        // Verify SO exists
        const allSOs = DocumentService.getAllSalesDocuments();
        const so = allSOs.find(s => s.documentNumber === salesOrder && s.type === 'Sales Order');

        if (!so) {
            setMessage('Pedido de cliente no encontrado.');
            return;
        }

        // Simulate delivery creation
        const deliveryNum = '800' + Math.floor(Math.random() * 10000000);
        setMessage(`Entrega de salida ${deliveryNum} grabada.`);
        setSalesOrder('');
    };

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <button onClick={handleSave} className="sap-action-button" title="Guardar">💾 Guardar</button>
                <div style={{ flex: 1 }}></div>
                {message && <span className="sap-status-green">{message}</span>}
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Crear entrega de salida con referencia a pedido</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Puesto expedición:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={shippingPoint}
                            onChange={(e) => setShippingPoint(e.target.value)}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Fecha selección:</label>
                        <input
                            type="date"
                            className="sap-input w-md"
                            defaultValue={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Pedido:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={salesOrder}
                            onChange={(e) => setSalesOrder(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScreenVL01N;
