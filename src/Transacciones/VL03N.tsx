import React, { useState } from 'react';
import deliveriesData from '../deliveries.json';

// Define ScreenProps (asumimos que ya está en el scope o importada)
interface ScreenProps {
  tCode: string;
  tDescription: string;
}

// Interfaces para tipar los datos del JSON
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


const ScreenVL03N: React.FC<ScreenProps> = () => {
  // Inicializamos con un valor que simula un registro conocido
  const [deliveryNumber, setDeliveryNumber] = useState('80019271');
  const [currentDelivery, setCurrentDelivery] = useState<DeliveryRecord | null>(null);

  // Función para buscar y cargar la entrega
  const handleLoadDelivery = () => {
    const foundDelivery = (deliveriesData as DeliveryRecord[]).find(
      (d) => d.deliveryNumber === deliveryNumber
    );

    if (foundDelivery) {
      setCurrentDelivery(foundDelivery);
    } else {
      setCurrentDelivery(null);
      alert(`Error: Entrega ${deliveryNumber} no encontrada.`);
    }
  };

  // Cargar la entrega inicial al montar el componente
  React.useEffect(() => {
    handleLoadDelivery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="vl03n-layout">
      <div className="sap-panel" style={{ marginTop: 0, border: 'none', borderBottom: '1px solid #ccc' }}>
        <h2 className="sap-page-title">Visualizar entrega de salida</h2>

        {/* 🚨 BARRA DE ICONOS SIMPLIFICADA */}
        <div className="sap-toolbar">
          {/* Ícono de "Atrás" o "Salir" (Esencial) */}
          <button className="sap-icon-button" title="Atrás (F3)">⬅️</button>
          {/* Ícono de "Visualizar documento anterior" */}
          <button className="sap-icon-button" title="Doc. anterior">↩️</button>
          {/* Ícono de "Visualizar documento posterior" */}
          <button className="sap-icon-button" title="Doc. posterior">↪️</button>
          <span style={{ borderLeft: '1px solid #ccc', margin: '0 8px', height: '16px' }}></span>
          {/* Ícono de "Imprimir" (Común en visualizaciones) */}
          <button className="sap-icon-button" title="Imprimir">🖨️</button>
          {/* Ícono de "Ayuda F1" */}
          <button className="sap-icon-button" title="Ayuda F1">❓</button>

          {/* Mantenemos el texto Contabilizar SM como referencia */}
          <span className="sap-command-text">Contabilizar SM</span>
        </div>
      </div>

      {/* Campos de Entrada */}
      <div className="sap-screen-content">
        <div className="sap-flex-row" style={{ marginBottom: '2rem' }}>
          <label className="sap-label">Entrega de salida</label>
          <input
            type="text"
            value={deliveryNumber}
            onChange={(e) => setDeliveryNumber(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLoadDelivery(); }}
            className="sap-input w-md"
            style={{ backgroundColor: '#fffec8', borderColor: '#d09b00' }}
          />
          <button
            onClick={handleLoadDelivery}
            className="sap-icon-button"
            style={{ border: '1px solid #ccc', backgroundColor: '#e5e5e5', padding: '2px 6px' }}
            title="Cargar / Buscar"
          >
            🔍
          </button>
        </div>

        {/* ZONA DE DATOS DINÁMICOS */}
        {currentDelivery ? (
          <div>
            <h3 className="sap-section-title">Datos de Cabecera</h3>
            <div className="sap-form-grid" style={{ backgroundColor: '#fff' }}>
              <p><strong>Cliente:</strong> {currentDelivery.header.customer}</p>
              <p><strong>Pto. Expedición:</strong> {currentDelivery.header.shippingPoint}</p>
              <p><strong>Fecha Envío:</strong> {currentDelivery.header.shipmentDate}</p>
              <p><strong>Incoterms:</strong> {currentDelivery.header.incoterms}</p>
              <p><strong>Status:</strong> <span className={currentDelivery.header.status.includes('Completado') ? 'sap-status-green' : 'sap-status-yellow'} style={{ fontWeight: 'bold' }}>{currentDelivery.header.status}</span></p>
            </div>

            <h3 className="sap-section-title" style={{ marginTop: '2rem' }}>Posiciones de la Entrega</h3>
            <div className="sap-data-container" style={{ border: '1px solid #ccc', overflow: 'auto' }}>
              <table className="sap-table">
                <thead>
                  <tr>
                    <th className="w-xs">Pos.</th>
                    <th className="w-md">Material</th>
                    <th className="w-xl">Descripción</th>
                    <th className="w-sm" style={{ textAlign: 'right' }}>Cantidad</th>
                    <th className="w-xs">Unidad</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDelivery.items.map((item) => (
                    <tr key={item.position}>
                      <td>{item.position}</td>
                      <td>{item.material}</td>
                      <td>{item.description}</td>
                      <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                      <td>{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="sap-panel" style={{ textAlign: 'center', color: '#666' }}>
            Ingrese y cargue un número de entrega.
          </div>
        )}
      </div>
    </div>
  );
};

ScreenVL03N.displayName = 'Visualizar entrega de salida';
export default ScreenVL03N;