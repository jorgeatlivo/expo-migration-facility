import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

interface RowProps {
  children: ReactNode;
  reverse?: boolean;
  justifyContent?: ViewStyle['justifyContent'];
  alignItems?: ViewStyle['alignItems'];
  alignContent?: ViewStyle['alignContent'];
  gap?: number;
  style?: StyleProp<ViewStyle>;
  wrap?: boolean;
  fullWidth?: boolean;
  zIndex?: number;
  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
}

const Row: React.FC<RowProps> = ({
  children,
  reverse = false,
  justifyContent,
  alignItems,
  alignContent,
  gap,
  style = {},
  wrap = false,
  zIndex,
  flex,
  flexGrow,
  flexShrink,
  fullWidth = false,
}) => {
  const rowStyle: ViewStyle = {
    display: 'flex',
    flexDirection: reverse ? 'row-reverse' : 'row',
    justifyContent,
    alignItems,
    alignContent,
    gap,
    flex,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    flexGrow,
    flexShrink,
    width: fullWidth ? '100%' : 'auto',
    zIndex,
  };

  return <View style={[rowStyle, style]}>{children}</View>;
};

export default Row;
