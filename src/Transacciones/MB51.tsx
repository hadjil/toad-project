import React, { useState, useEffect } from 'react';
import '../App.css';
import SearchHelp from '../components/SearchHelp';
import { DocumentService } from '../services/documentService';
import { MasterDataService } from '../services/masterDataService';

// Define la interfaz para los datos de Materiales para mejor tipado
interface MaterialData {
    material: string;
    description: string;
    // Añade otras propiedades si las tiene MasterDataService.getAllMaterials()
}

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenMB51: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [filters, setFilters] = useState({
        material: '',
        plant: '',
        dateFrom: '',
        dateTo: ''
    });
    const [documents, setDocuments] = useState<any[]>([]);
    const [showMaterialSearch, setShowMaterialSearch] = useState(false);
    // 1. Optimización: Usa useState para almacenar los materiales y useEffect para cargarlos una sola vez.
    const [materials, setMaterials] = useState<MaterialData[]>([]);

    // Carga los materiales una sola vez al montar el componente
    useEffect(() => {
        // Asumiendo que getAllMaterials() devuelve MaterialData[]
        const loadedMaterials = MasterDataService.getAllMaterials() as MaterialData[];
        setMaterials(loadedMaterials);
    }, []); // Array de dependencias vacío, se ejecuta solo en el montaje

    const handleSearch = () => {
        // Lógica de búsqueda (ya es correcta asumiendo que DocumentService está bien tipado)
        const docs = DocumentService.getMaterialDocuments(filters);
        setDocuments(docs);
    };

    // Función para manejar la selección de un material desde el SearchHelp
    const handleMaterialSelect = (selectedMaterial: any) => {
        // 2. Corrección: Asegura que la propiedad 'material' del objeto seleccionado se usa para actualizar los filtros.
        if (selectedMaterial && selectedMaterial.material) {
            setFilters(prevFilters => ({
                ...prevFilters,
                material: selectedMaterial.material
            }));
        }
        setShowMaterialSearch(false);
    };

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>
            <div className="sap-toolbar">
                <button onClick={handleSearch} className="sap-action-button sap-action-search">Buscar</button>
            </div>
            {/* Filters */}
            <div className="sap-panel">
                <div className="sap-section-title">Filtros</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Material:</label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input type="text" className="sap-input w-md" value={filters.material}
                                onChange={e => setFilters({ ...filters, material: e.target.value })} />
                            <button onClick={() => setShowMaterialSearch(true)} className="sap-action-button">🔍</button>
                        </div>
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Planta:</label>
                        <input type="text" className="sap-input w-xs" value={filters.plant}
                            onChange={e => setFilters({ ...filters, plant: e.target.value })} />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Fecha Desde:</label>
                        <input type="date" className="sap-input w-md" value={filters.dateFrom}
                            onChange={e => setFilters({ ...filters, dateFrom: e.target.value })} />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Fecha Hasta:</label>
                        <input type="date" className="sap-input w-md" value={filters.dateTo}
                            onChange={e => setFilters({ ...filters, dateTo: e.target.value })} />
                    </div>
                </div>
            </div>
            {/* Results */}
            <div className="sap-panel">
                <div className="sap-section-title">Documentos de Material</div>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th>Doc. Número</th>
                            <th>Material</th>
                            <th>Tipo</th>
                            <th>Cantidad</th>
                            <th>Unidad</th>
                            <th>Planta</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((doc, idx) => (
                            <tr key={idx}>
                                <td>{doc.documentNumber}</td>
                                <td>{doc.material}</td>
                                <td>{doc.type}</td>
                                <td>{doc.quantity}</td>
                                <td>{doc.unit}</td>
                                <td>{doc.plant}</td>
                                <td>{doc.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showMaterialSearch && (
                <SearchHelp
                    title="Materiales"
                    // Usa el estado 'materials' cargado con useEffect
                    data={materials}
                    columns={[{ key: 'material', label: 'Material' }, { key: 'description', label: 'Descripción' }]}
                    // Usa la función handleMaterialSelect para actualizar el filtro de manera segura
                    onSelect={handleMaterialSelect}
                    onClose={() => setShowMaterialSearch(false)}
                />
            )}
        </div>
    );
};

export default ScreenMB51;