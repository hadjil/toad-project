import React, { useState } from 'react';
import ScreenF2Header from './ScreenF2Header';
import deliveriesData from '../deliveries.json'; 

// 🚨 Interfaces definidas para tipado estricto
interface DeliveryItem {
    position: string;
    material: string;
    description: string;
    quantity: string;
    unit: string;
}

interface DeliveryRecord {
    tCode: string;
    deliveryNumber: string;
    header: {
        customer: string;
        shippingPoint: string;
        shipmentDate: string;
        status: string;
        incoterms: string;
    };
    items: DeliveryItem[]; 
}


interface F2SummaryProps {
  documento: string; // Documento base (e.g., entrega 80019271)
}

const ScreenF2Summary: React.FC<F2SummaryProps> = ({ documento }) => {
    const [currentSubView, setCurrentSubView] = useState<'summary' | 'header'>('summary');

    // Buscamos y tipamos el resultado como DeliveryRecord
    const deliveryData = (deliveriesData as DeliveryRecord[]).find(
      (d) => d.deliveryNumber === documento
    );

    if (!deliveryData) {
        return (
            <div className="p-8 text-center text-red-600">
                No se encontraron datos de resumen para el documento {documento}.
            </div>
        );
    }
    
    // ... Lógica de datos (sin cambios) ...
    const data = {
        factura: 'F2',
        numFactura: '$000000001', 
        valorNeto: '768,00',
        moneda: 'EUR',
        responsablePago: 'T-L64A04',
        fechaFactura: '05.08.2023',
        cliente: 'Omega Soft-Hardwar / Gustav-Jung-S 425',
        items: deliveryData.items.map(item => ({
            pos: item.position, 
            denominacion: item.description, 
            ctdFacturada: item.quantity, 
            um: item.unit, 
            valorNeto: '768,00', 
            material: item.material, 
            impteImpuesto: '116,20', 
            fecha: '05.08.2023'
        }))
    };
    
    // Manejo de la sub-vista de Cabecera
    if (currentSubView === 'header') {
        return (
            <ScreenF2Header 
                facturaNumber={data.numFactura} 
                deliveryData={deliveryData}
                onClose={() => setCurrentSubView('summary')}
            />
        );
    }

    // ... Renderizado de la vista de Resumen (sin cambios) ...
    return (
        <div className="p-4">
            {/* ... JSX ... */}
        </div>
    );
};

export default ScreenF2Summary;