import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Row from '@/components/atoms/Row';
import StyledText from '@/components/StyledText';

import { ACTION_BLUE, BLUE_FADED } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

import LivoIcon from '@/assets/icons/LivoIcon';

export const ModalPickerSelectItem = ({
  label,
  value,
  isSelected,
  onSelect,
  closeModal,
}: {
  label: string;
  value: string;
  isSelected: boolean;
  onSelect: (item: string) => void;
  closeModal: () => void;
}) => (
  <TouchableOpacity
    onPress={() => {
      onSelect(value);
      closeModal();
    }}
  >
    <Row gap={SPACE_VALUES.small} alignItems={'center'} style={styles.menuItem}>
      <LivoIcon
        size={24}
        name={`radiobox-${isSelected ? 'checked' : 'unchecked'}`}
        color={isSelected ? ACTION_BLUE : BLUE_FADED}
      />
      <StyledText style={styles.label}>{label}</StyledText>
    </Row>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  menuItem: {
    paddingVertical: SPACE_VALUES.large,
    paddingHorizontal: SPACE_VALUES.large,
  },
  label: {
    ...typographyStyles.body.medium,
  },
});
