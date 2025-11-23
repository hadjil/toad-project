import React, { useState } from 'react';
import '../App.css';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenSE38: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [program, setProgram] = useState('Z_HELLO_WORLD');
    const [code, setCode] = useState('REPORT Z_HELLO_WORLD.\n\nWRITE: \'Hello, Toad SAP!\'.');
    const [mode, setMode] = useState<'initial' | 'editor'>('initial');
    const [message, setMessage] = useState('');

    const handleEdit = () => {
        const savedCode = localStorage.getItem(`toad_abap_${program}`);
        if (savedCode) {
            setCode(savedCode);
            setMessage('Programa cargado.');
        } else {
            setCode(`REPORT ${program}.\n\n* New Program\n`);
            setMessage('Nuevo programa.');
        }
        setMode('editor');
    };

    const handleSave = () => {
        localStorage.setItem(`toad_abap_${program}`, code);
        setMessage(`Programa ${program} guardado.`);
    };

    const handleActivate = () => {
        handleSave();
        setMessage(`Programa ${program} activado (simulado).`);
    };

    if (mode === 'editor') {
        return (
            <div className="sap-transaction-wrapper" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="sap-toolbar">
                    <button onClick={() => setMode('initial')} className="sap-action-button">&lt; Atrás</button>
                    <button onClick={handleSave} className="sap-action-button">💾 Guardar</button>
                    <button onClick={handleActivate} className="sap-action-button">⚡ Activar</button>
                    <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>{program}</span>
                    <div style={{ flex: 1 }}></div>
                    {message && <span className="sap-status-green">{message}</span>}
                </div>
                <div style={{ flex: 1, padding: '10px' }}>
                    <textarea
                        style={{
                            width: '100%',
                            height: '100%',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            border: '1px solid #ccc',
                            padding: '10px'
                        }}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-panel">
                <div className="sap-form-row">
                    <label className="sap-label">Programa:</label>
                    <input
                        type="text"
                        className="sap-input w-lg"
                        value={program}
                        onChange={(e) => setProgram(e.target.value.toUpperCase())}
                    />
                </div>

                <div className="sap-section-title" style={{ marginTop: '20px' }}>Subobjetos</div>
                <div className="sap-form-row">
                    <input type="radio" name="subobj" defaultChecked /> <label>Código fuente</label>
                </div>
                <div className="sap-form-row">
                    <input type="radio" name="subobj" /> <label>Variantes</label>
                </div>
                <div className="sap-form-row">
                    <input type="radio" name="subobj" /> <label>Atributos</label>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <button onClick={handleEdit} className="sap-action-button" style={{ marginRight: '10px' }}>
                        Visualizar
                    </button>
                    <button onClick={handleEdit} className="sap-action-button" style={{ marginRight: '10px' }}>
                        Modificar
                    </button>
                    <button onClick={handleEdit} className="sap-action-button">
                        Crear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScreenSE38;
