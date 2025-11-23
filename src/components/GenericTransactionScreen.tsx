import React from 'react';
import { useTransactionState } from '../hooks/useTransactionState';

interface FieldSchema {
    name: string;
    label: string;
    type: 'text' | 'date' | 'number' | 'select';
    maxLength?: number;
    width?: string;
    default?: string;
    options?: string[];
}

interface TabSchema {
    label: string;
    fields: FieldSchema[];
}

interface TransactionSchema {
    title: string;
    tabs: TabSchema[];
}

interface GenericTransactionScreenProps {
    tCode: string;
    schema: TransactionSchema;
}

const GenericTransactionScreen: React.FC<GenericTransactionScreenProps> = ({ tCode, schema }) => {
    const { formState, handleChange } = useTransactionState(tCode);

    return (
        <div className="generic-transaction-layout">
            <h2 className="sap-page-title">{schema.title}</h2>

            {/* Command Bar */}
            <div className="sap-command-bar">
                <input
                    type="text"
                    placeholder={tCode}
                    className="sap-tcode-input"
                    disabled
                />
                <span className="sap-command-text">Standard Transaction</span>
            </div>

            {/* Tabs */}
            <div className="sap-tabs-container">
                {schema.tabs.map((tab, tabIndex) => (
                    <div key={tabIndex} className="sap-tab-content">
                        <h3 className="sap-tab-header">
                            {tab.label}
                        </h3>

                        <div className="sap-form-grid">
                            {tab.fields.map((field) => (
                                <div key={field.name} className="sap-form-row">
                                    <label className="sap-label" title={field.label}>
                                        {field.label}
                                    </label>

                                    {field.type === 'select' ? (
                                        <select
                                            className={`sap-input ${field.width || 'w-md'}`}
                                            value={formState[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                        >
                                            <option value="">-- Select --</option>
                                            {field.options?.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type}
                                            className={`sap-input ${field.width || 'w-md'}`}
                                            maxLength={field.maxLength}
                                            value={formState[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GenericTransactionScreen;
