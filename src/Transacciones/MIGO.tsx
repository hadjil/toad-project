import React, { useState } from 'react';
import '../App.css';
import { DocumentService } from '../services/documentService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenMIGO: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [action, setAction] = useState('A01'); // Receipt
    const [refDoc, setRefDoc] = useState('R01'); // Purchase Order
    const [poNumber, setPoNumber] = useState('');
    const [items, setItems] = useState<any[]>([]);
    const [message, setMessage] = useState('');

    const handleFetchPO = () => {
        const allPOs = DocumentService.getAllPOs();
        const po = allPOs.find(p => p.documentNumber === poNumber);

        if (po) {
            setItems(po.items.map((i: any) => ({
                ...i,
                qtyReceived: i.quantity, // Default to full receipt
                storageLoc: '0001'
            })));
            setMessage('Pedido encontrado.');
        } else {
            setItems([]);
            setMessage('Pedido no encontrado.');
        }
    };

    const handlePost = () => {
        if (items.length === 0) {
            setMessage('No hay posiciones para contabilizar.');
            return;
        }

        // In a real system we would update stock here.
        // For now we just save a "Material Document"
        const matDoc = {
            documentNumber: '5000' + Math.floor(Math.random() * 10000),
            year: new Date().getFullYear(),
            type: action === 'A01' ? 'WE' : 'WA',
            refDoc: poNumber,
            items: items
        };

        // Save to local storage (simulated)
        const existingJson = localStorage.getItem('toad_matdocs');
        const existing = existingJson ? JSON.parse(existingJson) : [];
        existing.push(matDoc);
        localStorage.setItem('toad_matdocs', JSON.stringify(existing));

        setMessage(`Documento de material ${matDoc.documentNumber} contabilizado.`);
        setItems([]);
        setPoNumber('');
    };

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <button onClick={handlePost} className="sap-action-button sap-action-create">
                    Contabilizar
                </button>
                <div style={{ flex: 1 }}></div>
                {message && <span className="sap-status-green">{message}</span>}
            </div>

            <div className="sap-panel">
                <div className="sap-form-row">
                    <select className="sap-input w-md" value={action} onChange={(e) => setAction(e.target.value)}>
                        <option value="A01">A01 Entrada de mercancías</option>
                        <option value="A07">A07 Salida de mercancías</option>
                    </select>
                    <select className="sap-input w-md" value={refDoc} onChange={(e) => setRefDoc(e.target.value)} style={{ marginLeft: '10px' }}>
                        <option value="R01">R01 Pedido</option>
                        <option value="R10">R10 Otros</option>
                    </select>
                </div>

                {refDoc === 'R01' && (
                    <div className="sap-form-row" style={{ marginTop: '10px' }}>
                        <label className="sap-label">Pedido:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={poNumber}
                            onChange={(e) => setPoNumber(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFetchPO()}
                        />
                        <button onClick={handleFetchPO} className="sap-action-button" style={{ marginLeft: '10px' }}>
                            Buscar
                        </button>
                    </div>
                )}
            </div>

            {items.length > 0 && (
                <div className="sap-panel">
                    <div className="sap-section-title">Posiciones</div>
                    <table className="sap-table">
                        <thead>
                            <tr>
                                <th>Material</th>
                                <th>Texto breve</th>
                                <th>Ctd. Pedido</th>
                                <th>Ctd. Entrada</th>
                                <th>UM</th>
                                <th>Almacén</th>
                                <th>OK</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.material}</td>
                                    <td>{item.description}</td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        <input
                                            type="number"
                                            className="sap-input w-xs"
                                            value={item.qtyReceived}
                                            onChange={(e) => {
                                                const newItems = [...items];
                                                newItems[idx].qtyReceived = e.target.value;
                                                setItems(newItems);
                                            }}
                                        />
                                    </td>
                                    <td>{item.unit}</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="sap-input w-xs"
                                            value={item.storageLoc}
                                            onChange={(e) => {
                                                const newItems = [...items];
                                                newItems[idx].storageLoc = e.target.value;
                                                setItems(newItems);
                                            }}
                                        />
                                    </td>
                                    <td><input type="checkbox" defaultChecked /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ScreenMIGO;
