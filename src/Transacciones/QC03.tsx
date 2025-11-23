import React, { useState } from 'react';
import '../App.css';
import { QMService } from '../services/qmService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenQC03: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [showList, setShowList] = useState(true);
    const [selectedCert, setSelectedCert] = useState<any>(null);

    const allCerts = QMService.getAllCertificates();

    const handleSelectCert = (cert: any) => {
        setSelectedCert(cert);
        setShowList(false);
    };

    if (!showList && selectedCert) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-page-title">{tDescription} ({tCode})</div>

                <div className="sap-toolbar">
                    <button onClick={() => setShowList(true)} className="sap-action-button">&lt; Volver a lista</button>
                    <button className="sap-action-button">🖨 Imprimir</button>
                    <div style={{ flex: 1 }}></div>
                    <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                        💡 <strong>Siguiente:</strong> Enviar al cliente o archivar
                    </div>
                </div>

                <div className="sap-panel">
                    <div className="sap-section-title">Certificado: {selectedCert.certificateNumber}</div>
                    <div className="sap-form-grid">
                        <div className="sap-form-row">
                            <label className="sap-label">Tipo:</label>
                            <input type="text" className="sap-input w-md" value={selectedCert.certificateType} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Estado:</label>
                            <input type="text" className="sap-input w-md" value={selectedCert.status} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Material:</label>
                            <input type="text" className="sap-input w-md" value={selectedCert.material} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Lote:</label>
                            <input type="text" className="sap-input w-md" value={selectedCert.batch || ''} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Cliente:</label>
                            <input type="text" className="sap-input w-md" value={selectedCert.customer || ''} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Lote inspección:</label>
                            <input type="text" className="sap-input w-md" value={selectedCert.inspectionLot || ''} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Fecha emisión:</label>
                            <input type="text" className="sap-input w-md" value={selectedCert.issueDate} disabled />
                        </div>
                        {selectedCert.validUntil && (
                            <div className="sap-form-row">
                                <label className="sap-label">Válido hasta:</label>
                                <input type="text" className="sap-input w-md" value={selectedCert.validUntil} disabled />
                            </div>
                        )}
                    </div>
                </div>

                {selectedCert.certificateData?.results && (
                    <div className="sap-panel">
                        <div className="sap-section-title">Resultados de inspección</div>
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
                                {selectedCert.certificateData.results.map((result: any, idx: number) => (
                                    <tr key={idx}>
                                        <td>{result.characteristic}</td>
                                        <td>{result.characteristicDescription}</td>
                                        <td style={{ textAlign: 'right' }}>{result.targetValue}</td>
                                        <td style={{ textAlign: 'right' }}>{result.lowerLimit}</td>
                                        <td style={{ textAlign: 'right' }}>{result.upperLimit}</td>
                                        <td style={{ textAlign: 'right' }}>{result.actualValue}</td>
                                        <td style={{ color: result.result === 'OK' ? 'green' : 'red', fontWeight: 'bold' }}>
                                            {result.result}
                                        </td>
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
                    💡 <strong>Instrucción:</strong> Selecciona un certificado para visualizarlo
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Lista de Certificados de Calidad ({allCerts.length} registros)</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Certificado</th>
                            <th>Tipo</th>
                            <th>Material</th>
                            <th>Cliente</th>
                            <th>Fecha emisión</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allCerts.map((cert, idx) => (
                            <tr key={idx} onClick={() => handleSelectCert(cert)} className="sap-table-row-clickable">
                                <td>{cert.certificateNumber}</td>
                                <td>{cert.certificateType}</td>
                                <td>{cert.material}</td>
                                <td>{cert.customer || '-'}</td>
                                <td>{cert.issueDate}</td>
                                <td>{cert.status}</td>
                            </tr>
                        ))}
                        {allCerts.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center' }}>No hay certificados. Crea uno en QC01</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenQC03;
