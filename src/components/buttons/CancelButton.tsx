import React from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

import { CORAL, WHITE } from '@/styles/colors';

import CommonButton, { ButtonWithUndoOptionProps } from './CommonButton';

type CancelButtonProps = ButtonWithUndoOptionProps &
  TouchableOpacityProps & {
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    title: string;
  };

const CancelButton: React.FC<CancelButtonProps> = ({ ...props }) => {
  return (
    <CommonButton
      {...props}
      color={WHITE}
      backgroundColor={CORAL}
      borderColor={CORAL}
    />
  );
};

export default CancelButton;
