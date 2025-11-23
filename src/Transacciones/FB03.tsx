import React, { useState } from 'react';
import '../App.css';
import { DocumentService } from '../services/documentService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenFB03: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [showList, setShowList] = useState(true);

    const allDocs = DocumentService.getAllFIDocuments();

    const handleSelectDoc = (doc: any) => {
        setSelectedDoc(doc);
        setShowList(false);
    };

    if (!showList && selectedDoc) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-page-title">{tDescription} ({tCode})</div>

                <div className="sap-toolbar">
                    <button onClick={() => setShowList(true)} className="sap-action-button">&lt; Volver a lista</button>
                    <div style={{ flex: 1 }}></div>
                    <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                        💡 <strong>Siguiente paso:</strong> Puedes modificar en <strong>FB02</strong> o anular en <strong>FB08</strong>
                    </div>
                </div>

                <div className="sap-panel">
                    <div className="sap-section-title">Documento: {selectedDoc.documentNumber}</div>
                    <div className="sap-form-grid">
                        <div className="sap-form-row">
                            <label className="sap-label">Sociedad:</label>
                            <input type="text" className="sap-input w-xs" value={selectedDoc.companyCode} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Fecha documento:</label>
                            <input type="text" className="sap-input w-md" value={selectedDoc.documentDate} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Fecha contabilización:</label>
                            <input type="text" className="sap-input w-md" value={selectedDoc.postingDate} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Período:</label>
                            <input type="text" className="sap-input w-xs" value={selectedDoc.period} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Moneda:</label>
                            <input type="text" className="sap-input w-xs" value={selectedDoc.currency} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Texto cabecera:</label>
                            <input type="text" className="sap-input w-lg" value={selectedDoc.headerText || ''} disabled />
                        </div>
                    </div>

                    <div className="sap-section-title" style={{ marginTop: '20px' }}>Posiciones</div>
                    <table className="sap-table">
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>CME</th>
                                <th>Cuenta</th>
                                <th>Descripción</th>
                                <th>Importe</th>
                                <th>Texto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedDoc.items.map((item: any, idx: number) => (
                                <tr key={idx}>
                                    <td>{item.lineId}</td>
                                    <td>{item.postingKey}</td>
                                    <td>{item.account}</td>
                                    <td>{item.description || '-'}</td>
                                    <td style={{ textAlign: 'right' }}>{item.amount.toFixed(2)}</td>
                                    <td>{item.text || '-'}</td>
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
                    💡 <strong>Instrucción:</strong> Selecciona un documento de la lista para visualizarlo
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Lista de Documentos Contables ({allDocs.length} registros)</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Documento</th>
                            <th>Sociedad</th>
                            <th>Fecha doc.</th>
                            <th>Período</th>
                            <th>Moneda</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allDocs.map((doc, idx) => (
                            <tr key={idx} onClick={() => handleSelectDoc(doc)} className="sap-table-row-clickable">
                                <td>{doc.documentNumber}</td>
                                <td>{doc.companyCode}</td>
                                <td>{doc.documentDate}</td>
                                <td>{doc.period}</td>
                                <td>{doc.currency}</td>
                                <td>{doc.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenFB03;
