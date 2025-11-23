import React, { useState } from 'react';
import '../App.css';
import { QMService } from '../services/qmService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenQM03: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [showList, setShowList] = useState(true);
    const [selectedNotif, setSelectedNotif] = useState<any>(null);

    const allNotifications = QMService.getAllNotifications();

    const handleSelectNotif = (notif: any) => {
        setSelectedNotif(notif);
        setShowList(false);
    };

    if (!showList && selectedNotif) {
        return (
            <div className="sap-transaction-wrapper">
                <div className="sap-page-title">{tDescription} ({tCode})</div>

                <div className="sap-toolbar">
                    <button onClick={() => setShowList(true)} className="sap-action-button">&lt; Volver a lista</button>
                    <div style={{ flex: 1 }}></div>
                    <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                        💡 <strong>Siguiente:</strong> Modificar en <strong>QM02</strong> o crear lote en <strong>QA01</strong>
                    </div>
                </div>

                <div className="sap-panel">
                    <div className="sap-section-title">Aviso: {selectedNotif.notificationNumber}</div>
                    <div className="sap-form-grid">
                        <div className="sap-form-row">
                            <label className="sap-label">Clase de aviso:</label>
                            <input type="text" className="sap-input w-md" value={selectedNotif.notificationType} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Estado:</label>
                            <input type="text" className="sap-input w-md" value={selectedNotif.status} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Prioridad:</label>
                            <input type="text" className="sap-input w-xs" value={selectedNotif.priority} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Material:</label>
                            <input type="text" className="sap-input w-md" value={selectedNotif.material} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Descripción material:</label>
                            <input type="text" className="sap-input w-lg" value={selectedNotif.materialDescription || ''} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Centro:</label>
                            <input type="text" className="sap-input w-xs" value={selectedNotif.plant} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Código defecto:</label>
                            <input type="text" className="sap-input w-md" value={selectedNotif.defectCode} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Descripción defecto:</label>
                            <input type="text" className="sap-input w-lg" value={selectedNotif.defectDescription} disabled />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Descripción:</label>
                            <input type="text" className="sap-input w-full" value={selectedNotif.description} disabled />
                        </div>
                        {selectedNotif.longText && (
                            <div className="sap-form-row">
                                <label className="sap-label">Texto largo:</label>
                                <textarea className="sap-input w-full" rows={4} value={selectedNotif.longText} disabled />
                            </div>
                        )}
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
                    💡 <strong>Instrucción:</strong> Selecciona un aviso para visualizarlo
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Lista de Avisos de Calidad ({allNotifications.length} registros)</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Aviso</th>
                            <th>Tipo</th>
                            <th>Material</th>
                            <th>Descripción</th>
                            <th>Prioridad</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allNotifications.map((notif, idx) => (
                            <tr key={idx} onClick={() => handleSelectNotif(notif)} className="sap-table-row-clickable">
                                <td>{notif.notificationNumber}</td>
                                <td>{notif.notificationType}</td>
                                <td>{notif.material}</td>
                                <td>{notif.description}</td>
                                <td>{notif.priority}</td>
                                <td>{notif.status}</td>
                                <td>{notif.createdDate.split('T')[0]}</td>
                            </tr>
                        ))}
                        {allNotifications.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center' }}>No hay avisos. Crea uno en QM01</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenQM03;
