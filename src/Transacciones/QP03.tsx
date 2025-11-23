import React, { useState } from 'react';
import '../App.css';
import inspectionPlansData from '../data/inspection_plans.json';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenQP03: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [showList, setShowList] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);

    const allPlans = inspectionPlansData as any[];

    const handleSelectPlan = (plan: any) => {
        setSelectedPlan(plan);
        setShowList(false);
    };

    if (!showList && selectedPlan) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-page-title">{tDescription} ({tCode})</div>

                <div className="sap-toolbar">
                    <button onClick={() => setShowList(true)} className="sap-action-button">&lt; Volver a lista</button>
                    <div style={{ flex: 1 }}></div>
                    <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                        💡 <strong>Siguiente:</strong> Crear lote con este plan en <strong>QA01</strong>
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
                            <label className="sap-label">Descripción:</label>
                            <input type="text" className="sap-input w-lg" value={selectedPlan.materialDescription} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Centro:</label>
                            <input type="text" className="sap-input w-xs" value={selectedPlan.plant} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Estado:</label>
                            <input type="text" className="sap-input w-md" value={selectedPlan.status === '2' ? 'Liberado' : 'Creado'} disabled />
                        </div>
                    </div>
                </div>

                {selectedPlan.operations.map((op: any, opIdx: number) => (
                    <div key={opIdx} className="sap-panel">
                        <div className="sap-section-title">Operación {op.operation}: {op.description}</div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Puesto de trabajo:</strong> {op.workCenter}
                        </div>
                        <table className="sap-table">
                            <thead>
                                <tr>
                                    <th>Característica</th>
                                    <th>Descripción</th>
                                    <th>Método</th>
                                    <th>Valor objetivo</th>
                                    <th>Tolerancia inf.</th>
                                    <th>Tolerancia sup.</th>
                                    <th>UM</th>
                                </tr>
                            </thead>
                            <tbody>
                                {op.characteristics.map((char: any, charIdx: number) => (
                                    <tr key={charIdx}>
                                        <td>{char.characteristic}</td>
                                        <td>{char.description}</td>
                                        <td>{char.inspectionMethod}</td>
                                        <td style={{ textAlign: 'right' }}>{char.targetValue}</td>
                                        <td style={{ textAlign: 'right' }}>{char.lowerTolerance}</td>
                                        <td style={{ textAlign: 'right' }}>{char.upperTolerance}</td>
                                        <td>{char.unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <div className="sap-status-bar" style={{ backgroundColor: '#fff3cd', padding: '5px 10px', borderRadius: '3px' }}>
                    💡 <strong>Instrucción:</strong> Selecciona un plan para visualizarlo
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Lista de Planes de Inspección ({allPlans.length} registros)</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Grupo plan</th>
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
                                <td>{plan.status === '2' ? 'Liberado' : 'Creado'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenQP03;
