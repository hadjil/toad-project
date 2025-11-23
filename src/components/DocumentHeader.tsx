import React from 'react';
import '../App.css';

interface DocumentHeaderProps {
    data: {
        documentDate: string;
        postingDate: string;
        type: string;
        companyCode: string;
        currency: string;
        reference: string;
        headerText: string;
    };
    onChange: (field: string, value: string) => void;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({ data, onChange }) => {
    return (
        <div className="sap-panel">
            <div className="sap-section-title">Datos de Cabecera</div>
            <div className="sap-form-grid">
                <div className="sap-form-row">
                    <label className="sap-label">Fecha documento:</label>
                    <input
                        type="date"
                        className="sap-input w-md"
                        value={data.documentDate}
                        onChange={(e) => onChange('documentDate', e.target.value)}
                    />
                </div>
                <div className="sap-form-row">
                    <label className="sap-label">Clase documento:</label>
                    <input
                        type="text"
                        className="sap-input w-xs"
                        value={data.type}
                        onChange={(e) => onChange('type', e.target.value)}
                        maxLength={2}
                    />
                </div>
                <div className="sap-form-row">
                    <label className="sap-label">Sociedad:</label>
                    <input
                        type="text"
                        className="sap-input w-xs"
                        value={data.companyCode}
                        onChange={(e) => onChange('companyCode', e.target.value)}
                        maxLength={4}
                    />
                </div>
                <div className="sap-form-row">
                    <label className="sap-label">Fecha contabilización:</label>
                    <input
                        type="date"
                        className="sap-input w-md"
                        value={data.postingDate}
                        onChange={(e) => onChange('postingDate', e.target.value)}
                    />
                </div>
                <div className="sap-form-row">
                    <label className="sap-label">Moneda:</label>
                    <input
                        type="text"
                        className="sap-input w-xs"
                        value={data.currency}
                        onChange={(e) => onChange('currency', e.target.value)}
                        maxLength={3}
                    />
                </div>
                <div className="sap-form-row">
                    <label className="sap-label">Referencia:</label>
                    <input
                        type="text"
                        className="sap-input w-md"
                        value={data.reference}
                        onChange={(e) => onChange('reference', e.target.value)}
                    />
                </div>
                <div className="sap-form-row">
                    <label className="sap-label">Texto cabecera:</label>
                    <input
                        type="text"
                        className="sap-input w-lg"
                        value={data.headerText}
                        onChange={(e) => onChange('headerText', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default DocumentHeader;
