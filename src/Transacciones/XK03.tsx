import React, { useState } from 'react';
import '../App.css';
import { MasterDataService } from '../services/masterDataService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenXK03: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [showList, setShowList] = useState(true);
    const [selectedVendor, setSelectedVendor] = useState<any>(null);

    const allVendors = MasterDataService.getVendors();

    const handleSelectVendor = (vendor: any) => {
        setSelectedVendor(vendor);
        setShowList(false);
    };

    if (!showList && selectedVendor) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-page-title">{tDescription} ({tCode})</div>

                <div className="sap-toolbar">
                    <button onClick={() => setShowList(true)} className="sap-action-button">&lt; Volver a lista</button>
                    <div style={{ flex: 1 }}></div>
                    <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                        💡 <strong>Siguiente:</strong> Modificar en <strong>XK02</strong> o crear pedido en <strong>ME21N</strong>
                    </div>
                </div>

                <div className="sap-panel">
                    <div className="sap-section-title">Acreedor: {selectedVendor.vendor}</div>
                    <div className="sap-form-grid">
                        <div className="sap-form-row">
                            <label className="sap-label">Nombre:</label>
                            <input type="text" className="sap-input w-lg" value={selectedVendor.name} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Población:</label>
                            <input type="text" className="sap-input w-md" value={selectedVendor.city} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">País:</label>
                            <input type="text" className="sap-input w-xs" value={selectedVendor.country} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Condiciones de pago:</label>
                            <input type="text" className="sap-input w-md" value={selectedVendor.paymentTerms} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Cuenta asociada:</label>
                            <input type="text" className="sap-input w-md" value={selectedVendor.reconciliationAccount} disabled />
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
                    💡 <strong>Instrucción:</strong> Selecciona un acreedor para visualizarlo
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Lista de Acreedores ({allVendors.length} registros)</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Acreedor</th>
                            <th>Nombre</th>
                            <th>Población</th>
                            <th>País</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allVendors.map((vendor, idx) => (
                            <tr key={idx} onClick={() => handleSelectVendor(vendor)} className="sap-table-row-clickable">
                                <td>{vendor.vendor}</td>
                                <td>{vendor.name}</td>
                                <td>{vendor.city}</td>
                                <td>{vendor.country}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenXK03;
