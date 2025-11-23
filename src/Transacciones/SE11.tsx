import React from 'react';

interface ScreenProps {
    tCode: string;
    tDescription: string;
}

const SE11: React.FC<ScreenProps> = () => {
    return (
        <div className="se11-layout">
            <h2 className="sap-page-title">Diccionario ABAP</h2>

            {/* Opciones de Objeto (Radio Buttons) */}
            <div className="sap-panel">
                <div className="sap-flex-row mb-2">
                    <input type="radio" id="tabla" name="se11-object" defaultChecked className="mr-2" />
                    <label htmlFor="tabla">Tabla base datos</label>
                    <input type="text" className="sap-input w-md ml-4" placeholder="Z_TABLA" />
                    {/* Asumiendo que el icono de ayuda F4 es un botón estilizado */}
                    <button className="sap-action-button ml-2" title="Ayuda F4">...</button>
                </div>

                <div className="sap-flex-row mb-6">
                    <input type="radio" id="vista" name="se11-object" className="mr-2" />
                    <label htmlFor="vista">Vista</label>
                    <input type="text" className="sap-input w-md ml-4" />
                </div>

                <div className="border-t pt-4 mt-4">
                    <div className="sap-flex-row mb-2">
                        <input type="radio" id="tipodatos" name="se11-object-2" className="mr-2" />
                        <label htmlFor="tipodatos">Tipo de datos</label>
                    </div>
                    <div className="sap-flex-row mb-2">
                        <input type="radio" id="grupotipos" name="se11-object-2" className="mr-2" />
                        <label htmlFor="grupotipos">Grupo tipos</label>
                    </div>

                    <div className="sap-flex-row mb-2 mt-4">
                        <input type="radio" id="dominio" name="se11-object-2" className="mr-2" />
                        <label htmlFor="dominio">Dominio</label>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="sap-flex-row mt-8 border-t pt-4">
                    <button className="sap-action-button">Visualizar</button>
                    <button className="sap-action-button">Modificar</button>
                    <button className="sap-action-button sap-action-create">Crear</button>
                </div>
            </div>

        </div>
    );
};

SE11.displayName = 'Diccionario ABAP: Inicial';
export default SE11;