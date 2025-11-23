import React, { useState } from 'react';
import '../App.css';
import { MasterDataService } from '../services/masterDataService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenMM02: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [showList, setShowList] = useState(true);
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});
    const [message, setMessage] = useState('');

    const allMaterials = MasterDataService.getAllMaterials();

    const handleSelectMaterial = (material: any) => {
        setSelectedMaterial(material);
        setFormData({ ...material });
        setShowList(false);
    };

    const handleSave = () => {
        setMessage(`Material ${formData.material} modificado correctamente`);
        setTimeout(() => setMessage(''), 3000);
    };

    if (!showList && selectedMaterial) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-page-title">{tDescription} ({tCode})</div>

                <div className="sap-toolbar">
                    <button onClick={handleSave} className="sap-action-button">💾 Guardar</button>
                    <button onClick={() => setShowList(true)} className="sap-action-button">&lt; Volver</button>
                    <div style={{ flex: 1 }}></div>
                    {message && <span className="sap-status-green">{message}</span>}
                    <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                        💡 <strong>Siguiente:</strong> Visualizar en <strong>MM03</strong>
                    </div>
                </div>

                <div className="sap-panel">
                    <div className="sap-section-title">Material: {selectedMaterial.material}</div>
                    <div className="sap-form-grid">
                        <div className="sap-form-row">
                            <label className="sap-label">Descripción:</label>
                            <input
                                type="text"
                                className="sap-input w-lg"
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Tipo:</label>
                            <input
                                type="text"
                                className="sap-input w-md"
                                value={formData.type || ''}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Ramo:</label>
                            <input
                                type="text"
                                className="sap-input w-md"
                                value={formData.industry || ''}
                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Precio:</label>
                            <input
                                type="number"
                                className="sap-input w-md"
                                value={formData.price || ''}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <div className="sap-status-bar" style={{ backgroundColor: '#fff3cd', padding: '5px 10px', borderRadius: '3px' }}>
                    💡 <strong>Instrucción:</strong> Selecciona un material para modificarlo
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Lista de Materiales ({allMaterials.length} registros)</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Material</th>
                            <th>Descripción</th>
                            <th>Tipo</th>
                            <th>Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allMaterials.map((mat, idx) => (
                            <tr key={idx} onClick={() => handleSelectMaterial(mat)} className="sap-table-row-clickable">
                                <td>{mat.material}</td>
                                <td>{mat.description}</td>
                                <td>{mat.type}</td>
                                <td style={{ textAlign: 'right' }}>{mat.price} {mat.currency}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenMM02;
