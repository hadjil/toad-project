import React from 'react';
import '../App.css';
import { QMService } from '../services/qmService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenQA11: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const allLots = QMService.getAllInspectionLots();

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                    💡 <strong>Tip:</strong> Haz doble clic en un lote para ver detalles
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Lista de Lotes de Inspección ({allLots.length} registros)</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Lote inspección</th>
                            <th>Material</th>
                            <th>Descripción</th>
                            <th>Lote</th>
                            <th>Centro</th>
                            <th>Tipo</th>
                            <th>Cantidad</th>
                            <th>UM</th>
                            <th>Estado</th>
                            <th>Decisión</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allLots.map((lot, idx) => (
                            <tr key={idx}>
                                <td>{lot.inspectionLot}</td>
                                <td>{lot.material}</td>
                                <td>{lot.materialDescription || '-'}</td>
                                <td>{lot.batch || '-'}</td>
                                <td>{lot.plant}</td>
                                <td>{lot.inspectionType}</td>
                                <td style={{ textAlign: 'right' }}>{lot.quantity}</td>
                                <td>{lot.unit}</td>
                                <td>{lot.status}</td>
                                <td style={{
                                    color: lot.usageDecision === 'A' ? 'green' : lot.usageDecision === 'R' ? 'red' : 'gray',
                                    fontWeight: 'bold'
                                }}>
                                    {lot.usageDecision || '-'}
                                </td>
                                <td>{lot.createdDate.split('T')[0]}</td>
                            </tr>
                        ))}
                        {allLots.length === 0 && (
                            <tr>
                                <td colSpan={11} style={{ textAlign: 'center' }}>No hay lotes. Crea uno en QA01</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenQA11;
