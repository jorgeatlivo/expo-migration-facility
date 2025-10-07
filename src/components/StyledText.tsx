import React, { ReactNode } from 'react';
import { Text, TextStyle, StyleProp, TextProps } from 'react-native';
import { LayoutTextEnum, layoutTextStyles } from '@/styles/fonts';

export interface StyledTextProps extends TextProps {
  children: ReactNode;
  type?: LayoutTextEnum;
  style?: StyleProp<TextStyle>;
}

const StyledText: React.FC<StyledTextProps> = ({
  children,
  style,
  type,
  ...props
}) => {
  return (
    <Text
      allowFontScaling={false}
      {...props}
      style={[
        { fontFamily: 'Roboto', flexShrink: 1 },
        type && layoutTextStyles[type],
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default StyledText;
