import React from 'react';
import {
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {LIGHT_GRAY, PRIMARY_BLUE} from '@/styles/colors';
import CommonButton from './CommonButton';

interface UndoButtonProps extends TouchableOpacityProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const UndoButton: React.FC<UndoButtonProps> = ({
  ...props
}) => {
  return (
    <CommonButton
    { ...props}
    color={PRIMARY_BLUE}
     backgroundColor={LIGHT_GRAY}
      borderColor={PRIMARY_BLUE} 
      />
  );
};

export default UndoButton;
