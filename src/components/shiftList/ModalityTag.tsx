import React from 'react';
import { StyleSheet } from 'react-native';
import StyledText from '../StyledText';
import { SPACE_VALUES } from '@/styles/spacing';
import { typographyStyles } from '@/styles/livoFonts';
import LivoIcon from '@/assets/icons/LivoIcon';
import { ShiftModalityEnum } from '@/types';
import { modalityTags } from '@/styles/utils';
import { useTranslation } from 'react-i18next';
import Row from '../atoms/Row';

interface ModalityTagProps {
  modality: ShiftModalityEnum;
  outline?: boolean;
  shortTag?: boolean;
  style?: any;
}

export const ModalityTag: React.FC<ModalityTagProps> = ({
  modality,
  outline,
  shortTag,
  style,
}) => {
  const { t } = useTranslation();
  const modalityProps = modalityTags[modality];
  return shortTag ? (
    <Row
      alignItems={'center'}
      justifyContent={'center'}
      style={[
        styles.iconTag,
        { backgroundColor: modalityProps.backgroundColor },
        style,
      ]}
    >
      <LivoIcon
        name={modalityProps.icon}
        size={16}
        color={modalityProps.color}
      />
    </Row>
  ) : (
    <Row
      alignItems={'center'}
      style={[
        styles.tagWithLabel,
        style,
        outline
          ? { borderWidth: 1, borderColor: modalityProps.color }
          : { backgroundColor: modalityProps.backgroundColor },
      ]}
    >
      <LivoIcon
        size={16}
        color={modalityProps.color}
        name={modalityProps.icon}
      />
      <StyledText style={styles.label}>
        {t(modalityProps.displayText)}
      </StyledText>
    </Row>
  );
};

const styles = StyleSheet.create({
  iconTag: {
    borderRadius: 100,
    padding: SPACE_VALUES.tiny,
    width: SPACE_VALUES.xLarge,
    height: SPACE_VALUES.xLarge,
  },
  tagWithLabel: {
    paddingVertical: SPACE_VALUES.tiny,
    paddingHorizontal: SPACE_VALUES.small,
    borderRadius: SPACE_VALUES.tiny,
  },
  label: {
    ...typographyStyles.subtitle.small,
    marginLeft: SPACE_VALUES.tiny,
  },
});
