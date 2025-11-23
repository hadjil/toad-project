import React, { useState, useEffect } from 'react';
import '../App.css';
import { MasterDataService } from '../services/masterDataService';
import { DocumentService } from '../services/documentService';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const GenericSAPScreen: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [dataType, setDataType] = useState<string>('');

    useEffect(() => {
        loadData();
    }, [tCode]);

    const loadData = () => {
        let fetchedData: any[] = [];
        let type = '';

        const code = tCode.toUpperCase();

        if (code.startsWith('MM') || code === 'MMBE' || code === 'MM60') {
            fetchedData = MasterDataService.getAllMaterials();
            type = 'Materiales';
        } else if (code.startsWith('XK') || code.startsWith('MK') || code.startsWith('FK')) {
            fetchedData = MasterDataService.getVendors();
            type = 'Proveedores';
        } else if (code.startsWith('XD') || code.startsWith('VD') || code.startsWith('FD')) {
            fetchedData = MasterDataService.getCustomers();
            type = 'Clientes';
        } else if (code.startsWith('ME')) {
            fetchedData = DocumentService.getAllPOs();
            type = 'Documentos de Compras (Pedidos)';
        } else if (code.startsWith('VA') || code.startsWith('VF') || code.startsWith('VL')) {
            fetchedData = DocumentService.getAllSalesDocuments();
            type = 'Documentos de Ventas';
        } else if (code.startsWith('FB') || code.startsWith('F-') || code.startsWith('FS')) {
            fetchedData = DocumentService.getAllFIDocuments();
            type = 'Documentos Financieros';
        } else {
            // Default empty for unknown modules
            fetchedData = [];
            type = 'Simulación';
        }

        setData(fetchedData);
        setDataType(type);

        if (fetchedData.length > 0) {
            // Generate columns dynamically from the first item, filtering out complex objects
            const firstItem = fetchedData[0];
            const cols = Object.keys(firstItem).filter(key =>
                typeof firstItem[key] !== 'object' && !Array.isArray(firstItem[key])
            );
            // Limit to first 5-6 columns to avoid overcrowding
            setColumns(cols.slice(0, 6));
        }
    };

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <button className="sap-action-button" title="Continuar">✔</button>
                <button className="sap-action-button" title="Guardar">💾</button>
                <button className="sap-action-button" title="Atrás">&lt;</button>
                <button className="sap-action-button" title="Finalizar">X</button>
                <button className="sap-action-button" title="Cancelar">Ban</button>
                <div className="sap-toolbar-separator"></div>
                <button className="sap-action-button" onClick={loadData} title="Refrescar Datos">🔄 Refrescar Lista</button>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">
                    {dataType === 'Simulación' ? 'Datos Generales' : `Lista de ${dataType}`}
                </div>

                {data.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="sap-table">
                            <thead>
                                <tr>
                                    {columns.map(col => (
                                        <th key={col}>{col.charAt(0).toUpperCase() + col.slice(1)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, idx) => (
                                    <tr key={idx}>
                                        {columns.map(col => (
                                            <td key={col}>{row[col]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ padding: '10px', fontSize: '0.9em', color: '#666' }}>
                            {data.length} registros encontrados.
                        </div>
                    </div>
                ) : (
                    <div className="sap-form-grid">
                        <div className="sap-form-row">
                            <label className="sap-label">Campo 1:</label>
                            <input type="text" className="sap-input w-md" disabled placeholder="Simulación" />
                        </div>
                        <div className="sap-form-row">
                            <label className="sap-label">Campo 2:</label>
                            <input type="text" className="sap-input w-md" disabled placeholder="Simulación" />
                        </div>
                        <div className="sap-status-bar" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}>
                            <span style={{ color: '#555' }}>
                                ℹ No se encontraron datos para mostrar en esta vista ({tCode}).
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenericSAPScreen;
