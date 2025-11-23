import React, { useState } from 'react';
import '../App.css';
import { QMService } from '../services/qmService';
import { MasterDataService } from '../services/masterDataService';
import SearchHelp from '../components/SearchHelp';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenQP01: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [planGroup, setPlanGroup] = useState('');
    const [groupCounter, setGroupCounter] = useState('1');
    const [material, setMaterial] = useState('');
    const [plant, setPlant] = useState('1000');
    const [usage, setUsage] = useState('1');
    const [status, setStatus] = useState('1');
    const [message, setMessage] = useState('');
    const [showMaterialHelp, setShowMaterialHelp] = useState(false);

    const handleCreate = () => {
        if (!planGroup || !material) {
            setMessage('Complete Grupo de plan y Material');
            return;
        }

        const materialData = MasterDataService.getMaterialCombined(material);

        const newPlan = {
            planGroup,
            groupCounter,
            material,
            materialDescription: materialData?.description || '',
            plant,
            usage,
            status,
            operations: [
                {
                    operation: '0010',
                    description: 'Inspección Visual',
                    workCenter: 'QC-01',
                    characteristics: [
                        {
                            characteristic: 'APPEARANCE',
                            description: 'Apariencia superficial',
                            inspectionMethod: 'Visual',
                            targetValue: 1,
                            lowerTolerance: 1,
                            upperTolerance: 1,
                            unit: 'SCORE'
                        }
                    ]
                }
            ]
        };

        QMService.saveInspectionPlan(newPlan);
        setMessage(`Plan ${planGroup}/${groupCounter} creado`);

        setTimeout(() => {
            setPlanGroup('');
            setMaterial('');
            setMessage('');
        }, 3000);
    };

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <button onClick={handleCreate} className="sap-action-button">✔ Crear</button>
                <div style={{ flex: 1 }}></div>
                {message && <span className="sap-status-green">{message}</span>}
                <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                    💡 <strong>Siguiente:</strong> Visualizar en <strong>QP03</strong>
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Datos generales</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Grupo de plan:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={planGroup}
                            onChange={(e) => setPlanGroup(e.target.value)}
                            placeholder="ej: MAT001"
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Contador de grupo:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={groupCounter}
                            onChange={(e) => setGroupCounter(e.target.value)}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Material:</label>
                        <div className="sap-input-group" style={{ width: '200px' }}>
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
                        <label className="sap-label">Centro:</label>
                        <input
                            type="text"
                            className="sap-input w-xs"
                            value={plant}
                            onChange={(e) => setPlant(e.target.value)}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Utilización:</label>
                        <select
                            className="sap-input w-md"
                            value={usage}
                            onChange={(e) => setUsage(e.target.value)}
                        >
                            <option value="1">1 - Producción</option>
                            <option value="2">2 - Inspección</option>
                        </select>
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Estado:</label>
                        <select
                            className="sap-input w-md"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="1">1 - Creado</option>
                            <option value="2">2 - Liberado</option>
                            <option value="3">3 - Bloqueado</option>
                        </select>
                    </div>
                </div>
            </div>

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
        </div>
    );
};

export default ScreenQP01;
