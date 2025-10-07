import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { ModalPickerSelectItem } from '@/components/publishShift/ModalPickerSelectItem';

import { GRAY, WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

import LivoIcon from '@/assets/icons/LivoIcon';

interface Props {
  items: { label: string; value: string }[];
  isVisible: boolean;
  setValue: (newValue: string) => void;
  openModal: () => void;
  closeModal: () => void;
  value: string | null;
  placeHolder?: string;
}

const closeIcon = () => (
  <LivoIcon name="chevron-left" size={28} color={'#2C3038'} />
);
export const FullscreenPickerModal: React.FC<Props> = ({
  items,
  isVisible,
  setValue,
  value,
  closeModal,
  placeHolder,
}) =>
  isVisible ? (
    <TouchableWithoutFeedback onPress={closeModal} style={styles.flex}>
      <View style={styles.dropDownPickerModal}>
        <DropDownPicker
          items={items}
          value={value}
          CloseIconComponent={closeIcon}
          // searchable
          // searchTextInputStyle={styles.searchBar}
          open={true}
          setOpen={closeModal}
          setValue={(val: unknown) => setValue(val as string)}
          onSelectItem={closeModal}
          placeholder={placeHolder}
          placeholderStyle={styles.placeholder}
          style={styles.input}
          listChildLabelStyle={{
            backgroundColor: 'red',
            borderColor: 'green',
          }}
          listMode="MODAL"
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
  ) : null;

let styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: WHITE,
  },
  flex: {
    flex: 1,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 100,
    paddingHorizontal: SPACE_VALUES.medium,
    paddingVertical: SPACE_VALUES.small,
    ...typographyStyles.body.regular,
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
  input: {
    height: 0,
    opacity: 0,
  },
  placeholder: {
    color: GRAY,
    opacity: 0.7,
  },
});
