import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import Row from '@/components/atoms/Row';
import StyledText from '@/components/StyledText';

import { BLUE_FADED } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

interface Props {
  label: string;
  optional?: boolean;
}

export const InputLabel = ({ label, optional }: Props) => {
  const { t } = useTranslation();
  return (
    <Row style={styles.inputRow}>
      <StyledText style={styles.label}>{label}</StyledText>
      {optional && (
        <StyledText style={styles.optionalLabel}>
          {`(${t('common_optional')})`}
        </StyledText>
      )}
    </Row>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    marginBottom: SPACE_VALUES.small,
  },
  label: {
    ...typographyStyles.subtitle.small,
    marginRight: SPACE_VALUES.tiny,
  },
  optionalLabel: {
    ...typographyStyles.subtitle.small,
    color: BLUE_FADED,
  },
});
