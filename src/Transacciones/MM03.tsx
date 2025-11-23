import React, { useState } from 'react';
import '../App.css';
import { MasterDataService } from '../services/masterDataService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenMM03: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
    const [showList, setShowList] = useState(true);

    const allMaterials = MasterDataService.getAllMaterials();

    const handleSelectMaterial = (material: any) => {
        setSelectedMaterial(material);
        setShowList(false);
    };

    if (!showList && selectedMaterial) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-page-title">{tDescription} ({tCode})</div>

                <div className="sap-toolbar">
                    <button onClick={() => setShowList(true)} className="sap-action-button">&lt; Volver a lista</button>
                    <div style={{ flex: 1 }}></div>
                    <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                        💡 <strong>Siguiente paso:</strong> Puedes modificar este material en <strong>MM02</strong>
                    </div>
                </div>

                <div className="sap-panel">
                    <div className="sap-section-title">Material: {selectedMaterial.material}</div>
                    <div className="sap-form-grid">
                        <div className="sap-form-row">
                            <label className="sap-label">Descripción:</label>
                            <input type="text" className="sap-input w-lg" value={selectedMaterial.description} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Tipo:</label>
                            <input type="text" className="sap-input w-md" value={selectedMaterial.type} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Ramo:</label>
                            <input type="text" className="sap-input w-md" value={selectedMaterial.industry} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Unidad base:</label>
                            <input type="text" className="sap-input w-xs" value={selectedMaterial.baseUnit} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Precio:</label>
                            <input type="text" className="sap-input w-md" value={`${selectedMaterial.price} ${selectedMaterial.currency}`} disabled />
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
                    💡 <strong>Instrucción:</strong> Selecciona un material de la lista para visualizarlo
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
                            <th>Ramo</th>
                            <th>Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allMaterials.map((mat, idx) => (
                            <tr key={idx} onClick={() => handleSelectMaterial(mat)} className="sap-table-row-clickable">
                                <td>{mat.material}</td>
                                <td>{mat.description}</td>
                                <td>{mat.type}</td>
                                <td>{mat.industry}</td>
                                <td style={{ textAlign: 'right' }}>{mat.price} {mat.currency}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenMM03;
