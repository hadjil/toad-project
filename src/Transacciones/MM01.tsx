import React, { useState } from 'react';
import '../App.css';
import { MasterDataService } from '../services/masterDataService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenMM01: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [material, setMaterial] = useState({
        material: '',
        description: '',
        type: 'ROH',
        industry: 'M',
        baseUnit: 'ST',
        price: 0,
        currency: 'USD'
    });
    const [message, setMessage] = useState('');

    const handleSave = () => {
        if (!material.material || !material.description) {
            setMessage('Error: Complete los campos obligatorios.');
            return;
        }

        MasterDataService.saveMaterial(material);
        setMessage(`Material ${material.material} creado con éxito.`);
        setMaterial({ ...material, material: '', description: '' });
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
                <div className="sap-section-title">Datos Base 1</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Material:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={material.material}
                            onChange={(e) => setMaterial({ ...material, material: e.target.value })}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Descripción:</label>
                        <input
                            type="text"
                            className="sap-input w-lg"
                            value={material.description}
                            onChange={(e) => setMaterial({ ...material, description: e.target.value })}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Tipo Material:</label>
                        <select
                            className="sap-input w-md"
                            value={material.type}
                            onChange={(e) => setMaterial({ ...material, type: e.target.value })}
                        >
                            <option value="ROH">Materia Prima (ROH)</option>
                            <option value="HALB">Semielaborado (HALB)</option>
                            <option value="FERT">Producto Terminado (FERT)</option>
                            <option value="DIEN">Servicio (DIEN)</option>
                        </select>
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Ramo:</label>
                        <select
                            className="sap-input w-md"
                            value={material.industry}
                            onChange={(e) => setMaterial({ ...material, industry: e.target.value })}
                        >
                            <option value="M">Ingeniería Mecánica</option>
                            <option value="C">Química</option>
                            <option value="P">Farmacéutica</option>
                        </select>
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Unidad Medida Base:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={material.baseUnit}
                            onChange={(e) => setMaterial({ ...material, baseUnit: e.target.value })}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Precio Estándar:</label>
                        <input
                            type="number"
                            className="sap-input w-sm"
                            value={material.price}
                            onChange={(e) => setMaterial({ ...material, price: parseFloat(e.target.value) })}
                        />
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={material.currency}
                            readOnly
                            style={{ marginLeft: '5px' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScreenMM01;
