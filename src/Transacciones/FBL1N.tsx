import React, { useState } from 'react';
import '../App.css';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import SearchHelp from '../components/SearchHelp';
import { MasterDataService } from '../services/masterDataService';
import { DocumentService } from '../services/documentService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenFBL1N: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [vendor, setVendor] = useState('');
    const [companyCode, setCompanyCode] = useState('1000');
    const [openItems, setOpenItems] = useState(true);
    const [clearedItems, setClearedItems] = useState(false);
    const [allItems, setAllItems] = useState(false);
    const [executed, setExecuted] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const [showVendorHelp, setShowVendorHelp] = useState(false);

    const handleExecute = () => {
        // Fetch POs as "Vendor Line Items" simulation
        const allPOs = DocumentService.getAllPOs();

        let filtered = allPOs;
        if (vendor) {
            filtered = filtered.filter(po => po.vendor === vendor);
        }

        // Map POs to a "Line Item" structure
        const mappedItems = filtered.map(po => ({
            status: po.status === 'Open' ? '🔴' : '🟢',
            docNumber: po.documentNumber,
            type: 'PO',
            docDate: po.docDate,
            postingDate: po.docDate,
            amount: po.totalValue,
            currency: po.currency,
            vendor: po.vendor
        }));

        setResults(mappedItems);
        setExecuted(true);
    };

    if (executed) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-toolbar">
                    <button onClick={() => setExecuted(false)} className="sap-action-button">&lt; Atrás</button>
                    <span className="sap-page-title" style={{ marginLeft: '10px' }}>Partidas individuales de acreedores</span>
                </div>
                <div className="sap-panel">
                    <div className="sap-section-title">Acreedor: {vendor || '*'} | Sociedad: {companyCode}</div>
                    <table className="sap-table">
                        <thead>
                            <tr>
                                <th>St.</th>
                                <th>Documento</th>
                                <th>Clase</th>
                                <th>Fe.doc.</th>
                                <th>Importe</th>
                                <th>Mda.</th>
                                <th>Acreedor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{row.status}</td>
                                    <td>{row.docNumber}</td>
                                    <td>{row.type}</td>
                                    <td>{row.docDate}</td>
                                    <td style={{ textAlign: 'right' }}>{row.amount.toFixed(2)}</td>
                                    <td>{row.currency}</td>
                                    <td>{row.vendor}</td>
                                </tr>
                            ))}
                            {results.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center' }}>No se encontraron partidas.</td>
                                </tr>
                            )}
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
                <button onClick={handleExecute} className="sap-action-button" title="Ejecutar">🕒 Ejecutar</button>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Selección de acreedores</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Cuenta acreedor:</label>
                        <div className="sap-input-group" style={{ width: '200px' }}>
                            <input
                                type="text"
                                className="sap-input"
                                value={vendor}
                                onChange={(e) => setVendor(e.target.value)}
                            />
                            <button onClick={() => setShowVendorHelp(true)} className="sap-icon-button-small" tabIndex={-1}>
                                <MagnifyingGlassIcon className="sap-icon-small" />
                            </button>
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

                <div className="sap-section-title" style={{ marginTop: '20px' }}>Selección de partidas</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <input
                            type="radio"
                            checked={openItems}
                            onChange={() => { setOpenItems(true); setClearedItems(false); setAllItems(false); }}
                        />
                        <label className="sap-label" style={{ width: 'auto', marginLeft: '5px' }}>Partidas abiertas</label>
                    </div>
                    <div className="sap-form-row">
                        <input
                            type="radio"
                            checked={clearedItems}
                            onChange={() => { setOpenItems(false); setClearedItems(true); setAllItems(false); }}
                        />
                        <label className="sap-label" style={{ width: 'auto', marginLeft: '5px' }}>Partidas compensadas</label>
                    </div>
                    <div className="sap-form-row">
                        <input
                            type="radio"
                            checked={allItems}
                            onChange={() => { setOpenItems(false); setClearedItems(false); setAllItems(true); }}
                        />
                        <label className="sap-label" style={{ width: 'auto', marginLeft: '5px' }}>Todas las partidas</label>
                    </div>
                </div>
            </div>

            {/* Search Help */}
            {showVendorHelp && (
                <SearchHelp
                    title="Acreedores"
                    data={MasterDataService.getVendors()}
                    columns={[
                        { key: 'vendor', label: 'Acreedor' },
                        { key: 'name', label: 'Nombre' },
                        { key: 'city', label: 'Población' }
                    ]}
                    onSelect={(item) => {
                        setVendor(item.vendor);
                        setShowVendorHelp(false);
                    }}
                    onClose={() => setShowVendorHelp(false)}
                />
            )}
        </div>
    );
};

export default ScreenFBL1N;
