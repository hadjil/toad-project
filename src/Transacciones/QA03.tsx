import React, { useState } from 'react';
import '../App.css';
import { QMService } from '../services/qmService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenQA03: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [showList, setShowList] = useState(true);
    const [selectedLot, setSelectedLot] = useState<any>(null);

    const allLots = QMService.getAllInspectionLots();

    const handleSelectLot = (lot: any) => {
        setSelectedLot(lot);
        setShowList(false);
    };

    if (!showList && selectedLot) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-page-title">{tDescription} ({tCode})</div>

                <div className="sap-toolbar">
                    <button onClick={() => setShowList(true)} className="sap-action-button">&lt; Volver a lista</button>
                    <div style={{ flex: 1 }}></div>
                    <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                        💡 <strong>Siguiente:</strong> Registrar resultados en <strong>QE01</strong>
                    </div>
                </div>

                <div className="sap-panel">
                    <div className="sap-section-title">Lote de inspección: {selectedLot.inspectionLot}</div>
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
                            <label className="sap-label">Lote:</label>
                            <input type="text" className="sap-input w-md" value={selectedLot.batch || ''} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Centro:</label>
                            <input type="text" className="sap-input w-xs" value={selectedLot.plant} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Tipo inspección:</label>
                            <input type="text" className="sap-input w-md" value={selectedLot.inspectionType} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Cantidad:</label>
                            <input type="text" className="sap-input w-md" value={`${selectedLot.quantity} ${selectedLot.unit}`} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Estado:</label>
                            <input type="text" className="sap-input w-md" value={selectedLot.status} disabled />
                        </div>
                        {selectedLot.usageDecision && (
                            <div className="sap-form-row">
                                <label className="sap-label">Decisión de empleo:</label>
                                <input type="text" className="sap-input w-md" value={selectedLot.usageDecision} disabled />
                            </div>
                        )}
                    </div>
                </div>

                {selectedLot.results && selectedLot.results.length > 0 && (
                    <div className="sap-panel">
                        <div className="sap-section-title">Características de inspección</div>
                        <table className="sap-table">
                            <thead>
                                <tr>
                                    <th>Característica</th>
                                    <th>Descripción</th>
                                    <th>Valor objetivo</th>
                                    <th>Límite inf.</th>
                                    <th>Límite sup.</th>
                                    <th>Valor real</th>
                                    <th>Resultado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedLot.results.map((result: any, idx: number) => (
                                    <tr key={idx}>
                                        <td>{result.characteristic}</td>
                                        <td>{result.characteristicDescription}</td>
                                        <td style={{ textAlign: 'right' }}>{result.targetValue}</td>
                                        <td style={{ textAlign: 'right' }}>{result.lowerLimit}</td>
                                        <td style={{ textAlign: 'right' }}>{result.upperLimit}</td>
                                        <td style={{ textAlign: 'right' }}>{result.actualValue || '-'}</td>
                                        <td>{result.result || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <div className="sap-status-bar" style={{ backgroundColor: '#fff3cd', padding: '5px 10px', borderRadius: '3px' }}>
                    💡 <strong>Instrucción:</strong> Selecciona un lote para visualizarlo
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
                            <th>Tipo</th>
                            <th>Cantidad</th>
                            <th>Estado</th>
                            <th>Decisión</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allLots.map((lot, idx) => (
                            <tr key={idx} onClick={() => handleSelectLot(lot)} className="sap-table-row-clickable">
                                <td>{lot.inspectionLot}</td>
                                <td>{lot.material}</td>
                                <td>{lot.materialDescription || '-'}</td>
                                <td>{lot.inspectionType}</td>
                                <td style={{ textAlign: 'right' }}>{lot.quantity} {lot.unit}</td>
                                <td>{lot.status}</td>
                                <td>{lot.usageDecision || '-'}</td>
                            </tr>
                        ))}
                        {allLots.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center' }}>No hay lotes. Crea uno en QA01</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenQA03;
