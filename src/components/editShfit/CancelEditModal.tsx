import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BLACK, CORAL} from '@/styles/colors';
import {LayoutTextEnum} from '@/styles/fonts';
import StyledText from '../StyledText';

interface CancelEditModalProps {
  visible: boolean;
  onCancelShift: () => void;
  onEditShift: () => void;
  onDismiss: () => void;
}

export const CancelEditModal: React.FC<CancelEditModalProps> = ({
  onCancelShift,
  onEditShift,
  visible,
  onDismiss,
}) => {
  const {t} = useTranslation();

  const handleCancelShift = () => {
    onDismiss();
    onCancelShift();
  };

  const handleEditShift = () => {
    onDismiss();
    onEditShift();
  };

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={300}
      style={styles.modalContainer}
      onSwipeComplete={onDismiss} // Handle swipe down to dismiss
      swipeDirection="down">
      <View style={styles.modalContent}>
        {/* Dismissible indicator */}
        <View style={styles.dismissibleIndicator} />
        <TouchableOpacity onPress={handleEditShift} style={styles.row}>
          <Icon
            name="pencil"
            size={20}
            color={BLACK}
            style={styles.iconStyle}
          />
          <StyledText type={LayoutTextEnum.headerSmall}>
            {t('shift_detail_edit_shift')}
          </StyledText>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCancelShift} style={styles.row}>
          <Icon name="trash" size={20} color={CORAL} style={styles.iconStyle} />
          <StyledText
            type={LayoutTextEnum.headerSmall}
            style={styles.cancelText}>
            {t('shift_list_cancel_shift_label')}
          </StyledText>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 30,
    paddingBottom: 60,
  },
  row: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelText: {
    color: CORAL,
  },
  iconStyle: {
    marginRight: 5,
  },
  // Dismissible indicator style
  dismissibleIndicator: {
    alignSelf: 'center',
    backgroundColor: '#ccc', // Customize the background color
    height: 4, // Adjust the height as needed
    width: 40, // Adjust the width as needed
    borderRadius: 2, // Adjust the borderRadius as needed
    marginBottom: 10, // Adjust the margin as needed
  },
});
