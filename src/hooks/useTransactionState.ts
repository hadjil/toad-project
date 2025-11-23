import { useState, useEffect } from 'react';

export const useTransactionState = (tCode: string, initialState: Record<string, any> = {}) => {
    const storageKey = `toad_data_${tCode}`;

    // Load initial state from localStorage or use provided initialState
    const [formState, setFormState] = useState<Record<string, any>>(() => {
        try {
            const storedData = localStorage.getItem(storageKey);
            return storedData ? JSON.parse(storedData) : initialState;
        } catch (error) {
            console.error("Error loading state from localStorage", error);
            return initialState;
        }
    });

    // Save to localStorage whenever state changes
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(formState));
        } catch (error) {
            console.error("Error saving state to localStorage", error);
        }
    }, [formState, storageKey]);

    const handleChange = (field: string, value: any) => {
        setFormState(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetState = () => {
        setFormState(initialState);
        localStorage.removeItem(storageKey);
    };

    return { formState, handleChange, resetState };
};
