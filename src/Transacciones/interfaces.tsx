// Estas interfaces pueden vivir en un archivo de utilidades o al inicio de ScreenF2Header/ScreenF2Summary

export interface DeliveryItem {
    position: string;
    material: string;
    description: string;
    quantity: string;
    unit: string;
}

export interface DeliveryRecord {
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