// QM Service - Quality Management Data Layer

export interface QualityNotification {
    notificationNumber: string;
    notificationType: string; // Q1=Quality, Q2=Complaint, Q3=Audit
    material: string;
    materialDescription?: string;
    vendor?: string;
    customer?: string;
    plant: string;
    defectCode: string;
    defectDescription: string;
    priority: string; // 1=Very High, 2=High, 3=Medium, 4=Low
    status: string; // OSNO=Outstanding, NOTI=Notified, COMP=Completed
    createdBy: string;
    createdDate: string;
    description: string;
    longText?: string;
}

export interface InspectionLot {
    inspectionLot: string;
    material: string;
    materialDescription?: string;
    batch?: string;
    plant: string;
    inspectionType: string; // 01=Goods Receipt, 02=In-Process, 03=Final
    quantity: number;
    unit: string;
    status: string; // REL=Released, SPRQ=Sample Drawn, RES=Results Recorded, CALC=Usage Decision Made
    usageDecision?: string; // A=Accepted, R=Rejected, S=Sample
    createdDate: string;
    inspectionPlan?: string;
    results: InspectionResult[];
}

export interface InspectionResult {
    characteristic: string;
    characteristicDescription: string;
    targetValue: number;
    lowerLimit: number;
    upperLimit: number;
    actualValue?: number;
    result?: string; // OK, NOT_OK
    inspector?: string;
    inspectionDate?: string;
}

export interface InspectionPlan {
    planGroup: string;
    groupCounter: string;
    material: string;
    materialDescription?: string;
    plant: string;
    usage: string; // 1=Production, 2=Inspection
    status: string; // 1=Created, 2=Released, 3=Locked
    operations: InspectionOperation[];
}

export interface InspectionOperation {
    operation: string;
    description: string;
    workCenter: string;
    characteristics: InspectionCharacteristic[];
}

export interface InspectionCharacteristic {
    characteristic: string;
    description: string;
    inspectionMethod: string;
    targetValue: number;
    lowerTolerance: number;
    upperTolerance: number;
    unit: string;
}

export interface QualityCertificate {
    certificateNumber: string;
    certificateType: string; // 01=Material Certificate, 02=Test Certificate
    material: string;
    batch?: string;
    customer?: string;
    inspectionLot?: string;
    issueDate: string;
    validUntil?: string;
    status: string; // CRTD=Created, PRNT=Printed, SENT=Sent
    certificateData: any;
}

// Storage Keys
const KEYS = {
    NOTIFICATIONS: 'toad_qm_notifications',
    INSPECTION_LOTS: 'toad_qm_inspection_lots',
    INSPECTION_PLANS: 'toad_qm_inspection_plans',
    CERTIFICATES: 'toad_qm_certificates',
    COUNTER_NOTIF: 'toad_counter_qm_notif',
    COUNTER_LOT: 'toad_counter_qm_lot',
    COUNTER_PLAN: 'toad_counter_qm_plan',
    COUNTER_CERT: 'toad_counter_qm_cert',
};

export const QMService = {
    // Quality Notifications
    getNextNotificationNumber: (): string => {
        const current = localStorage.getItem(KEYS.COUNTER_NOTIF);
        const next = current ? parseInt(current) + 1 : 100000001;
        localStorage.setItem(KEYS.COUNTER_NOTIF, next.toString());
        return next.toString();
    },

    saveNotification: (notif: Omit<QualityNotification, 'notificationNumber' | 'createdDate'>): QualityNotification => {
        const newNotif: QualityNotification = {
            ...notif,
            notificationNumber: QMService.getNextNotificationNumber(),
            createdDate: new Date().toISOString(),
        };
        const existing = QMService.getAllNotifications();
        existing.push(newNotif);
        localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(existing));
        return newNotif;
    },

    getAllNotifications: (): QualityNotification[] => {
        const json = localStorage.getItem(KEYS.NOTIFICATIONS);
        return json ? JSON.parse(json) : [];
    },

    getNotification: (notifNumber: string): QualityNotification | undefined => {
        return QMService.getAllNotifications().find(n => n.notificationNumber === notifNumber);
    },

    // Inspection Lots
    getNextInspectionLot: (): string => {
        const current = localStorage.getItem(KEYS.COUNTER_LOT);
        const next = current ? parseInt(current) + 1 : 10000001;
        localStorage.setItem(KEYS.COUNTER_LOT, next.toString());
        return next.toString();
    },

    saveInspectionLot: (lot: Omit<InspectionLot, 'inspectionLot' | 'createdDate'>): InspectionLot => {
        const newLot: InspectionLot = {
            ...lot,
            inspectionLot: QMService.getNextInspectionLot(),
            createdDate: new Date().toISOString(),
        };
        const existing = QMService.getAllInspectionLots();
        existing.push(newLot);
        localStorage.setItem(KEYS.INSPECTION_LOTS, JSON.stringify(existing));
        return newLot;
    },

    getAllInspectionLots: (): InspectionLot[] => {
        const json = localStorage.getItem(KEYS.INSPECTION_LOTS);
        return json ? JSON.parse(json) : [];
    },

    getInspectionLot: (lotNumber: string): InspectionLot | undefined => {
        return QMService.getAllInspectionLots().find(l => l.inspectionLot === lotNumber);
    },

    updateInspectionLot: (lotNumber: string, updates: Partial<InspectionLot>): void => {
        const lots = QMService.getAllInspectionLots();
        const index = lots.findIndex(l => l.inspectionLot === lotNumber);
        if (index !== -1) {
            lots[index] = { ...lots[index], ...updates };
            localStorage.setItem(KEYS.INSPECTION_LOTS, JSON.stringify(lots));
        }
    },

    // Inspection Plans
    saveInspectionPlan: (plan: InspectionPlan): InspectionPlan => {
        const existing = QMService.getAllInspectionPlans();
        existing.push(plan);
        localStorage.setItem(KEYS.INSPECTION_PLANS, JSON.stringify(existing));
        return plan;
    },

    getAllInspectionPlans: (): InspectionPlan[] => {
        const json = localStorage.getItem(KEYS.INSPECTION_PLANS);
        return json ? JSON.parse(json) : [];
    },

    getInspectionPlan: (planGroup: string, groupCounter: string): InspectionPlan | undefined => {
        return QMService.getAllInspectionPlans().find(
            p => p.planGroup === planGroup && p.groupCounter === groupCounter
        );
    },

    // Quality Certificates
    getNextCertificateNumber: (): string => {
        const current = localStorage.getItem(KEYS.COUNTER_CERT);
        const next = current ? parseInt(current) + 1 : 5000000001;
        localStorage.setItem(KEYS.COUNTER_CERT, next.toString());
        return next.toString();
    },

    saveCertificate: (cert: Omit<QualityCertificate, 'certificateNumber'>): QualityCertificate => {
        const newCert: QualityCertificate = {
            ...cert,
            certificateNumber: QMService.getNextCertificateNumber(),
        };
        const existing = QMService.getAllCertificates();
        existing.push(newCert);
        localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(existing));
        return newCert;
    },

    getAllCertificates: (): QualityCertificate[] => {
        const json = localStorage.getItem(KEYS.CERTIFICATES);
        return json ? JSON.parse(json) : [];
    },

    getCertificate: (certNumber: string): QualityCertificate | undefined => {
        return QMService.getAllCertificates().find(c => c.certificateNumber === certNumber);
    },
};
