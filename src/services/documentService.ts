import poData from '../data/purchase_orders.json';
import materialDocs from '../data/material_documents.json';
import soData from '../data/sales_orders.json';
import fiData from '../data/fi_documents.json';

// Interfaces for Documents

export interface FIDocumentItem {
    lineId: number;
    postingKey: string;
    account: string;
    description?: string; // Derived from master data
    amount: number;
    costCenter?: string;
    text?: string;
}

export interface FIDocument {
    documentNumber: string;
    companyCode: string;
    documentDate: string;
    postingDate: string;
    period: string;
    type: string;
    currency: string;
    reference?: string;
    headerText?: string;
    items: FIDocumentItem[];
    status: 'Posted' | 'Parked';
    createdAt: string;
}

// Storage Keys
const KEYS = {
    FI_DOCS: 'toad_documents_fi',
    FI_COUNTER: 'toad_counter_fi'
};

export const DocumentService = {
    // --- FI Documents ---

    getNextFINumber: (): string => {
        const current = localStorage.getItem(KEYS.FI_COUNTER);
        const next = current ? parseInt(current) + 1 : 1000000000;
        localStorage.setItem(KEYS.FI_COUNTER, next.toString());
        return next.toString();
    },

    saveFIDocument: (doc: Omit<FIDocument, 'documentNumber' | 'createdAt'>): FIDocument => {
        const newDoc: FIDocument = {
            ...doc,
            documentNumber: DocumentService.getNextFINumber(),
            createdAt: new Date().toISOString()
        };

        const existingDocsJson = localStorage.getItem(KEYS.FI_DOCS);
        const existingDocs: FIDocument[] = existingDocsJson ? JSON.parse(existingDocsJson) : [];

        existingDocs.push(newDoc);
        localStorage.setItem(KEYS.FI_DOCS, JSON.stringify(existingDocs));

        return newDoc;
    },

    getFIDocuments: (): FIDocument[] => {
        // Combine JSON data with LocalStorage
        const docsJson = localStorage.getItem(KEYS.FI_DOCS);
        const localDocs = docsJson ? JSON.parse(docsJson) : [];
        return [...(fiData as FIDocument[]), ...localDocs];
    },

    getFIDocument: (docNumber: string): FIDocument | undefined => {
        const docs = DocumentService.getFIDocuments();
        return docs.find(d => d.documentNumber === docNumber);
    },

    // --- MM Documents (Purchase Orders) ---

    getNextPONumber: (): string => {
        const current = localStorage.getItem('toad_counter_po');
        const next = current ? parseInt(current) + 1 : 4500000000;
        localStorage.setItem('toad_counter_po', next.toString());
        return next.toString();
    },

    savePO: (po: any): any => {
        const newPO = {
            ...po,
            documentNumber: DocumentService.getNextPONumber(),
            createdAt: new Date().toISOString()
        };
        const existingJson = localStorage.getItem('toad_po');
        const existing = existingJson ? JSON.parse(existingJson) : [];
        existing.push(newPO);
        localStorage.setItem('toad_po', JSON.stringify(existing));
        return newPO;
    },

    // --- SD Documents (Sales Orders & Invoices) ---

    getNextSDNumber: (): string => {
        const current = localStorage.getItem('toad_counter_sd');
        const next = current ? parseInt(current) + 1 : 1000000;
        localStorage.setItem('toad_counter_sd', next.toString());
        return next.toString();
    },

    saveSalesOrder: (order: any): any => {
        const newOrder = {
            ...order,
            documentNumber: DocumentService.getNextSDNumber(),
            type: 'Sales Order',
            createdAt: new Date().toISOString()
        };
        const existingJson = localStorage.getItem('toad_documents_sd');
        const existing = existingJson ? JSON.parse(existingJson) : [];
        existing.push(newOrder);
        localStorage.setItem('toad_documents_sd', JSON.stringify(existing));
        return newOrder;
    },

    saveInvoice: (invoice: any): any => {
        const newInvoice = {
            ...invoice,
            documentNumber: DocumentService.getNextSDNumber(), // Shared counter for simplicity
            type: 'Invoice',
            createdAt: new Date().toISOString()
        };
        const existingJson = localStorage.getItem('toad_documents_sd');
        const existing = existingJson ? JSON.parse(existingJson) : [];
        existing.push(newInvoice);
        localStorage.setItem('toad_documents_sd', JSON.stringify(existing));
        return newInvoice;
    },

    // --- Reporting Helpers ---

    getAllFIDocuments: (): FIDocument[] => {
        return DocumentService.getFIDocuments();
    },

    getAllPOs: (): any[] => {
        const json = localStorage.getItem('toad_po');
        const localPOs = json ? JSON.parse(json) : [];
        return [...poData, ...localPOs];
    },

    getAllSalesDocuments: (): any[] => {
        const json = localStorage.getItem('toad_documents_sd');
        const localSDs = json ? JSON.parse(json) : [];
        return [...soData, ...localSDs];
    },

    // --- Material Documents (MM) ---
    getMaterialDocuments: (filters: { material?: string; plant?: string; dateFrom?: string; dateTo?: string; }): any[] => {
        // Combine static JSON data with any locally stored material documents
        const localKey = 'toad_material_documents';
        const localJson = localStorage.getItem(localKey);
        const localDocs = localJson ? JSON.parse(localJson) : [];
        const allDocs = [...materialDocs, ...localDocs];
        // Simple filter implementation
        return allDocs.filter(doc => {
            if (filters.material && doc.material !== filters.material) return false;
            if (filters.plant && doc.plant !== filters.plant) return false;
            if (filters.dateFrom && doc.date < filters.dateFrom) return false;
            if (filters.dateTo && doc.date > filters.dateTo) return false;
            return true;
        });
    }
};
