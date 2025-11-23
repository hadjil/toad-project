import React, { useState } from 'react';
import '../App.css';
import { QMService } from '../services/qmService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenQA02: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [showList, setShowList] = useState(true);
    const [selectedLot, setSelectedLot] = useState<any>(null);
    const [quantity, setQuantity] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');

    const allLots = QMService.getAllInspectionLots();

    const handleSelectLot = (lot: any) => {
        setSelectedLot(lot);
        setQuantity(lot.quantity.toString());
        setStatus(lot.status);
        setShowList(false);
    };

    const handleSave = () => {
        if (!selectedLot) return;

        QMService.updateInspectionLot(selectedLot.inspectionLot, {
            quantity: parseFloat(quantity),
            status,
        });

        setMessage(`Lote ${selectedLot.inspectionLot} actualizado`);
        setTimeout(() => {
            setShowList(true);
            setMessage('');
        }, 2000);
    };

    if (!showList && selectedLot) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-page-title">{tDescription} ({tCode})</div>

                <div className="sap-toolbar">
                    <button onClick={handleSave} className="sap-action-button">💾 Guardar</button>
                    <button onClick={() => setShowList(true)} className="sap-action-button">&lt; Volver</button>
                    <div style={{ flex: 1 }}></div>
                    {message && <span className="sap-status-green">{message}</span>}
                    <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                        💡 <strong>Siguiente:</strong> Visualizar en <strong>QA03</strong>
                    </div>
                </div>

                <div className="sap-panel">
                    <div className="sap-section-title">Lote: {selectedLot.inspectionLot}</div>
                    <div className="sap-form-grid">
                        <div className="sap-form-row">
                            <label className="sap-label">Material:</label>
                            <input type="text" className="sap-input w-md" value={selectedLot.material} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Descripción:</label>
                            <input type="text" className="sap-input w-lg" value={selectedLot.materialDescription || ''} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Cantidad:</label>
                            <input
                                type="number"
                                className="sap-input w-md"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Estado:</label>
                            <select
                                className="sap-input w-md"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="REL">REL - Liberado</option>
                                <option value="SPRQ">SPRQ - Muestra extraída</option>
                                <option value="RES">RES - Resultados registrados</option>
                                <option value="CALC">CALC - Decisión tomada</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <div className="sap-status-bar" style={{ backgroundColor: '#fff3cd', padding: '5px 10px', borderRadius: '3px' }}>
                    💡 <strong>Instrucción:</strong> Selecciona un lote para modificarlo
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Lotes de Inspección ({allLots.length} registros)</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Lote</th>
                            <th>Material</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allLots.map((lot, idx) => (
                            <tr key={idx} onClick={() => handleSelectLot(lot)} className="sap-table-row-clickable">
                                <td>{lot.inspectionLot}</td>
                                <td>{lot.material}</td>
                                <td>{lot.materialDescription || '-'}</td>
                                <td style={{ textAlign: 'right' }}>{lot.quantity} {lot.unit}</td>
                                <td>{lot.status}</td>
                            </tr>
                        ))}
                        {allLots.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center' }}>No hay lotes. Crea uno en QA01</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenQA02;
