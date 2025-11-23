import React, { useState, useEffect } from 'react';
import '../App.css';
import SearchHelp from '../components/SearchHelp';
import { DocumentService } from '../services/documentService';
import { MasterDataService } from '../services/masterDataService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
    poNumber?: string; // optional PO to edit
}

const ScreenME22N: React.FC<ScreenProps> = ({ tCode, tDescription, poNumber }) => {
    const [header, setHeader] = useState({
        vendor: '',
        org: '1000',
        group: '001',
        company: '1000',
        date: new Date().toISOString().split('T')[0]
    });
    const [items, setItems] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [showVendorSearch, setShowVendorSearch] = useState(false);
    const [showMaterialSearch, setShowMaterialSearch] = useState(false);
    const [activeRow, setActiveRow] = useState<number | null>(null);

    const vendors = MasterDataService.getVendors();
    const materials = MasterDataService.getAllMaterials();

    // Load existing PO if poNumber provided
    useEffect(() => {
        if (poNumber) {
            const po = DocumentService.getPO(poNumber);
            if (po) {
                setHeader({
                    vendor: po.header.vendor,
                    org: po.header.org,
                    group: po.header.group,
                    company: po.header.company,
                    date: po.header.date
                });
                setItems(po.items);
            }
        }
    }, [poNumber]);

    const handleAddItem = () => {
        setItems(prev => [...prev, {
            material: '',
            shortText: '',
            quantity: 1,
            unit: 'ST',
            price: 0,
            plant: '1000'
        }]);
    };

    const handleUpdateItem = (index: number, field: string, value: any) => {
        setItems(prev => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], [field]: value };
            if (field === 'material') {
                const mat = MasterDataService.getMaterialCombined(value);
                if (mat) {
                    newItems[index].shortText = mat.description;
                    newItems[index].unit = mat.baseUnit;
                    newItems[index].price = mat.price;
                }
            }
            return newItems;
        });
    };

    const handleSave = () => {
        if (!header.vendor || items.length === 0) {
            setMessage('Error: Proveedor y posiciones son obligatorios.');
            return;
        }
        const po = DocumentService.savePO({ header, items });
        setMessage(`Pedido ${po.documentNumber} actualizado.`);
    };

    const openMaterialSearch = (index: number) => {
        setActiveRow(index);
        setShowMaterialSearch(true);
    };

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>
            <div className="sap-toolbar">
                <button onClick={handleSave} className="sap-action-button sap-action-create">Guardar</button>
                <div style={{ flex: 1 }} />
                {message && <span className="sap-status-green">{message}</span>}
            </div>
            {/* Header */}
            <div className="sap-panel">
                <div className="sap-section-title">Cabecera</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Proveedor:</label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input type="text" className="sap-input w-md" value={header.vendor}
                                onChange={e => setHeader({ ...header, vendor: e.target.value })} />
                            <button onClick={() => setShowVendorSearch(true)} className="sap-action-button">🔍</button>
                        </div>
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Org. Compras:</label>
                        <input type="text" className="sap-input w-xs" value={header.org}
                            onChange={e => setHeader({ ...header, org: e.target.value })} />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Gpo. Compras:</label>
                        <input type="text" className="sap-input w-xs" value={header.group}
                            onChange={e => setHeader({ ...header, group: e.target.value })} />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Fecha Pedido:</label>
                        <input type="date" className="sap-input w-md" value={header.date}
                            onChange={e => setHeader({ ...header, date: e.target.value })} />
                    </div>
                </div>
            </div>
            {/* Items */}
            <div className="sap-panel">
                <div className="sap-toolbar">
                    <span className="sap-section-title" style={{ marginBottom: 0, border: 'none' }}>Resumen de Posiciones</span>
                    <div style={{ flex: 1 }} />
                    <button onClick={handleAddItem} className="sap-icon-button"><span className="sap-icon">+</span></button>
                </div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Material</th>
                            <th>Texto Breve</th>
                            <th>Cantidad</th>
                            <th>Unidad</th>
                            <th>Precio Neto</th>
                            <th>Centro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input type="text" className="sap-input w-sm" value={item.material}
                                            onChange={e => handleUpdateItem(idx, 'material', e.target.value)}
                                            onDoubleClick={() => openMaterialSearch(idx)} />
                                        <button onClick={() => openMaterialSearch(idx)} className="sap-icon-button" style={{ fontSize: '10px' }}>🔍</button>
                                    </div>
                                </td>
                                <td><input type="text" className="sap-input w-lg" value={item.shortText}
                                    onChange={e => handleUpdateItem(idx, 'shortText', e.target.value)} /></td>
                                <td><input type="number" className="sap-input w-xs" value={item.quantity}
                                    onChange={e => handleUpdateItem(idx, 'quantity', e.target.value)} /></td>
                                <td><input type="text" className="sap-input w-xs" value={item.unit}
                                    onChange={e => handleUpdateItem(idx, 'unit', e.target.value)} /></td>
                                <td><input type="number" className="sap-input w-sm" value={item.price}
                                    onChange={e => handleUpdateItem(idx, 'price', e.target.value)} /></td>
                                <td><input type="text" className="sap-input w-xs" value={item.plant}
                                    onChange={e => handleUpdateItem(idx, 'plant', e.target.value)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Search Helps */}
            {showVendorSearch && (
                <SearchHelp
                    title="Proveedores"
                    data={vendors}
                    columns={[{ key: 'vendor', label: 'Proveedor' }, { key: 'name', label: 'Nombre' }]}
                    onSelect={v => { setHeader({ ...header, vendor: v.vendor }); setShowVendorSearch(false); }}
                    onClose={() => setShowVendorSearch(false)}
                />
            )}
            {showMaterialSearch && (
                <SearchHelp
                    title="Materiales"
                    data={materials}
                    columns={[{ key: 'material', label: 'Material' }, { key: 'description', label: 'Descripción' }]}
                    onSelect={m => { if (activeRow !== null) handleUpdateItem(activeRow, 'material', m.material); setShowMaterialSearch(false); }}
                    onClose={() => setShowMaterialSearch(false)}
                />
            )}
        </div>
    );
};

export default ScreenME22N;
