import React from 'react';
import {
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LIGHT_GRAY, NOTIFICATION_RED, PRIMARY_BLUE } from '@/styles/colors';
import CommonButton from './CommonButton';

interface ActionButtonProps extends TouchableOpacityProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  undoTitle?: string;
  undoAction?: () => void;
  loading?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ ...props }) => {
  return (
    <CommonButton
      {...props}
      color={LIGHT_GRAY}
      backgroundColor={PRIMARY_BLUE}
      borderColor={PRIMARY_BLUE}
      undoColor={NOTIFICATION_RED}
    />
  );
};

export default ActionButton;
