import React, { useState } from 'react';
import '../App.css';

import SearchHelp from '../components/SearchHelp';
import { DocumentService } from '../services/documentService';
import { MasterDataService } from '../services/masterDataService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenVA01: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [header, setHeader] = useState({
        customer: '',
        type: 'OR', // Standard Order
        org: '1000',
        channel: '10',
        division: '00',
        date: new Date().toISOString().split('T')[0]
    });
    const [items, setItems] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [showCustomerSearch, setShowCustomerSearch] = useState(false);
    const [showMaterialSearch, setShowMaterialSearch] = useState(false);
    const [activeRow, setActiveRow] = useState<number | null>(null);

    const customers = MasterDataService.getCustomers();
    const materials = MasterDataService.getAllMaterials();

    const handleAddItem = () => {
        setItems(prev => [...prev, {
            material: '',
            description: '',
            quantity: 1,
            unit: 'ST',
            price: 0,
            amount: 0
        }]);
    };

    const handleUpdateItem = (index: number, field: string, value: any) => {
        setItems(prev => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], [field]: value };

            if (field === 'material') {
                const mat = MasterDataService.getMaterialCombined(value);
                if (mat) {
                    newItems[index].description = mat.description;
                    newItems[index].unit = mat.baseUnit;
                    newItems[index].price = mat.price;
                    newItems[index].amount = mat.price * newItems[index].quantity;
                }
            }
            if (field === 'quantity') {
                newItems[index].amount = newItems[index].price * value;
            }
            return newItems;
        });
    };

    const handleSave = () => {
        if (!header.customer || items.length === 0) {
            setMessage('Error: Cliente y posiciones son obligatorios.');
            return;
        }

        const order = DocumentService.saveSalesOrder({ header, items });
        setMessage(`Pedido de cliente ${order.documentNumber} guardado.`);
        setItems([]);
        setHeader({ ...header, customer: '' });
    };

    const openMaterialSearch = (index: number) => {
        setActiveRow(index);
        setShowMaterialSearch(true);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.amount || 0), 0).toFixed(2);
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

            {/* Header */}
            <div className="sap-panel">
                <div className="sap-section-title">Datos de Pedido</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Clase Pedido:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={header.type}
                            onChange={(e) => setHeader({ ...header, type: e.target.value })}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Solicitante:</label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input
                                type="text"
                                className="sap-input w-md"
                                value={header.customer}
                                onChange={(e) => setHeader({ ...header, customer: e.target.value })}
                            />
                            <button onClick={() => setShowCustomerSearch(true)} className="sap-action-button">🔍</button>
                        </div>
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Org. Ventas:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={header.org}
                            onChange={(e) => setHeader({ ...header, org: e.target.value })}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Canal Distr.:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={header.channel}
                            onChange={(e) => setHeader({ ...header, channel: e.target.value })}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Sector:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={header.division}
                            onChange={(e) => setHeader({ ...header, division: e.target.value })}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Valor Neto:</label>
                        <span style={{ fontWeight: 'bold' }}>{calculateTotal()} USD</span>
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="sap-panel">
                <div className="sap-toolbar">
                    <span className="sap-section-title" style={{ marginBottom: 0, border: 'none' }}>Posiciones</span>
                    <div style={{ flex: 1 }}></div>
                    <button onClick={handleAddItem} className="sap-icon-button"><span className="sap-icon">+</span></button>
                </div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Material</th>
                            <th>Denominación</th>
                            <th>Cantidad</th>
                            <th>UM</th>
                            <th>Precio</th>
                            <th>Valor Neto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            className="sap-input w-sm"
                                            value={item.material}
                                            onChange={(e) => handleUpdateItem(idx, 'material', e.target.value)}
                                            onDoubleClick={() => openMaterialSearch(idx)}
                                        />
                                        <button onClick={() => openMaterialSearch(idx)} className="sap-icon-button" style={{ fontSize: '10px' }}>🔍</button>
                                    </div>
                                </td>
                                <td><input type="text" className="sap-input w-lg" value={item.description} onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)} /></td>
                                <td><input type="number" className="sap-input w-xs" value={item.quantity} onChange={(e) => handleUpdateItem(idx, 'quantity', e.target.value)} /></td>
                                <td><input type="text" className="sap-input w-xs" value={item.unit} onChange={(e) => handleUpdateItem(idx, 'unit', e.target.value)} /></td>
                                <td><input type="number" className="sap-input w-sm" value={item.price} onChange={(e) => handleUpdateItem(idx, 'price', e.target.value)} /></td>
                                <td><input type="number" className="sap-input w-sm" value={item.amount} readOnly /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Search Helps */}
            {showCustomerSearch && (
                <SearchHelp
                    title="Clientes"
                    data={customers}
                    columns={[{ key: 'customer', label: 'Cliente' }, { key: 'name', label: 'Nombre' }]}
                    onSelect={(c) => { setHeader({ ...header, customer: c.customer }); setShowCustomerSearch(false); }}
                    onClose={() => setShowCustomerSearch(false)}
                />
            )}

            {showMaterialSearch && (
                <SearchHelp
                    title="Materiales"
                    data={materials}
                    columns={[{ key: 'material', label: 'Material' }, { key: 'description', label: 'Descripción' }]}
                    onSelect={(m) => {
                        if (activeRow !== null) handleUpdateItem(activeRow, 'material', m.material);
                        setShowMaterialSearch(false);
                    }}
                    onClose={() => setShowMaterialSearch(false)}
                />
            )}
        </div>
    );
};

export default ScreenVA01;
