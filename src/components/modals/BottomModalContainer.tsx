import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WHITE } from '@/styles/colors';

interface BottomModalContainerProps {
  children?: React.ReactNode;
}
export const BottomModalContainer: React.FC<BottomModalContainerProps> = ({
  children,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: WHITE,
        paddingHorizontal: 16,
        paddingTop: 16,
        justifyContent: 'center',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingBottom: insets.bottom,
      }}
    >
      {children}
    </View>
  );
};
