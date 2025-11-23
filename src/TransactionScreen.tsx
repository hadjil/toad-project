import React from 'react';
// Importamos los componentes de transacción específicos
import ScreenFB01 from './Transacciones/FB01';
import ScreenFB03 from './Transacciones/FB03';
import ScreenSE11 from './Transacciones/SE11';
import ScreenVF01 from './Transacciones/VF01';
import ScreenVL03N from './Transacciones/VL03N';
import ScreenFBL3N from './Transacciones/FBL3N';
import ScreenFBL1N from './Transacciones/FBL1N';
import ScreenFBL5N from './Transacciones/FBL5N';
import ScreenMIGO from './Transacciones/MIGO';
import ScreenXK01 from './Transacciones/XK01';
import ScreenXD01 from './Transacciones/XD01';
import ScreenPA30 from './Transacciones/PA30';
import ScreenSE38 from './Transacciones/SE38';
import ScreenCO01 from './Transacciones/CO01';
import ScreenMMBE from './Transacciones/MMBE';
import ScreenMIRO from './Transacciones/MIRO';
import ScreenVL01N from './Transacciones/VL01N';
import ScreenMM03 from './Transacciones/MM03';
import ScreenMM02 from './Transacciones/MM02';
import ScreenME23N from './Transacciones/ME23N';
import ScreenVA03 from './Transacciones/VA03';
import ScreenXK03 from './Transacciones/XK03';
import ScreenXD03 from './Transacciones/XD03';
import ScreenQM01 from './Transacciones/QM01';
import ScreenQM03 from './Transacciones/QM03';
import ScreenQA01 from './Transacciones/QA01';
import ScreenQA02 from './Transacciones/QA02';
import ScreenQA03 from './Transacciones/QA03';
import ScreenQE01 from './Transacciones/QE01';
import ScreenQE51N from './Transacciones/QE51N';
import ScreenQP01 from './Transacciones/QP01';
import ScreenQP02 from './Transacciones/QP02';
import ScreenQP03 from './Transacciones/QP03';
import ScreenQC01 from './Transacciones/QC01';
import ScreenQC03 from './Transacciones/QC03';
import ScreenQMEL from './Transacciones/QMEL';
import ScreenQA11 from './Transacciones/QA11';
import GenericSAPScreen from './Transacciones/GenericSAPScreen';

import GenericTransactionScreen from './components/GenericTransactionScreen';
import transactionsSchema from './data/transactions_schema.json';

interface ScreenProps {
  tCode: string;
  tDescription: string;
}

interface TransactionScreenProps {
  tCode: string;
  tDescription: string;
  onClose: () => void;
}

const TransactionComponentMap: { [key: string]: React.FC<ScreenProps> | undefined } = {
  'FB01': ScreenFB01 as React.FC<ScreenProps>,
  'FB03': ScreenFB03 as React.FC<ScreenProps>,
  'SE11': ScreenSE11 as React.FC<ScreenProps>,
  'VF01': ScreenVF01 as React.FC<ScreenProps>,
  'VL03N': ScreenVL03N as React.FC<ScreenProps>,
  'FBL3N': ScreenFBL3N as React.FC<ScreenProps>,
  'FBL1N': ScreenFBL1N as React.FC<ScreenProps>,
  'FBL5N': ScreenFBL5N as React.FC<ScreenProps>,
  'MIGO': ScreenMIGO as React.FC<ScreenProps>,
  'XK01': ScreenXK01 as React.FC<ScreenProps>,
  'XD01': ScreenXD01 as React.FC<ScreenProps>,
  'PA30': ScreenPA30 as React.FC<ScreenProps>,
  'SE38': ScreenSE38 as React.FC<ScreenProps>,
  'CO01': ScreenCO01 as React.FC<ScreenProps>,
  'MMBE': ScreenMMBE as React.FC<ScreenProps>,
  'MIRO': ScreenMIRO as React.FC<ScreenProps>,
  'VL01N': ScreenVL01N as React.FC<ScreenProps>,
  'MM03': ScreenMM03 as React.FC<ScreenProps>,
  'MM02': ScreenMM02 as React.FC<ScreenProps>,
  'ME23N': ScreenME23N as React.FC<ScreenProps>,
  'VA03': ScreenVA03 as React.FC<ScreenProps>,
  'XK03': ScreenXK03 as React.FC<ScreenProps>,
  'XD03': ScreenXD03 as React.FC<ScreenProps>,
  'QM01': ScreenQM01 as React.FC<ScreenProps>,
  'QM03': ScreenQM03 as React.FC<ScreenProps>,
  'QA01': ScreenQA01 as React.FC<ScreenProps>,
  'QA02': ScreenQA02 as React.FC<ScreenProps>,
  'QA03': ScreenQA03 as React.FC<ScreenProps>,
  'QE01': ScreenQE01 as React.FC<ScreenProps>,
  'QE51N': ScreenQE51N as React.FC<ScreenProps>,
  'QP01': ScreenQP01 as React.FC<ScreenProps>,
  'QP02': ScreenQP02 as React.FC<ScreenProps>,
  'QP03': ScreenQP03 as React.FC<ScreenProps>,
  'QC01': ScreenQC01 as React.FC<ScreenProps>,
  'QC03': ScreenQC03 as React.FC<ScreenProps>,
  'QMEL': ScreenQMEL as React.FC<ScreenProps>,
  'QA11': ScreenQA11 as React.FC<ScreenProps>,
};

const TransactionScreen: React.FC<TransactionScreenProps> = ({ tCode, tDescription, onClose }) => {
  const SpecificScreen = TransactionComponentMap[tCode];
  const schema = (transactionsSchema as any)[tCode];

  const getScreenTitle = () => {
    if (schema) return schema.title;
    const screenWithDisplayName = SpecificScreen as unknown as { displayName?: string };
    if (screenWithDisplayName && screenWithDisplayName.displayName) {
      return screenWithDisplayName.displayName;
    }
    return tDescription;
  }

  return (
    <div className="sap-screen-container">
      <div className="sap-screen-header">
        <span className="sap-screen-title">{getScreenTitle()}</span>
        <button onClick={onClose} className="sap-close-button" title="Cerrar Transacción">X</button>
      </div>

      <div className="sap-screen-content">
        {schema ? (
          <GenericTransactionScreen tCode={tCode} schema={schema} />
        ) : SpecificScreen ? (
          <SpecificScreen tCode={tCode} tDescription={tDescription} />
        ) : (
          <GenericSAPScreen tCode={tCode} tDescription={tDescription} />
        )}
      </div>
    </div>
  );
};

export default TransactionScreen;