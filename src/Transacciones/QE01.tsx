import React, { useState } from 'react';
import '../App.css';
import { QMService } from '../services/qmService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenQE01: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [showList, setShowList] = useState(true);
    const [selectedLot, setSelectedLot] = useState<any>(null);
    const [results, setResults] = useState<any[]>([]);
    const [message, setMessage] = useState('');

    const allLots = QMService.getAllInspectionLots().filter(l => l.status === 'REL' || l.status === 'SPRQ');

    const handleSelectLot = (lot: any) => {
        setSelectedLot(lot);
        setResults(lot.results.map((r: any) => ({ ...r, actualValue: r.actualValue || '' })));
        setShowList(false);
    };

    const handleResultChange = (idx: number, value: string) => {
        const newResults = [...results];
        newResults[idx].actualValue = parseFloat(value) || 0;

        // Auto-calculate result
        const actual = parseFloat(value);
        if (!isNaN(actual)) {
            const char = newResults[idx];
            newResults[idx].result = (actual >= char.lowerLimit && actual <= char.upperLimit) ? 'OK' : 'NOT_OK';
        }

        setResults(newResults);
    };

    const handleSave = () => {
        if (!selectedLot) return;

        // Check if all results are recorded
        const allRecorded = results.every(r => r.actualValue !== '' && r.actualValue !== 0);
        const allOK = results.every(r => r.result === 'OK');

        QMService.updateInspectionLot(selectedLot.inspectionLot, {
            results,
            status: allRecorded ? 'RES' : 'SPRQ',
            usageDecision: allRecorded ? (allOK ? 'A' : 'R') : undefined,
        });

        setMessage(`Resultados guardados. Decisión: ${allOK ? 'Aceptado' : 'Rechazado'}`);
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
                        💡 <strong>Siguiente:</strong> Visualizar en <strong>QA03</strong> o generar certificado en <strong>QC01</strong>
                    </div>
                </div>

                <div className="sap-panel">
                    <div className="sap-section-title">Lote: {selectedLot.inspectionLot} - {selectedLot.material}</div>
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
                            {results.map((result, idx) => (
                                <tr key={idx}>
                                    <td>{result.characteristic}</td>
                                    <td>{result.characteristicDescription}</td>
                                    <td style={{ textAlign: 'right' }}>{result.targetValue}</td>
                                    <td style={{ textAlign: 'right' }}>{result.lowerLimit}</td>
                                    <td style={{ textAlign: 'right' }}>{result.upperLimit}</td>
                                    <td>
                                        <input
                                            type="number"
                                            className="sap-input w-md"
                                            value={result.actualValue}
                                            onChange={(e) => handleResultChange(idx, e.target.value)}
                                            step="0.01"
                                        />
                                    </td>
                                    <td>
                                        <span style={{
                                            color: result.result === 'OK' ? 'green' : result.result === 'NOT_OK' ? 'red' : 'gray',
                                            fontWeight: 'bold'
                                        }}>
                                            {result.result || '-'}
                                        </span>
                                    </td>
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
                <div className="sap-status-bar" style={{ backgroundColor: '#fff3cd', padding: '5px 10px', borderRadius: '3px' }}>
                    💡 <strong>Instrucción:</strong> Selecciona un lote para registrar resultados
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Lotes Pendientes de Resultados ({allLots.length} registros)</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Lote inspección</th>
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
                                <td colSpan={5} style={{ textAlign: 'center' }}>No hay lotes pendientes. Crea uno en QA01</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenQE01;
