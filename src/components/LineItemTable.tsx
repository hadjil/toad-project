import React from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import '../App.css';

interface LineItemTableProps {
    items: any[];
    columns: { key: string; label: string; width?: string; type?: string }[];
    onAddItem: () => void;
    onRemoveItem: (index: number) => void;
    onUpdateItem: (index: number, field: string, value: any) => void;
}

const LineItemTable: React.FC<LineItemTableProps> = ({ items, columns, onAddItem, onRemoveItem, onUpdateItem }) => {
    return (
        <div className="sap-panel">
            <div className="sap-toolbar">
                <span className="sap-section-title" style={{ marginBottom: 0, border: 'none' }}>Posiciones</span>
                <div style={{ flex: 1 }}></div>
                <button onClick={onAddItem} className="sap-icon-button" title="Añadir posición">
                    <PlusIcon className="sap-icon" />
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="sap-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}>#</th>
                            {columns.map(col => (
                                <th key={col.key} style={{ width: col.width }}>{col.label}</th>
                            ))}
                            <th style={{ width: '40px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                {columns.map(col => (
                                    <td key={col.key}>
                                        <input
                                            type={col.type || "text"}
                                            className="sap-input w-full"
                                            value={item[col.key] || ''}
                                            onChange={(e) => onUpdateItem(index, col.key, e.target.value)}
                                        />
                                    </td>
                                ))}
                                <td>
                                    <button onClick={() => onRemoveItem(index)} className="sap-icon-button">
                                        <TrashIcon className="sap-icon" style={{ width: '14px', height: '14px' }} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + 2} style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                                    No hay posiciones. Pulse + para añadir.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LineItemTable;
