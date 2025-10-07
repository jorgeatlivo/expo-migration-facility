import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { ModalPickerSelectItem } from '@/components/publishShift/ModalPickerSelectItem';

import { GRAY, WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

interface DropDownPickerModalProps {
  items: { label: string; value: string }[];
  isVisible: boolean;
  setValue: (newValue: string) => void;
  closeModal: () => void;
  value: string | null;
  placeHolder?: string;
}

export const DropDownPickerModal: React.FC<DropDownPickerModalProps> = ({
  items,
  isVisible,
  setValue,
  value,
  closeModal,
  placeHolder,
}) => (
  <Modal
    visible={isVisible}
    animationType="fade"
    transparent={true}
    onRequestClose={closeModal}
    onDismiss={closeModal}
    style={styles.flex}
  >
    <TouchableWithoutFeedback onPress={closeModal} style={styles.flex}>
      <View style={styles.dropDownPickerModal}>
        <DropDownPicker
          items={items}
          open={true}
          value={value}
          setOpen={() => {}}
          setValue={(val: unknown) => setValue(val as string)}
          onSelectItem={closeModal}
          placeholder={placeHolder}
          placeholderStyle={styles.placeholder}
          style={styles.specializationDropdown}
          dropDownContainerStyle={styles.specializationDropdown}
          renderListItem={({ label, value: itemValue, isSelected }) => (
            <ModalPickerSelectItem
              label={label}
              value={itemValue}
              isSelected={isSelected}
              onSelect={setValue}
              closeModal={closeModal}
            />
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

let styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: WHITE,
  },
  flex: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: WHITE,
  },
  dropDownPickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: SPACE_VALUES.large,
  },
  specializationDropdown: {
    borderRadius: 16,
    borderColor: GRAY + 80,
    backgroundColor: WHITE,
    margin: 20,
    alignSelf: 'center',
  },
  placeholder: {
    color: GRAY,
    opacity: 0.7,
  },
  menuItem: {
    paddingVertical: SPACE_VALUES.large,
    paddingHorizontal: SPACE_VALUES.medium,
  },
  label: {
    ...typographyStyles.body.medium,
  },
});
