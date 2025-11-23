import React, { useState } from 'react';
import '../App.css';
import { MasterDataService } from '../services/masterDataService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenXK01: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [vendor, setVendor] = useState({
        vendor: '',
        name: '',
        city: '',
        country: 'US',
        currency: 'USD',
        companyCode: '1000',
        purchOrg: '1000'
    });
    const [message, setMessage] = useState('');

    const handleSave = () => {
        if (!vendor.vendor || !vendor.name) {
            setMessage('Error: Acreedor y Nombre son obligatorios.');
            return;
        }

        MasterDataService.saveVendor(vendor);
        setMessage(`Acreedor ${vendor.vendor} creado en la sociedad ${vendor.companyCode}.`);
        setVendor({ ...vendor, vendor: '', name: '', city: '' });
    };

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <button onClick={handleSave} className="sap-action-button sap-action-create">
                    Guardar
                </button>
                <div style={{ flex: 1 }}></div>
                {message && <span className="sap-status-green">{message}</span>}
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Datos Iniciales</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Acreedor:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={vendor.vendor}
                            onChange={(e) => setVendor({ ...vendor, vendor: e.target.value })}
                            placeholder="Ej: 3000"
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Sociedad:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={vendor.companyCode}
                            onChange={(e) => setVendor({ ...vendor, companyCode: e.target.value })}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Org. Compras:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={vendor.purchOrg}
                            onChange={(e) => setVendor({ ...vendor, purchOrg: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Dirección</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Nombre:</label>
                        <input
                            type="text"
                            className="sap-input w-lg"
                            value={vendor.name}
                            onChange={(e) => setVendor({ ...vendor, name: e.target.value })}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Población:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={vendor.city}
                            onChange={(e) => setVendor({ ...vendor, city: e.target.value })}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">País:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={vendor.country}
                            onChange={(e) => setVendor({ ...vendor, country: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScreenXK01;
