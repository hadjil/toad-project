import React, { useState } from 'react';
import '../App.css';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const ScreenPA30: React.FC<ScreenProps> = ({ tCode, tDescription }) => {
    const [pernr, setPernr] = useState('');
    const [infotype, setInfotype] = useState('0000');

    const [message, setMessage] = useState('');

    // Simulated HR Data
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [position, setPosition] = useState('');

    const handleSearch = () => {
        // Simulate fetching
        if (pernr) {
            const saved = localStorage.getItem(`toad_hr_${pernr}`);
            if (saved) {
                const data = JSON.parse(saved);
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setPosition(data.position);
                setMessage('Empleado encontrado.');
            } else {
                setFirstName('');
                setLastName('');
                setPosition('');
                setMessage('Empleado no existe (puede crearlo ahora).');
            }
        }
    };

    const handleSave = () => {
        if (!pernr) {
            setMessage('Ingrese un número de personal.');
            return;
        }

        const data = { firstName, lastName, position };
        localStorage.setItem(`toad_hr_${pernr}`, JSON.stringify(data));
        setMessage(`Datos guardados para el empleado ${pernr}.`);
    };

    return (
        <div className="sap-transaction-wrapper">
            <div className="sap-page-title">{tDescription} ({tCode})</div>

            <div className="sap-toolbar">
                <button onClick={handleSave} className="sap-action-button sap-action-create">
                    Guardar
                </button>
                <div style={{ flex: 1 }}></div>
                {message && <span className="sap-status-green">{message}</span>}
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Selección de Personal</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">No. Personal:</label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input
                                type="text"
                                className="sap-input w-md"
                                value={pernr}
                                onChange={(e) => setPernr(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button onClick={handleSearch} className="sap-action-button">🔍</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Selección de Infotipo</div>
                <div className="sap-form-row">
                    <input
                        type="text"
                        className="sap-input w-xs"
                        value={infotype}
                        onChange={(e) => setInfotype(e.target.value)}
                    />
                    <span style={{ marginLeft: '10px' }}>
                        {infotype === '0000' && 'Medidas'}
                        {infotype === '0001' && 'Asignación Organizativa'}
                        {infotype === '0002' && 'Datos Personales'}
                    </span>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <button className="sap-action-button" style={{ marginRight: '5px' }}>Crear</button>
                    <button className="sap-action-button" style={{ marginRight: '5px' }}>Modificar</button>
                    <button className="sap-action-button">Visualizar</button>
                </div>
            </div>

            <div className="sap-panel">
                <div className="sap-section-title">Datos Personales (Simulado)</div>
                <div className="sap-form-grid">
                    <div className="sap-form-row">
                        <label className="sap-label">Nombre:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Apellidos:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="sap-form-row">
                        <label className="sap-label">Posición:</label>
                        <input
                            type="text"
                            className="sap-input w-md"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScreenPA30;
