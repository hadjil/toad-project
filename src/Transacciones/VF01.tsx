import React, { useState } from 'react';
import '../App.css';
import { DocumentService } from '../services/documentService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenVF01: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [deliveryNum, setDeliveryNum] = useState('');
    const [message, setMessage] = useState('');
    const [items, setItems] = useState<any[]>([]);

    const handleEnter = () => {
        if (deliveryNum) {
            // Simulate fetching delivery items
            setItems([
                { item: 10, material: '100-100', description: 'Carcasa de Bomba', qty: 10, netValue: 1500.00 },
                { item: 20, material: '100-200', description: 'Eje de Acero', qty: 5, netValue: 427.50 }
            ]);
            setMessage('Entrega encontrada. Lista para facturar.');
        }
    };

    const handleSave = () => {
        if (items.length === 0) {
            setMessage('Error: No hay posiciones para facturar.');
            return;
        }

        const invoice = DocumentService.saveInvoice({
            reference: deliveryNum,
            items: items,
            totalValue: items.reduce((sum, i) => sum + i.netValue, 0)
        });

        setMessage(`Factura ${invoice.documentNumber} creada con éxito.`);
        setItems([]);
        setDeliveryNum('');
    };

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <button onClick={handleSave} className="sap-action-button sap-action-create">
                    Guardar
                </button>
                <div style={{ flex: 1 }}></div>
                {message && <span className="sap-status-green">{message}</span>}
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Datos de Selección</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Entrega:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={deliveryNum}
                            onChange={(e) => setDeliveryNum(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
                        />
                        <button onClick={handleEnter} className="sap-action-button" style={{ marginLeft: '10px' }}>
                            Procesar
                        </button>
                    </div>
                </div>
            </div>

            {items.length > 0 && (
                <div className="sap-panel">
                    <div className="sap-section-title">Documentos a Facturar</div>
                    <table className="sap-table">
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>Material</th>
                                <th>Descripción</th>
                                <th>Cantidad</th>
                                <th>Valor Neto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.item}</td>
                                    <td>{item.material}</td>
                                    <td>{item.description}</td>
                                    <td>{item.qty}</td>
                                    <td>{item.netValue.toFixed(2)} USD</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ScreenVF01;