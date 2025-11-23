import React, { useState } from 'react';
import '../App.css';
import { DocumentService } from '../services/documentService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenME23N: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [selectedPO, setSelectedPO] = useState<any>(null);
    const [showList, setShowList] = useState(true);

    const allPOs = DocumentService.getAllPOs();

    const handleSelectPO = (po: any) => {
        setSelectedPO(po);
        setShowList(false);
    };

    if (!showList && selectedPO) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-page-title">{tDescription} ({tCode})</div>

                <div className="sap-toolbar">
                    <button onClick={() => setShowList(true)} className="sap-action-button">&lt; Volver a lista</button>
                    <div style={{ flex: 1 }}></div>
                    <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                        💡 <strong>Siguiente paso:</strong> Puedes recibir mercancías en <strong>MIGO</strong> o modificar en <strong>ME22N</strong>
                    </div>
                </div>

                <div className="sap-panel">
                    <div className="sap-section-title">Pedido: {selectedPO.documentNumber}</div>
                    <div className="sap-form-grid">
                        <div className="sap-form-row">
                            <label className="sap-label">Proveedor:</label>
                            <input type="text" className="sap-input w-md" value={`${selectedPO.vendor} - ${selectedPO.vendorName || ''}`} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Fecha:</label>
                            <input type="text" className="sap-input w-md" value={selectedPO.docDate} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Org. compras:</label>
                            <input type="text" className="sap-input w-xs" value={selectedPO.purchOrg} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Valor total:</label>
                            <input type="text" className="sap-input w-md" value={`${selectedPO.totalValue} ${selectedPO.currency}`} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Estado:</label>
                            <input type="text" className="sap-input w-md" value={selectedPO.status} disabled />
                        </div>
                    </div>

                    {selectedPO.items && (
                        <>
                            <div className="sap-section-title" style={{ marginTop: '20px' }}>Posiciones</div>
                            <table className="sap-table">
                                <thead>
                                    <tr>
                                        <th>Pos</th>
                                        <th>Material</th>
                                        <th>Texto breve</th>
                                        <th>Cantidad</th>
                                        <th>UM</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedPO.items.map((item: any, idx: number) => (
                                        <tr key={idx}>
                                            <td>{item.item}</td>
                                            <td>{item.material}</td>
                                            <td>{item.shortText}</td>
                                            <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                                            <td>{item.unit}</td>
                                            <td style={{ textAlign: 'right' }}>{item.netPrice}</td>
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
                <div className="sap-section-title">Lista de Pedidos ({allPOs.length} registros)</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Proveedor</th>
                            <th>Nombre</th>
                            <th>Fecha</th>
                            <th>Valor</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allPOs.map((po, idx) => (
                            <tr key={idx} onClick={() => handleSelectPO(po)} className="sap-table-row-clickable">
                                <td>{po.documentNumber}</td>
                                <td>{po.vendor}</td>
                                <td>{po.vendorName || '-'}</td>
                                <td>{po.docDate}</td>
                                <td style={{ textAlign: 'right' }}>{po.totalValue} {po.currency}</td>
                                <td>{po.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenME23N;
