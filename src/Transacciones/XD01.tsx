import React, { useState } from 'react';
import '../App.css';
import { MasterDataService } from '../services/masterDataService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenXD01: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [customer, setCustomer] = useState({
        customer: '',
        name: '',
        city: '',
        country: 'US',
        companyCode: '1000',
        salesOrg: '1000',
        distChannel: '10',
        division: '00'
    });
    const [message, setMessage] = useState('');

    const handleSave = () => {
        if (!customer.customer || !customer.name) {
            setMessage('Error: Cliente y Nombre son obligatorios.');
            return;
        }

        MasterDataService.saveCustomer(customer);
        setMessage(`Cliente ${customer.customer} creado en el área de ventas.`);
        setCustomer({ ...customer, customer: '', name: '', city: '' });
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
                        <label className="sap-label">Cliente:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={customer.customer}
                            onChange={(e) => setCustomer({ ...customer, customer: e.target.value })}
                            placeholder="Ej: 10000"
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Sociedad:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={customer.companyCode}
                            onChange={(e) => setCustomer({ ...customer, companyCode: e.target.value })}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Org. Ventas:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={customer.salesOrg}
                            onChange={(e) => setCustomer({ ...customer, salesOrg: e.target.value })}
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
                            value={customer.name}
                            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Población:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={customer.city}
                            onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">País:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={customer.country}
                            onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScreenXD01;
