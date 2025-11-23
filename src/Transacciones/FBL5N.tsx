import React, { useState } from 'react';
import '../App.css';
import { DocumentService } from '../services/documentService';
import { MasterDataService } from '../services/masterDataService';
import SearchHelp from '../components/SearchHelp';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenFBL5N: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [customer, setCustomer] = useState('');
    const [companyCode, setCompanyCode] = useState('1000');
    const [items, setItems] = useState<any[]>([]);
    const [executed, setExecuted] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const customers = MasterDataService.getCustomers();

    const handleExecute = () => {
        // We look for Sales Orders and Invoices
        const allDocs = DocumentService.getAllSalesDocuments();
        let foundItems: any[] = [];

        allDocs.forEach(doc => {
            // Check if it matches customer (Sales Orders have header.customer, Invoices might need logic check)
            // For simplicity, we assume invoices are linked or we just show Sales Orders as "items"

            const docCustomer = doc.header?.customer || ''; // Adjust based on data structure

            if (!customer || docCustomer === customer) {
                // Calculate value
                let amount = 0;
                if (doc.items) {
                    amount = doc.items.reduce((sum: number, i: any) => sum + (i.amount || i.netValue || 0), 0);
                } else if (doc.totalValue) {
                    amount = doc.totalValue;
                }

                foundItems.push({
                    docNumber: doc.documentNumber,
                    docDate: doc.createdAt.split('T')[0],
                    type: doc.type === 'Invoice' ? 'RV' : 'OR', // RV = Billing, OR = Standard Order
                    customer: docCustomer,
                    amount: amount,
                    currency: 'USD',
                    text: doc.type
                });
            }
        });

        setItems(foundItems);
        setExecuted(true);
    };

    if (executed) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-toolbar">
                    <button onClick={() => setExecuted(false)} className="sap-action-button">
                        &lt; Atrás
                    </button>
                    <span className="sap-page-title" style={{ marginLeft: '10px' }}>Lista de Partidas Individuales de Deudores</span>
                </div>

                <div className="sap-panel">
                    <div className="sap-section-title">
                        Deudor: {customer ? customer : 'Todos'} | Sociedad: {companyCode}
                    </div>
                    <table className="sap-table">
                        <thead>
                            <tr>
                                <th>Estado</th>
                                <th>Deudor</th>
                                <th>Nº Documento</th>
                                <th>Clase</th>
                                <th>Fecha Doc.</th>
                                <th>Importe</th>
                                <th>Mda.</th>
                                <th>Texto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    <td><span className="sap-status-red">●</span></td>
                                    <td>{item.customer}</td>
                                    <td>{item.docNumber}</td>
                                    <td>{item.type}</td>
                                    <td>{item.docDate}</td>
                                    <td style={{ textAlign: 'right' }}>{item.amount.toFixed(2)}</td>
                                    <td>{item.currency}</td>
                                    <td>{item.text}</td>
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
                <button onClick={handleExecute} className="sap-action-button" style={{ fontWeight: 'bold' }}>
                    🕒 Ejecutar
                </button>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Selección de Deudores</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Cuenta deudor:</label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input
                                type="text"
                                className="sap-input w-md"
                                value={customer}
                                onChange={(e) => setCustomer(e.target.value)}
                            />
                            <button onClick={() => setShowSearch(true)} className="sap-action-button">🔍</button>
                        </div>
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Sociedad:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={companyCode}
                            onChange={(e) => setCompanyCode(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Selección de partidas</div>
                <div className="sap-form-row">
                    <input type="radio" name="status" defaultChecked /> <label>Partidas abiertas</label>
                </div>
                <div className="sap-form-row">
                    <input type="radio" name="status" /> <label>Partidas compensadas</label>
                </div>
                <div className="sap-form-row">
                    <input type="radio" name="status" /> <label>Todas las partidas</label>
                </div>
            </div>

            {showSearch && (
                <SearchHelp
                    title="Clientes"
                    data={customers}
                    columns={[{ key: 'customer', label: 'Cliente' }, { key: 'name', label: 'Nombre' }]}
                    onSelect={(c) => { setCustomer(c.customer); setShowSearch(false); }}
                    onClose={() => setShowSearch(false)}
                />
            )}
        </div>
    );
};

export default ScreenFBL5N;
