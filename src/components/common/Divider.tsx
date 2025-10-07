import React from 'react';
import {View} from 'react-native';

interface DividerProps {
  style?: any;
}

export const Divider = ({style}: DividerProps) => (
  <View
    style={{
      borderBottomColor: '#DEE2E8',
      borderBottomWidth: 1,
      ...style,
    }}
  />
);
