import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

import StyledText from '@/components/StyledText';

import { ACTION_BLUE, BLUE_FADED } from '@/styles/colors';
import { fontSize, fontWeight } from '@/styles/fonts';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

import LivoIcon from '@/assets/icons/LivoIcon';

interface SingleSelectSimpleProps extends TouchableOpacityProps {
  option: string;
  checked: boolean;
  onPress: () => void;
  rowStyle?: StyleProp<ViewStyle>;
  type?: 'checkbox' | 'radiobox';
}

export const SingleSelectSimple: React.FC<SingleSelectSimpleProps> = ({
  option,
  onPress,
  checked,
  rowStyle,
  type = 'radiobox',
}) => {
  const getIconName = () => {
    const suffix = checked ? 'checked' : 'unchecked';
    return `${type}-${suffix}`;
  };

  return (
    <TouchableOpacity
      key={option}
      style={[styles.row, rowStyle]}
      onPress={onPress}
    >
      <LivoIcon
        name={getIconName()}
        size={24}
        color={checked ? ACTION_BLUE : BLUE_FADED}
      />
      <StyledText
        style={[
          styles.optionLabel,
          {
            fontFamily: checked ? fontWeight.bold : fontWeight.regular,
          },
        ]}
      >
        {option}
      </StyledText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SPACE_VALUES.medium,
    minHeight: 60,
  },
  checkboxContainer: {
    marginBottom: SPACE_VALUES.tiny,
    padding: 0,
  },
  optionLabel: {
    ...typographyStyles.body.regular,
    marginLeft: SPACE_VALUES.medium,
    fontSize: fontSize.medium,
    flexShrink: 1,
  },
});
