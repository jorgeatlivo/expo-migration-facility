import React, { ReactNode } from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

interface LivoTextProps extends TextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

const LivoText = ({ children, style, ...props }: LivoTextProps) => {
  return (
    <Text {...props} style={[styles.text, style]}>
      {children}
    </Text>
  );
};

const styles: { text: TextStyle } = {
  text: {
    fontFamily: 'Roboto-Regular',
  },
};

export default LivoText;
