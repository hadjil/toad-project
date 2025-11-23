import React, { useState } from 'react';
import '../App.css';
import SearchHelp from '../components/SearchHelp';
import { MasterDataService } from '../services/masterDataService';
import { DocumentService } from '../services/documentService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenME01: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [list, setList] = useState({
        listId: '',
        description: '',
        vendor: '',
        validFrom: '',
        validTo: '',
        materials: [] as string[]
    });
    const [materialInput, setMaterialInput] = useState('');
    const [message, setMessage] = useState('');
    const [showVendorSearch, setShowVendorSearch] = useState(false);

    const vendors = MasterDataService.getVendors();

    const addMaterial = () => {
        if (materialInput && !list.materials.includes(materialInput)) {
            setList(prev => ({ ...prev, materials: [...prev.materials, materialInput] }));
            setMaterialInput('');
        }
    };

    const handleSave = () => {
        if (!list.listId || !list.vendor) {
            setMessage('Error: ID de lista y proveedor son obligatorios.');
            return;
        }
        DocumentService.saveSourceList(list);
        setMessage(`Lista de fuentes ${list.listId} guardada.`);
    };

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>
            <div className="sap-toolbar">
                <button onClick={handleSave} className="sap-action-button sap-action-create">Guardar</button>
                {message && <span className="sap-status-green">{message}</span>}
            </div>
            <div className="sap-panel">
                <div className="sap-section-title">Datos de la Lista</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">ID Lista:</label>
                        <input type="text" className="sap-input w-md" value={list.listId}
                            onChange={e => setList({ ...list, listId: e.target.value })} />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Descripción:</label>
                        <input type="text" className="sap-input w-lg" value={list.description}
                            onChange={e => setList({ ...list, description: e.target.value })} />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Proveedor:</label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input type="text" className="sap-input w-md" value={list.vendor}
                                onChange={e => setList({ ...list, vendor: e.target.value })} />
                            <button onClick={() => setShowVendorSearch(true)} className="sap-action-button">🔍</button>
                        </div>
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Válido Desde:</label>
                        <input type="date" className="sap-input w-md" value={list.validFrom}
                            onChange={e => setList({ ...list, validFrom: e.target.value })} />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Válido Hasta:</label>
                        <input type="date" className="sap-input w-md" value={list.validTo}
                            onChange={e => setList({ ...list, validTo: e.target.value })} />
                    </div>
                </div>
            </div>
            <div className="sap-panel">
                <div className="sap-section-title">Materiales</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Material:</label>
                        <input type="text" className="sap-input w-sm" value={materialInput}
                            onChange={e => setMaterialInput(e.target.value)} />
                        <button onClick={addMaterial} className="sap-action-button">Añadir</button>
                    </div>
                </div>
                <ul>
                    {list.materials.map((m, idx) => <li key={idx}>{m}</li>)}
                </ul>
            </div>
            {showVendorSearch && (
                <SearchHelp
                    title="Proveedores"
                    data={vendors}
                    columns={[{ key: 'vendor', label: 'Proveedor' }, { key: 'name', label: 'Nombre' }]}
                    onSelect={v => { setList({ ...list, vendor: v.vendor }); setShowVendorSearch(false); }}
                    onClose={() => setShowVendorSearch(false)}
                />
            )}
        </div>
    );
};

export default ScreenME01;
