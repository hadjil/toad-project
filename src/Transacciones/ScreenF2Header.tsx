import React from 'react';
import type { DeliveryRecord } from './interfaces'; // Asume que las interfaces están aquí o en un archivo similar
 // Asume que las interfaces están aquí o en un archivo similar

interface F2HeaderProps {
    facturaNumber: string;
    // 🚨 Usamos la interfaz tipada en lugar de 'any'
    deliveryData: DeliveryRecord; 
    onClose: () => void;
}

const ScreenF2Header: React.FC<F2HeaderProps> = ({ facturaNumber, deliveryData, onClose }) => {
    
    // Simulación de datos fijos para la Cabecera de Factura
    const headerData = {
        // Usamos la prop deliveryData, que ahora tiene tipado seguro
        respPago: deliveryData.header.customer.split('/')[0].trim(), 
        creadoPor: 'JTERMIM',
        fechaCreacion: '07.08.2023',
        horaCreacion: '03:28:50',
        sociedad: '1000',
        fechaFactura: deliveryData.header.shipmentDate,
        moneda: 'EUR',
    };

    return (
        <div className="p-4">
            <h2 className="sap-screen-heading">Factura F2 Crear: Datos cabecera</h2>
            
            {/* Barra de Pestañas (simulación) */}
            <div className="flex border-b border-gray-400 mb-4 text-sm">
                <button className="py-2 px-4 border-t border-r border-l border-gray-400 bg-white -mb-px font-semibold">Det.cab.</button>
                <button className="py-2 px-4 text-gray-600 hover:bg-gray-100">InterCabec</button>
            </div>

            <div className="sap-block-section p-4 bg-gray-50 border rounded mb-6">
                <p><strong>F2 Factura (F2):</strong> {facturaNumber}</p>
                <p><strong>Responsable de pago:</strong> {headerData.respPago}</p>
                <p><strong>Creado por:</strong> {headerData.creadoPor} - **Creado el:** {headerData.fechaCreacion} **Hora:** {headerData.horaCreacion}</p>
            </div>

            {/* Datos de contabilidad */}
            <h3 className="sap-block-title mb-2">Datos de contabilidad</h3>
            <div className="grid grid-cols-3 gap-4 p-4 border rounded bg-white">
                <label>Fecha factura: <input type="text" className="sap-input w-24" defaultValue={headerData.fechaFactura} /></label>
                <label>Sociedad: <input type="text" className="sap-input w-24" defaultValue={headerData.sociedad} /></label>
                <label>Moneda del documento: <input type="text" className="sap-input w-24" defaultValue={headerData.moneda} readOnly /></label>
                
                <label>Referencia: <input type="text" className="sap-input w-24" /></label>
                <label>Cambio p.contab.: <input type="text" className="sap-input w-24" defaultValue="1,00000" readOnly /></label>
            </div>

            {/* Botón de cierre para volver al resumen */}
             <div className="flex justify-center mt-6">
                <button onClick={onClose} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
                    ⬅️ Volver al Resumen (F2)
                </button>
            </div>
        </div>
    );
};

export default ScreenF2Header;