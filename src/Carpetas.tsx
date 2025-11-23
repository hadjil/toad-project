import {
    FolderIcon,
    DocumentTextIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon // Importamos el ícono de búsqueda
} from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import modulosData from './modulos.json';
import TransactionScreen from './TransactionScreen';
import './App.css'; // 🚨 CRITICAL: Import SAP styles

// Interfaz para la data de carpetas
interface FolderData {
    name: string;
    folders?: FolderData[];
    codigoTransaccion?: string;
}

interface ActiveTransaction {
    tCode: string;
    tDescription: string;
}

// 🚨 Función Auxiliar para la Búsqueda
// Esta función mapea todos los nodos de transacción del JSON a un objeto T-Code: Descripción
const mapTransactions = (folders: FolderData[], map: Map<string, string> = new Map()): Map<string, string> => {
    for (const folder of folders) {
        if (folder.codigoTransaccion) {
            // Convertimos a mayúsculas para que la búsqueda sea insensible a mayúsculas/minúsculas
            map.set(folder.codigoTransaccion.toUpperCase(), folder.name);
        }
        if (folder.folders) {
            mapTransactions(folder.folders, map);
        }
    }
    return map;
};

export default function Carpetas() {
    const folders: FolderData[] = modulosData;
    const [activeTransaction, setActiveTransaction] = useState<ActiveTransaction | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // 🚨 Generamos el mapa de T-Codes una sola vez (o con useMemo si el árbol fuera grande)
    const transactionMap = React.useMemo(() => mapTransactions(folders), [folders]);

    const openTransaction = (tCode: string, tDescription: string) => {
        setActiveTransaction({ tCode, tDescription });
    };

    const closeTransaction = () => {
        setActiveTransaction(null);
    };

    // 🚨 Lógica para la búsqueda al presionar ENTER
    const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const code = searchTerm.trim().toUpperCase();

            // 1. Verificar si el T-Code existe en nuestro mapa
            if (transactionMap.has(code)) {
                const description = transactionMap.get(code)!;
                // 2. Abrir la transacción
                openTransaction(code, description);
                setSearchTerm(''); // Limpiar la barra después de la búsqueda
            } else {
                // 3. Manejo de error o notificación
                alert(`Transacción ${code} no encontrada en el menú SAP.`);
            }
        }
    };

    // --- RENDERIZADO DE LA PANTALLA DE TRANSACCIÓN ACTIVA ---
    if (activeTransaction) {
        return (
            <TransactionScreen
                tCode={activeTransaction.tCode}
                tDescription={activeTransaction.tDescription}
                onClose={closeTransaction}
            />
        );
    }

    // --- RENDERIZADO DEL ÁRBOL SAP EASY ACCESS ---
    return (
        <div className="sap-tree-container">

            {/* 🚨 NUEVA BARRA DE BÚSQUEDA Y ENCABEZADO */}
            <div className="sap-main-header">
                <span className="sap-tree-title">🍄 TOAD Easy Access</span>

                <div className="sap-search-bar">
                    <MagnifyingGlassIcon className="sap-search-icon" />
                    <input
                        type="text"
                        placeholder="Código de Transacción (ej: FB01)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearchKeyDown} // Capturamos la tecla Enter
                        className="sap-search-input"
                    />
                </div>
            </div>

            {/* Contenido del Árbol */}
            <div className="sap-tree-content">
                <ul className="sap-tree-list">
                    {folders.map((folder) => (
                        <Folder
                            folder={folder}
                            key={folder.name}
                            level={0}
                            openTransaction={openTransaction}
                        />
                    ))}
                </ul>
            </div>

            {/* Pie de página */}
            <div className="sap-tree-footer">
                PRD (100)
            </div>
        </div>
    );
}

// 🚨 ACTUALIZAR PROPS DE FOLDER
interface FolderProps {
    folder: FolderData;
    level: number;
    openTransaction: (tCode: string, tDescription: string) => void;
}

function Folder({ folder, level, openTransaction }: FolderProps) {
    const hasChildren = folder.folders && folder.folders.length > 0;
    const isTransaction = !hasChildren && folder.codigoTransaccion;

    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        if (hasChildren) {
            setIsOpen(!isOpen);
        } else if (isTransaction && folder.codigoTransaccion) {
            openTransaction(folder.codigoTransaccion, folder.name);
        }
    };

    const getDisplayName = () => {
        if (isTransaction && folder.codigoTransaccion) {
            return `${folder.name} (${folder.codigoTransaccion})`;
        }
        return folder.name;
    };

    const indentSize = level * 16 + 10;

    return (
        <li className="sap-tree-list">
            <div
                onClick={handleClick}
                className={`sap-tree-row ${isOpen ? 'is-active' : ''}`}
                style={{ paddingLeft: `${indentSize}px` }}
            >
                {/* Flecha (Chevron) */}
                <span className="sap-chevron">
                    {hasChildren && (
                        isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />
                    )}
                </span>

                {/* Icono de Carpeta o Archivo */}
                {hasChildren ? (
                    <FolderIcon className={`sap-icon ${isOpen ? 'icon-folder-open' : 'icon-folder-closed'}`} />
                ) : (
                    <DocumentTextIcon className="sap-icon icon-file" />
                )}

                {/* Texto: Usa la nueva función de formato */}
                <span className={`sap-tree-text ${isOpen ? 'is-bold' : ''}`}>
                    {getDisplayName()}
                </span>
            </div>

            {/* Recursividad para subcarpetas */}
            {hasChildren && isOpen && (
                <ul className="sap-tree-list">
                    {folder.folders?.map((child) => (
                        <Folder
                            folder={child}
                            key={child.name}
                            level={level + 1}
                            openTransaction={openTransaction}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}