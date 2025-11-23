import React, { useState } from 'react';
import '../App.css';
import { MasterDataService } from '../services/masterDataService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenXD03: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [showList, setShowList] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    const allCustomers = MasterDataService.getCustomers();

    const handleSelectCustomer = (customer: any) => {
        setSelectedCustomer(customer);
        setShowList(false);
    };

    if (!showList && selectedCustomer) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-page-title">{tDescription} ({tCode})</div>

                <div className="sap-toolbar">
                    <button onClick={() => setShowList(true)} className="sap-action-button">&lt; Volver a lista</button>
                    <div style={{ flex: 1 }}></div>
                    <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                        💡 <strong>Siguiente:</strong> Modificar en <strong>XD02</strong> o crear pedido en <strong>VA01</strong>
                    </div>
                </div>

                <div className="sap-panel">
                    <div className="sap-section-title">Cliente: {selectedCustomer.customer}</div>
                    <div className="sap-form-grid">
                        <div className="sap-form-row">
                            <label className="sap-label">Nombre:</label>
                            <input type="text" className="sap-input w-lg" value={selectedCustomer.name} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Población:</label>
                            <input type="text" className="sap-input w-md" value={selectedCustomer.city} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">País:</label>
                            <input type="text" className="sap-input w-xs" value={selectedCustomer.country} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Condiciones de pago:</label>
                            <input type="text" className="sap-input w-md" value={selectedCustomer.paymentTerms} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Cuenta asociada:</label>
                            <input type="text" className="sap-input w-md" value={selectedCustomer.reconciliationAccount} disabled />
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
                    💡 <strong>Instrucción:</strong> Selecciona un cliente para visualizarlo
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Lista de Clientes ({allCustomers.length} registros)</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Nombre</th>
                            <th>Población</th>
                            <th>País</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allCustomers.map((customer, idx) => (
                            <tr key={idx} onClick={() => handleSelectCustomer(customer)} className="sap-table-row-clickable">
                                <td>{customer.customer}</td>
                                <td>{customer.name}</td>
                                <td>{customer.city}</td>
                                <td>{customer.country}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenXD03;
