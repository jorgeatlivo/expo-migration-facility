import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';

import { ProfessionalDataField } from '@/services/shifts';

import { InformationRow } from './InformationRow';

export interface InternalExperienceComponentProps {
  employeeNumber?: string | null;
  unit?: string | null;
  contractType?: string | null;
  datafields?: ProfessionalDataField[];
}

export const InternalExperienceComponent: React.FC<
  InternalExperienceComponentProps
> = ({ employeeNumber, unit, contractType, datafields }) => {
  const { t } = useTranslation();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      {employeeNumber ? (
        <InformationRow
          label={t('employee_number_label') + ':'}
          value={employeeNumber}
        />
      ) : null}
      {unit ? (
        <InformationRow label={t('unit_label') + ':'} value={unit} />
      ) : null}
      {contractType ? (
        <InformationRow
          label={t('contract_label') + ':'}
          value={contractType}
        />
      ) : null}
      {datafields
        ? datafields.map((datafield, index) => (
            <InformationRow
              key={index}
              label={datafield.label + ':'}
              value={datafield.displayText}
              style={
                index === datafields.length - 1
                  ? { marginBottom: 0 }
                  : undefined
              }
            />
          ))
        : null}
    </ScrollView>
  );
};
