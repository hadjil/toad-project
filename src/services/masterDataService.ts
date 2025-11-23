import materialsData from '../data/materials.json';
import customersData from '../data/customers.json';
import vendorsData from '../data/vendors.json';
import glAccountsData from '../data/gl_accounts.json';

// Interfaces matching the JSON structure
export interface Material {
    material: string;
    description: string;
    type: string;
    industry: string;
    baseUnit: string;
    price: number;
    currency: string;
}

export interface Customer {
    customer: string;
    name: string;
    city: string;
    country: string;
    paymentTerms: string;
    reconciliationAccount: string;
}

export interface Vendor {
    vendor: string;
    name: string;
    city: string;
    country: string;
    paymentTerms: string;
    reconciliationAccount: string;
}

export interface GLAccount {
    account: string;
    description: string;
    type: string;
    currency: string;
}

export const MasterDataService = {
    // --- Materials ---
    getMaterials: (): Material[] => {
        return materialsData;
    },

    getMaterial: (id: string): Material | undefined => {
        return materialsData.find(m => m.material === id);
    },

    getAllMaterials: (): Material[] => {
        const key = 'toad_materials';
        const existingJson = localStorage.getItem(key);
        const dynamic: Material[] = existingJson ? JSON.parse(existingJson) : [];
        return [...materialsData, ...dynamic];
    },

    getMaterialCombined: (id: string): Material | undefined => {
        const all = MasterDataService.getAllMaterials();
        return all.find(m => m.material === id);
    },

    saveMaterial: (material: Material) => {
        const key = 'toad_materials';
        const existingJson = localStorage.getItem(key);
        const existing: Material[] = existingJson ? JSON.parse(existingJson) : [];
        existing.push(material);
        localStorage.setItem(key, JSON.stringify(existing));
    },

    // --- Customers ---
    getCustomers: (): any[] => {
        const local = localStorage.getItem('toad_customers');
        const localCustomers = local ? JSON.parse(local) : [];
        return [...customersData, ...localCustomers];
    },

    getCustomer: (id: string): Customer | undefined => {
        return customersData.find(c => c.customer === id);
    },

    saveCustomer: (customer: any) => {
        const local = localStorage.getItem('toad_customers');
        const localCustomers = local ? JSON.parse(local) : [];
        localCustomers.push(customer);
        localStorage.setItem('toad_customers', JSON.stringify(localCustomers));
    },

    // --- Vendors ---
    getVendors: (): any[] => {
        const local = localStorage.getItem('toad_vendors');
        const localVendors = local ? JSON.parse(local) : [];
        return [...vendorsData, ...localVendors];
    },

    getVendor: (id: string): Vendor | undefined => {
        return vendorsData.find(v => v.vendor === id);
    },

    saveVendor: (vendor: any) => {
        const local = localStorage.getItem('toad_vendors');
        const localVendors = local ? JSON.parse(local) : [];
        localVendors.push(vendor);
        localStorage.setItem('toad_vendors', JSON.stringify(localVendors));
    },

    // --- GL Accounts ---
    getGLAccounts: (): GLAccount[] => {
        return glAccountsData as GLAccount[];
    },

    getGLAccount: (id: string): GLAccount | undefined => {
        return glAccountsData.find(a => a.account === id) as GLAccount | undefined;
    }
};
