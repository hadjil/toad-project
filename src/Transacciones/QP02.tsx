import React, { useState } from 'react';
import '../App.css';
import { QMService } from '../services/qmService';
import inspectionPlansData from '../data/inspection_plans.json';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenQP02: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [showList, setShowList] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');

    const allPlans = [...(inspectionPlansData as any[]), ...QMService.getAllInspectionPlans()];

    const handleSelectPlan = (plan: any) => {
        setSelectedPlan(plan);
        setStatus(plan.status);
        setShowList(false);
    };

    const handleSave = () => {
        setMessage(`Plan ${selectedPlan.planGroup}/${selectedPlan.groupCounter} actualizado`);
        setTimeout(() => {
            setShowList(true);
            setMessage('');
        }, 2000);
    };

    if (!showList && selectedPlan) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-page-title">{tDescription} ({tCode})</div>

                <div className="sap-toolbar">
                    <button onClick={handleSave} className="sap-action-button">💾 Guardar</button>
                    <button onClick={() => setShowList(true)} className="sap-action-button">&lt; Volver</button>
                    <div style={{ flex: 1 }}></div>
                    {message && <span className="sap-status-green">{message}</span>}
                    <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                        💡 <strong>Siguiente:</strong> Visualizar en <strong>QP03</strong>
                    </div>
                </div>

                <div className="sap-panel">
                    <div className="sap-section-title">Plan: {selectedPlan.planGroup}/{selectedPlan.groupCounter}</div>
                    <div className="sap-form-grid">
                        <div className="sap-form-row">
                            <label className="sap-label">Material:</label>
                            <input type="text" className="sap-input w-md" value={selectedPlan.material} disabled />
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
            </div>
        );
    }

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <div className="sap-status-bar" style={{ backgroundColor: '#fff3cd', padding: '5px 10px', borderRadius: '3px' }}>
                    💡 <strong>Instrucción:</strong> Selecciona un plan para modificarlo
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Planes de Inspección ({allPlans.length} registros)</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Grupo</th>
                            <th>Contador</th>
                            <th>Material</th>
                            <th>Descripción</th>
                            <th>Centro</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allPlans.map((plan, idx) => (
                            <tr key={idx} onClick={() => handleSelectPlan(plan)} className="sap-table-row-clickable">
                                <td>{plan.planGroup}</td>
                                <td>{plan.groupCounter}</td>
                                <td>{plan.material}</td>
                                <td>{plan.materialDescription}</td>
                                <td>{plan.plant}</td>
                                <td>{plan.status === '2' ? 'Liberado' : plan.status === '3' ? 'Bloqueado' : 'Creado'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenQP02;
