import React, { useState } from 'react';
import '../App.css';
import { MasterDataService } from '../services/masterDataService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenMMBE: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [material, setMaterial] = useState('');
    const [plant, setPlant] = useState('1000');
    const [executed, setExecuted] = useState(false);
    const [stockData, setStockData] = useState<any[]>([]);

    const handleExecute = () => {
        // Simulate stock calculation based on material documents (MIGO)
        // In a real app, we would sum up movements. Here we mock it or check if we have any.

        const matDocsJson = localStorage.getItem('toad_matdocs');
        const matDocs = matDocsJson ? JSON.parse(matDocsJson) : [];

        let stock = 0;

        // Simple calculation: Sum of all receipts (Type WE) for this material
        matDocs.forEach((doc: any) => {
            doc.items.forEach((item: any) => {
                if (item.material === material) {
                    if (doc.type === 'WE') {
                        stock += parseFloat(item.qtyReceived || item.quantity);
                    } else if (doc.type === 'WA') {
                        stock -= parseFloat(item.qtyReceived || item.quantity);
                    }
                }
            });
        });

        // If no movements, give a random stock for demo purposes if material exists
        const matExists = MasterDataService.getMaterialCombined(material);
        if (stock === 0 && matExists) {
            stock = 100; // Default demo stock
        }

        setStockData([
            { type: 'Libre utilización', quantity: stock },
            { type: 'Inspección calidad', quantity: 0 },
            { type: 'Bloqueado', quantity: 0 }
        ]);
        setExecuted(true);
    };

    if (executed) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-toolbar">
                    <button onClick={() => setExecuted(false)} className="sap-action-button">&lt; Atrás</button>
                    <span className="sap-page-title" style={{ marginLeft: '10px' }}>Resumen de Stocks: Lista Básica</span>
                </div>
                <div className="sap-panel">
                    <div className="sap-section-title">Material: {material} | Centro: {plant}</div>
                    <table className="sap-table">
                        <thead>
                            <tr>
                                <th>Tipo de Stock</th>
                                <th>Cantidad</th>
                                <th>UM</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockData.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{row.type}</td>
                                    <td style={{ textAlign: 'right' }}>{row.quantity.toFixed(3)}</td>
                                    <td>PC</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <button onClick={handleExecute} className="sap-action-button" title="Ejecutar">🕒 Ejecutar</button>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Selección</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Material:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Centro:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={plant}
                            onChange={(e) => setPlant(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScreenMMBE;
