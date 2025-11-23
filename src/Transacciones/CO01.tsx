import React, { useState } from 'react';
import '../App.css';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import SearchHelp from '../components/SearchHelp';
import { MasterDataService } from '../services/masterDataService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenCO01: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [material, setMaterial] = useState('');
    const [prodPlant, setProdPlant] = useState('');
    const [planPlant, setPlanPlant] = useState('');
    const [orderType, setOrderType] = useState('');
    const [order, setOrder] = useState('');
    const [copyOrder, setCopyOrder] = useState('');
    const [message, setMessage] = useState('');

    // Search Help State
    const [showMaterialHelp, setShowMaterialHelp] = useState(false);
    const [showPlantHelp, setShowPlantHelp] = useState(false);

    const handleEnter = () => {
        if (!material || !prodPlant || !orderType) {
            setMessage('Complete los campos obligatorios (Material, Centro, Clase de orden).');
            return;
        }
        setMessage(`Orden de producción creada para material ${material} en centro ${prodPlant}.`);
        setMaterial('');
        setOrder('');
    };

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <button onClick={handleEnter} className="sap-action-button" title="Continuar">
                    ✔
                </button>
                <div style={{ flex: 1 }}></div>
                {message && <span className="sap-status-green">{message}</span>}
            </div>

            <div className="sap-panel" style={{ backgroundColor: '#e5eefc', border: '1px solid #a0a0a0' }}>
                <div className="sap-section-title" style={{ backgroundColor: '#d0e0f0', color: '#000', fontWeight: 'bold', borderBottom: '1px solid #a0a0a0' }}>
                    Production Order Create: Initial Screen
                </div>

                <div className="sap-form-grid" style={{ padding: '20px' }}>
                    <div className="sap-form-row">
                        <label className="sap-label" style={{ width: '150px' }}>Material</label>
                        <div className="sap-input-group" style={{ width: '150px' }}>
                            <input
                                type="text"
                                className="sap-input"
                                value={material}
                                onChange={(e) => setMaterial(e.target.value)}
                            />
                            <button onClick={() => setShowMaterialHelp(true)} className="sap-icon-button-small" tabIndex={-1}>
                                <MagnifyingGlassIcon className="sap-icon-small" />
                            </button>
                        </div>
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label" style={{ width: '150px' }}>Production Plant</label>
                        <div className="sap-input-group" style={{ width: '60px' }}>
                            <input
                                type="text"
                                className="sap-input"
                                value={prodPlant}
                                onChange={(e) => setProdPlant(e.target.value)}
                            />
                            <button onClick={() => setShowPlantHelp(true)} className="sap-icon-button-small" tabIndex={-1}>
                                <MagnifyingGlassIcon className="sap-icon-small" />
                            </button>
                        </div>
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label" style={{ width: '150px' }}>Planning Plant</label>
                        <input
                            type="text"
                            className="sap-input"
                            style={{ width: '60px' }}
                            value={planPlant}
                            onChange={(e) => setPlanPlant(e.target.value)}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label" style={{ width: '150px' }}>Order Type</label>
                        <input
                            type="text"
                            className="sap-input"
                            style={{ width: '60px' }}
                            value={orderType}
                            onChange={(e) => setOrderType(e.target.value)}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label" style={{ width: '150px' }}>Order</label>
                        <input
                            type="text"
                            className="sap-input"
                            style={{ width: '150px' }}
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ margin: '10px 20px', border: '1px solid #a0a0a0', padding: '10px', backgroundColor: '#dceefc' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Copy from</div>
                    <div className="sap-form-row">
                        <label className="sap-label" style={{ width: '150px' }}>Order</label>
                        <input
                            type="text"
                            className="sap-input"
                            style={{ width: '150px' }}
                            value={copyOrder}
                            onChange={(e) => setCopyOrder(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Search Helps */}
            {showMaterialHelp && (
                <SearchHelp
                    title="Materiales"
                    data={MasterDataService.getAllMaterials()}
                    columns={[
                        { key: 'material', label: 'Material' },
                        { key: 'description', label: 'Descripción' },
                        { key: 'type', label: 'Tipo' }
                    ]}
                    onSelect={(item) => {
                        setMaterial(item.material);
                        setShowMaterialHelp(false);
                    }}
                    onClose={() => setShowMaterialHelp(false)}
                />
            )}

            {showPlantHelp && (
                <SearchHelp
                    title="Centros"
                    data={[{ plant: '1000', name: 'Hamburg Plant' }, { plant: '2000', name: 'Berlin Plant' }]}
                    columns={[
                        { key: 'plant', label: 'Centro' },
                        { key: 'name', label: 'Nombre' }
                    ]}
                    onSelect={(item) => {
                        setProdPlant(item.plant);
                        setPlanPlant(item.plant); // Auto-fill planning plant
                        setShowPlantHelp(false);
                    }}
                    onClose={() => setShowPlantHelp(false)}
                />
            )}
        </div>
    );
};

export default ScreenCO01;
