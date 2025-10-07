import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {commonStyles} from '@/styles/commonStyles';
import {InformationRow} from './InformationRow';

interface LicenseNumberCardProps {
  licenseNumber: string;
  style?: any;
}

export function LicenseNumberCard({
  licenseNumber,
  style,
}: LicenseNumberCardProps) {
  const {t} = useTranslation();

  return (
    <View style={[commonStyles.cardContainer, style]}>
      <InformationRow
        label={t('shift_list_license_number_label') + ' '}
        value={licenseNumber}
        style={styles.licenseNumber}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  licenseNumber: {
    marginBottom: 0,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
});
