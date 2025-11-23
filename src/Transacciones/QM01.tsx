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

const ScreenQM01: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [notificationType, setNotificationType] = useState('Q1');
    const [material, setMaterial] = useState('');
    const [plant, setPlant] = useState('1000');
    const [defectCode, setDefectCode] = useState('');
    const [defectDescription, setDefectDescription] = useState('');
    const [priority, setPriority] = useState('3');
    const [description, setDescription] = useState('');
    const [longText, setLongText] = useState('');
    const [message, setMessage] = useState('');
    const [showMaterialHelp, setShowMaterialHelp] = useState(false);

    const handleSave = () => {
        if (!material || !defectCode || !description) {
            setMessage('Complete los campos obligatorios');
            return;
        }

        const materialData = MasterDataService.getMaterialCombined(material);
        const notification = QMService.saveNotification({
            notificationType,
            material,
            materialDescription: materialData?.description,
            plant,
            defectCode,
            defectDescription,
            priority,
            status: 'OSNO',
            createdBy: 'USER01',
            description,
            longText,
        });

        setMessage(`Aviso de calidad ${notification.notificationNumber} creado`);
        setTimeout(() => {
            setMaterial('');
            setDefectCode('');
            setDefectDescription('');
            setDescription('');
            setLongText('');
            setMessage('');
        }, 3000);
    };

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <button onClick={handleSave} className="sap-action-button">💾 Guardar</button>
                <div style={{ flex: 1 }}></div>
                {message && <span className="sap-status-green">{message}</span>}
                <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                    💡 <strong>Siguiente:</strong> Visualizar en <strong>QM03</strong> o crear lote en <strong>QA01</strong>
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Datos de cabecera</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Clase de aviso:</label>
                        <select
                            className="sap-input w-md"
                            value={notificationType}
                            onChange={(e) => setNotificationType(e.target.value)}
                        >
                            <option value="Q1">Q1 - Aviso de calidad</option>
                            <option value="Q2">Q2 - Reclamación</option>
                            <option value="Q3">Q3 - Auditoría</option>
                        </select>
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Prioridad:</label>
                        <select
                            className="sap-input w-xs"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="1">1 - Muy alta</option>
                            <option value="2">2 - Alta</option>
                            <option value="3">3 - Media</option>
                            <option value="4">4 - Baja</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Datos de objeto</div>
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
                <div className="sap-section-title">Defecto</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Código de defecto:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={defectCode}
                            onChange={(e) => setDefectCode(e.target.value)}
                            placeholder="ej: DEF-001"
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Descripción breve:</label>
                        <input
                            type="text"
                            className="sap-input w-lg"
                            value={defectDescription}
                            onChange={(e) => setDefectDescription(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Descripción</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Texto breve:</label>
                        <input
                            type="text"
                            className="sap-input w-full"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Texto largo:</label>
                        <textarea
                            className="sap-input w-full"
                            rows={4}
                            value={longText}
                            onChange={(e) => setLongText(e.target.value)}
                        />
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

export default ScreenQM01;
