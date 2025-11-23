import React, { useState } from 'react';
import '../App.css';
import { QMService } from '../services/qmService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenQC01: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [certificateType, setCertificateType] = useState('01');
    const [material, setMaterial] = useState('');
    const [batch, setBatch] = useState('');
    const [customer, setCustomer] = useState('');
    const [inspectionLot, setInspectionLot] = useState('');
    const [validUntil, setValidUntil] = useState('');
    const [message, setMessage] = useState('');

    // Get completed inspection lots
    const completedLots = QMService.getAllInspectionLots().filter(l => l.status === 'RES' && l.usageDecision === 'A');

    const handleCreate = () => {
        if (!material || !inspectionLot) {
            setMessage('Complete Material y Lote de inspección');
            return;
        }

        const lot = QMService.getInspectionLot(inspectionLot);
        if (!lot) {
            setMessage('Lote de inspección no encontrado');
            return;
        }

        const cert = QMService.saveCertificate({
            certificateType,
            material,
            batch,
            customer,
            inspectionLot,
            issueDate: new Date().toISOString().split('T')[0],
            validUntil,
            status: 'CRTD',
            certificateData: {
                results: lot.results,
                usageDecision: lot.usageDecision,
            },
        });

        setMessage(`Certificado ${cert.certificateNumber} creado`);
        setTimeout(() => {
            setMaterial('');
            setBatch('');
            setCustomer('');
            setInspectionLot('');
            setValidUntil('');
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
                    💡 <strong>Siguiente:</strong> Visualizar en <strong>QC03</strong> o imprimir
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Datos de cabecera</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Tipo de certificado:</label>
                        <select
                            className="sap-input w-md"
                            value={certificateType}
                            onChange={(e) => setCertificateType(e.target.value)}
                        >
                            <option value="01">01 - Certificado de material</option>
                            <option value="02">02 - Certificado de prueba</option>
                            <option value="03">03 - Certificado de conformidad</option>
                        </select>
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Válido hasta:</label>
                        <input
                            type="date"
                            className="sap-input w-md"
                            value={validUntil}
                            onChange={(e) => setValidUntil(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Datos de objeto</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Material:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Lote:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Cliente:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Lote de inspección:</label>
                        <select
                            className="sap-input w-md"
                            value={inspectionLot}
                            onChange={(e) => setInspectionLot(e.target.value)}
                        >
                            <option value="">Seleccione...</option>
                            {completedLots.map(lot => (
                                <option key={lot.inspectionLot} value={lot.inspectionLot}>
                                    {lot.inspectionLot} - {lot.material}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScreenQC01;
