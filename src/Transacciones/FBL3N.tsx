import React, { useState } from 'react';
import '../App.css';
import { DocumentService } from '../services/documentService';
import { MasterDataService } from '../services/masterDataService';
import SearchHelp from '../components/SearchHelp';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenFBL3N: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [account, setAccount] = useState('');
    const [companyCode, setCompanyCode] = useState('1000');
    const [items, setItems] = useState<any[]>([]);
    const [executed, setExecuted] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const glAccounts = MasterDataService.getGLAccounts();

    const handleExecute = () => {
        const allDocs = DocumentService.getAllFIDocuments();
        let foundItems: any[] = [];

        allDocs.forEach(doc => {
            if (doc.companyCode === companyCode) {
                doc.items.forEach(item => {
                    if (!account || item.account === account) {
                        foundItems.push({
                            ...item,
                            docNumber: doc.documentNumber,
                            docDate: doc.documentDate,
                            type: doc.type,
                            currency: doc.currency
                        });
                    }
                });
            }
        });

        setItems(foundItems);
        setExecuted(true);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => {
            const val = parseFloat(item.amount);
            return item.postingKey === '40' ? sum + val : sum - val;
        }, 0).toFixed(2);
    };

    if (executed) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-toolbar">
                    <button onClick={() => setExecuted(false)} className="sap-action-button">
                        &lt; Atrás
                    </button>
                    <span className="sap-page-title" style={{ marginLeft: '10px' }}>Lista de Partidas Individuales de Cuenta de Mayor</span>
                </div>

                <div className="sap-panel">
                    <div className="sap-section-title">
                        Cuenta: {account ? account : 'Todas'} | Sociedad: {companyCode}
                    </div>
                    <table className="sap-table">
                        <thead>
                            <tr>
                                <th>Estado</th>
                                <th>Asignación</th>
                                <th>Nº Documento</th>
                                <th>Clase</th>
                                <th>Fecha Doc.</th>
                                <th>ClvCT</th>
                                <th>Importe en MD</th>
                                <th>Mda.</th>
                                <th>Texto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    <td><span className="sap-status-green">●</span></td>
                                    <td>{item.docDate.replace(/-/g, '')}</td>
                                    <td>{item.docNumber}</td>
                                    <td>{item.type}</td>
                                    <td>{item.docDate}</td>
                                    <td>{item.postingKey}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        {item.postingKey === '50' ? '-' : ''}{parseFloat(item.amount).toFixed(2)}
                                    </td>
                                    <td>{item.currency}</td>
                                    <td>{item.text}</td>
                                </tr>
                            ))}
                            <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                <td colSpan={6} style={{ textAlign: 'right' }}>Saldo:</td>
                                <td style={{ textAlign: 'right' }}>{calculateTotal()}</td>
                                <td colSpan={2}></td>
                            </tr>
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
                <div className="sap-section-title">Selección de Cuentas de Mayor</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Cuenta de mayor:</label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input
                                type="text"
                                className="sap-input w-md"
                                value={account}
                                onChange={(e) => setAccount(e.target.value)}
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
                    title="Cuentas de Mayor"
                    data={glAccounts}
                    columns={[{ key: 'account', label: 'Cuenta' }, { key: 'description', label: 'Descripción' }]}
                    onSelect={(acc) => { setAccount(acc.account); setShowSearch(false); }}
                    onClose={() => setShowSearch(false)}
                />
            )}
        </div>
    );
};

export default ScreenFBL3N;
