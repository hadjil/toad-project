import React, { useState } from 'react';
import '../App.css';
import { MasterDataService, type GLAccount } from '../services/masterDataService';
import SearchHelp from '../components/SearchHelp';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenFS00: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [accountNum, setAccountNum] = useState('');
    const [account, setAccount] = useState<GLAccount | null>(null);
    const [showSearch, setShowSearch] = useState(false);

    const glAccounts = MasterDataService.getGLAccounts();

    const handleSearch = () => {
        const acc = MasterDataService.getGLAccount(accountNum);
        setAccount(acc || null);
    };

    const handleSelect = (item: any) => {
        setAccountNum(item.account);
        setAccount(item);
        setShowSearch(false);
    };

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-panel">
                <div className="sap-form-row">
                    <label className="sap-label">Cuenta Mayor:</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={accountNum}
                            onChange={(e) => setAccountNum(e.target.value)}
                        />
                        <button onClick={() => setShowSearch(true)} className="sap-action-button">
                            🔍
                        </button>
                        <button onClick={handleSearch} className="sap-action-button">
                            Visualizar
                        </button>
                    </div>
                </div>
            </div>

            {account && (
                <div className="sap-panel">
                    <div className="sap-section-title">Datos Maestros</div>

                    <div className="sap-tabs-container">
                        <div className="sap-tab-header">Tipo/Denominación</div>
                        <div className="sap-tab-content sap-form-grid">
                            <div className="sap-form-row">
                                <label className="sap-label">Cuenta:</label>
                                <span>{account.account}</span>
                            </div>
                            <div className="sap-form-row">
                                <label className="sap-label">Texto breve:</label>
                                <span>{account.description}</span>
                            </div>
                            <div className="sap-form-row">
                                <label className="sap-label">Tipo cuenta:</label>
                                <span>{account.type === 'BS' ? 'Balance' : 'Beneficios'}</span>
                            </div>
                            <div className="sap-form-row">
                                <label className="sap-label">Moneda:</label>
                                <span>{account.currency}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showSearch && (
                <SearchHelp
                    title="Cuentas de Mayor"
                    data={glAccounts}
                    columns={[
                        { key: 'account', label: 'Cuenta' },
                        { key: 'description', label: 'Descripción' }
                    ]}
                    onSelect={handleSelect}
                    onClose={() => setShowSearch(false)}
                />
            )}
        </div>
    );
};

export default ScreenFS00;
