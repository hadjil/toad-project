import React from 'react';
import '../App.css';
import { QMService } from '../services/qmService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenQMEL: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const allNotifications = QMService.getAllNotifications();

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <div className="sap-status-bar" style={{ backgroundColor: '#e3f2fd', padding: '5px 10px', borderRadius: '3px' }}>
                    💡 <strong>Tip:</strong> Haz doble clic en un aviso para ver detalles
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
                            <th>Descripción material</th>
                            <th>Centro</th>
                            <th>Descripción</th>
                            <th>Prioridad</th>
                            <th>Estado</th>
                            <th>Creado por</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allNotifications.map((notif, idx) => (
                            <tr key={idx}>
                                <td>{notif.notificationNumber}</td>
                                <td>{notif.notificationType}</td>
                                <td>{notif.material}</td>
                                <td>{notif.materialDescription || '-'}</td>
                                <td>{notif.plant}</td>
                                <td>{notif.description}</td>
                                <td>{notif.priority}</td>
                                <td>{notif.status}</td>
                                <td>{notif.createdBy}</td>
                                <td>{notif.createdDate.split('T')[0]}</td>
                            </tr>
                        ))}
                        {allNotifications.length === 0 && (
                            <tr>
                                <td colSpan={10} style={{ textAlign: 'center' }}>No hay avisos. Crea uno en QM01</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScreenQMEL;
