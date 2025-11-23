import React, { useState } from 'react';
import '../App.css';
import { DocumentService } from '../services/documentService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenVA03: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [selectedSO, setSelectedSO] = useState<any>(null);
    const [showList, setShowList] = useState(true);

    const allSOs = DocumentService.getAllSalesDocuments().filter(doc => doc.type === 'Sales Order');

    const handleSelectSO = (so: any) => {
        setSelectedSO(so);
        setShowList(false);
    };

    if (!showList && selectedSO) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-page-title">{tDescription} ({tCode})</div>

                <div className="sap-toolbar">
                    <button onClick={() => setShowList(true)} className="sap-action-button">&lt; Volver a lista</button>
                    <div style={{ flex: 1 }}></div>
                    <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                        💡 <strong>Siguiente paso:</strong> Puedes crear entrega en <strong>VL01N</strong> o modificar en <strong>VA02</strong>
                    </div>
                </div>

                <div className="sap-panel">
                    <div className="sap-section-title">Pedido de cliente: {selectedSO.documentNumber}</div>
                    <div className="sap-form-grid">
                        <div className="sap-form-row">
                            <label className="sap-label">Solicitante:</label>
                            <input type="text" className="sap-input w-md" value={`${selectedSO.customer} - ${selectedSO.customerName || ''}`} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Fecha:</label>
                            <input type="text" className="sap-input w-md" value={selectedSO.docDate} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Org. ventas:</label>
                            <input type="text" className="sap-input w-xs" value={selectedSO.salesOrg} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Valor neto:</label>
                            <input type="text" className="sap-input w-md" value={`${selectedSO.netValue} ${selectedSO.currency}`} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Estado:</label>
                            <input type="text" className="sap-input w-md" value={selectedSO.status} disabled />
                        </div>
                    </div>

                    {selectedSO.items && (
                        <>
                            <div className="sap-section-title" style={{ marginTop: '20px' }}>Posiciones</div>
                            <table className="sap-table">
                                <thead>
                                    <tr>
                                        <th>Pos</th>
                                        <th>Material</th>
                                        <th>Descripción</th>
                                        <th>Cantidad</th>
                                        <th>UM</th>
                                        <th>Valor neto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedSO.items.map((item: any, idx: number) => (
                                        <tr key={idx}>
                                            <td>{item.item}</td>
                                            <td>{item.material}</td>
                                            <td>{item.description}</td>
                                            <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                                            <td>{item.unit}</td>
                                            <td style={{ textAlign: 'right' }}>{item.netValue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <div className="sap-status-bar" style={{ backgroundColor: '#fff3cd', padding: '5px 10px', borderRadius: '3px' }}>
                    💡 <strong>Instrucción:</strong> Selecciona un pedido de la lista para visualizarlo
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Lista de Pedidos de Cliente ({allSOs.length} registros)</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Nombre</th>
                            <th>Fecha</th>
                            <th>Valor</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allSOs.map((so, idx) => (
                            <tr key={idx} onClick={() => handleSelectSO(so)} className="sap-table-row-clickable">
                                <td>{so.documentNumber}</td>
                                <td>{so.customer}</td>
                                <td>{so.customerName || '-'}</td>
                                <td>{so.docDate}</td>
                                <td style={{ textAlign: 'right' }}>{so.netValue} {so.currency}</td>
                                <td>{so.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenVA03;
