import React from 'react';
import '../App.css';
import { QMService } from '../services/qmService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenQE51N: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const allLots = QMService.getAllInspectionLots().filter(l => l.status === 'REL' || l.status === 'SPRQ');

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                    💡 <strong>Tip:</strong> Haz clic en un lote para registrar resultados en <strong>QE01</strong>
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Lista de Trabajo - Lotes Pendientes ({allLots.length} registros)</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Lote inspección</th>
                            <th>Material</th>
                            <th>Descripción</th>
                            <th>Lote</th>
                            <th>Cantidad</th>
                            <th>UM</th>
                            <th>Estado</th>
                            <th>Tipo</th>
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
                                <td style={{ textAlign: 'right' }}>{lot.quantity}</td>
                                <td>{lot.unit}</td>
                                <td>{lot.status}</td>
                                <td>{lot.inspectionType}</td>
                                <td>{lot.createdDate.split('T')[0]}</td>
                            </tr>
                        ))}
                        {allLots.length === 0 && (
                            <tr>
                                <td colSpan={9} style={{ textAlign: 'center' }}>No hay lotes pendientes. Todos los lotes han sido procesados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenQE51N;
