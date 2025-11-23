import React, { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid';
import '../App.css';

interface SearchHelpProps {
    title: string;
    data: any[];
    columns: { key: string; label: string }[];
    onSelect: (item: any) => void;
    onClose: () => void;
}

const SearchHelp: React.FC<SearchHelpProps> = ({ title, data, columns, onSelect, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="sap-search-help-overlay">
            <div className="sap-search-help-modal">
                <div className="sap-search-help-header">
                    <span>{title}</span>
                    <button onClick={onClose} className="sap-icon-button">
                        <XMarkIcon className="sap-icon" />
                    </button>
                </div>

                <div className="sap-search-help-search">
                    <MagnifyingGlassIcon className="sap-icon" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="sap-input w-full"
                        autoFocus
                    />
                </div>

                <div className="sap-search-help-content">
                    <table className="sap-table">
                        <thead>
                            <tr>
                                {columns.map(col => (
                                    <th key={col.key}>{col.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, idx) => (
                                <tr key={idx} onClick={() => onSelect(item)} className="sap-table-row-clickable">
                                    {columns.map(col => (
                                        <td key={col.key}>{item[col.key]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SearchHelp;
