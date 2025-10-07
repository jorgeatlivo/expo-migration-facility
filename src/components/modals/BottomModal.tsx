import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WHITE } from '@/styles/colors';

interface BottomModalProps {
  isVisible: boolean;
  children?: React.ReactNode;
  dismissModal: () => void;
  style?: any;
}
export const BottomModal: React.FC<BottomModalProps> = ({
  isVisible,
  children,
  dismissModal,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      avoidKeyboard
      onDismiss={dismissModal}
      isVisible={isVisible}
      backdropOpacity={0.5}
      swipeDirection={['down']}
      onSwipeComplete={dismissModal}
      onBackdropPress={dismissModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={{
        justifyContent: 'flex-end',
        margin: 0,
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: WHITE,
          paddingHorizontal: 16,
          paddingTop: 16,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          paddingBottom: insets.bottom,
        }}
      >
        {children}
      </View>
    </Modal>
  );
};
