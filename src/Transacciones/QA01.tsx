import React, { useState } from 'react';
import '../App.css';
import { QMService } from '../services/qmService';
import { MasterDataService } from '../services/masterDataService';
import SearchHelp from '../components/SearchHelp';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import inspectionPlansData from '../data/inspection_plans.json';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenQA01: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [material, setMaterial] = useState('');
    const [plant, setPlant] = useState('1000');
    const [inspectionType, setInspectionType] = useState('01');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('PC');
    const [batch, setBatch] = useState('');
    const [message, setMessage] = useState('');
    const [showMaterialHelp, setShowMaterialHelp] = useState(false);

    const handleCreate = () => {
        if (!material || !quantity) {
            setMessage('Complete Material y Cantidad');
            return;
        }

        const materialData = MasterDataService.getMaterialCombined(material);
        const plan = (inspectionPlansData as any[]).find(p => p.material === material);

        // Generate inspection results from plan
        const results = plan ? plan.operations.flatMap((op: any) =>
            op.characteristics.map((char: any) => ({
                characteristic: char.characteristic,
                characteristicDescription: char.description,
                targetValue: char.targetValue,
                lowerLimit: char.lowerTolerance,
                upperLimit: char.upperTolerance,
            }))
        ) : [];

        const lot = QMService.saveInspectionLot({
            material,
            materialDescription: materialData?.description,
            batch,
            plant,
            inspectionType,
            quantity: parseFloat(quantity),
            unit,
            status: 'REL',
            inspectionPlan: plan ? `${plan.planGroup}/${plan.groupCounter}` : undefined,
            results,
        });

        setMessage(`Lote de inspección ${lot.inspectionLot} creado`);
        setTimeout(() => {
            setMaterial('');
            setQuantity('');
            setBatch('');
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
                    💡 <strong>Siguiente:</strong> Registrar resultados en <strong>QE01</strong>
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Datos generales</div>
                <div className="sap-form-grid">
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
                        <label className="sap-label">Lote:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                            placeholder="Opcional"
                        />
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
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Datos de inspección</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Tipo de inspección:</label>
                        <select
                            className="sap-input w-md"
                            value={inspectionType}
                            onChange={(e) => setInspectionType(e.target.value)}
                        >
                            <option value="01">01 - Entrada de mercancías</option>
                            <option value="02">02 - En proceso</option>
                            <option value="03">03 - Inspección final</option>
                            <option value="04">04 - Inspección de salida</option>
                        </select>
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Cantidad:</label>
                        <input
                            type="number"
                            className="sap-input w-md"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                        <select
                            className="sap-input w-xs"
                            style={{ marginLeft: '5px' }}
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                        >
                            <option value="PC">PC</option>
                            <option value="KG">KG</option>
                            <option value="L">L</option>
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

export default ScreenQA01;
