import React, { useState } from 'react';
import '../App.css';
import SearchHelp from '../components/SearchHelp';
import { MasterDataService } from '../services/masterDataService';
import { DocumentService } from '../services/documentService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenMIR4: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [filters, setFilters] = useState({
        vendor: '',
        dateFrom: '',
        dateTo: ''
    });
    const [invoices, setInvoices] = useState<any[]>([]);
    const [showVendorSearch, setShowVendorSearch] = useState(false);

    const vendors = MasterDataService.getVendors();

    const handleSearch = () => {
        const data = DocumentService.getInvoices(filters);
        setInvoices(data);
    };

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>
            <div className="sap-toolbar">
                <button onClick={handleSearch} className="sap-action-button sap-action-search">Buscar</button>
            </div>
            {/* Filters */}
            <div className="sap-panel">
                <div className="sap-section-title">Filtros</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Proveedor:</label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input type="text" className="sap-input w-md" value={filters.vendor}
                                onChange={e => setFilters({ ...filters, vendor: e.target.value })} />
                            <button onClick={() => setShowVendorSearch(true)} className="sap-action-button">🔍</button>
                        </div>
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Fecha Desde:</label>
                        <input type="date" className="sap-input w-md" value={filters.dateFrom}
                            onChange={e => setFilters({ ...filters, dateFrom: e.target.value })} />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Fecha Hasta:</label>
                        <input type="date" className="sap-input w-md" value={filters.dateTo}
                            onChange={e => setFilters({ ...filters, dateTo: e.target.value })} />
                    </div>
                </div>
            </div>
            {/* Results */}
            <div className="sap-panel">
                <div className="sap-section-title">Facturas</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Factura Nº</th>
                            <th>Proveedor</th>
                            <th>Fecha</th>
                            <th>Importe</th>
                            <th>Moneda</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv, idx) => (
                            <tr key={idx}>
                                <td>{inv.invoiceNumber}</td>
                                <td>{inv.vendor}</td>
                                <td>{inv.date}</td>
                                <td>{inv.amount}</td>
                                <td>{inv.currency}</td>
                                <td>{inv.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showVendorSearch && (
                <SearchHelp
                    title="Proveedores"
                    data={vendors}
                    columns={[{ key: 'vendor', label: 'Proveedor' }, { key: 'name', label: 'Nombre' }]}
                    onSelect={v => { setFilters({ ...filters, vendor: v.vendor }); setShowVendorSearch(false); }}
                    onClose={() => setShowVendorSearch(false)}
                />
            )}
        </div>
    );
};

export default ScreenMIR4;
