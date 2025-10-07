import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

interface ColProps {
  children: ReactNode;
  reverse?: boolean;
  justifyContent?: ViewStyle['justifyContent'];
  alignItems?: ViewStyle['alignItems'];
  gap?: number;
  style?: StyleProp<ViewStyle>;
  wrap?: boolean;
  flex?: number;
  fullHeight?: boolean;
  fullWidth?: boolean;
  zIndex?: number;
}

const Col: React.FC<ColProps> = ({
  children,
  reverse = false,
  justifyContent,
  alignItems,
  gap,
  flex,
  style = {},
  wrap = false,
  zIndex,
  fullHeight = false,
  fullWidth = false,
}) => {
  const colStyle: ViewStyle = {
    display: 'flex',
    flexDirection: reverse ? 'column-reverse' : 'column',
    justifyContent,
    alignItems,
    gap,
    flex,
    zIndex,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    height: fullHeight ? '100%' : 'auto',
    width: fullWidth ? '100%' : 'auto',
  };

  return <View style={[colStyle, style]}>{children}</View>;
};

export default Col;
