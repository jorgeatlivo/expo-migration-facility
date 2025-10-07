import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderHeightContext } from '@react-navigation/elements';

import Col from '@/components/atoms/Col';
import Row from '@/components/atoms/Row';
import ActionButton from '@/components/buttons/ActionButton';
import StyledText from '@/components/StyledText';

import { ACTION_BLACK, WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

import LivoIcon from '@/assets/icons/LivoIcon';
import AutoCompleteTextInput from './AutoCompleteTextInput';
import CustomTextInput from './CustomTextInput';

interface SelectOptionWithDescriptionModalProps<T> {
  label: string;
  initialOption: T;
  allOptions: T[];
  description: string;
  optionPlaceholder: string;
  descriptionPlaceholder: string;
  showDescription: boolean;
  buttonText: string;
  optionToString: (option: T) => string;
  updateValues: (option: T, description: string) => void;
  onDismiss: () => void;
  onButtonPress: (option: T, description: string) => void;
}

export default function SelectOptionWithDescriptionModal<T>({
  label,
  initialOption,
  allOptions,
  description,
  optionPlaceholder,
  descriptionPlaceholder,
  buttonText,
  showDescription,
  optionToString,
  updateValues,
  onDismiss,
  onButtonPress,
}: SelectOptionWithDescriptionModalProps<T>) {
  const headerHeight = React.useContext(HeaderHeightContext) ?? 0;

  const [selectedOption, setSelectedOption] = useState(initialOption);
  const [selectedDescription, setSelectedDescription] = useState(description);
  const [readyToSubmit, setReadyToSubmit] = useState(
    optionToString(initialOption) !== ''
  );

  function handleOnDismiss() {
    Keyboard.dismiss();
    onDismiss();
  }

  function handleButtonPress() {
    if (readyToSubmit === true) {
      Keyboard.dismiss();
      onDismiss();
      onButtonPress(selectedOption, selectedDescription);
      updateValues(selectedOption, selectedDescription);
    }
  }

  const insets = useSafeAreaInsets();
  return (
    // TODO: Fix TouchableWithoutFeedback not adjusting when tapping description and then options

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.modal, { paddingBottom: insets.bottom }]}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}
        >
          <Col flex={1} gap={SPACE_VALUES.medium}>
            <Row>
              <TouchableOpacity
                onPress={handleOnDismiss}
                style={styles.backButton}
              >
                <LivoIcon name="chevron-left" size={24} color={ACTION_BLACK} />
              </TouchableOpacity>
              <View style={styles.titleWrapper}>
                <StyledText style={styles.title}>{label}</StyledText>
              </View>
            </Row>
            <View style={styles.body}>
              <AutoCompleteTextInput
                parentOption={selectedOption}
                allOptions={allOptions}
                placeholder={optionPlaceholder}
                setParentOption={setSelectedOption}
                optionToString={optionToString}
                setReady={setReadyToSubmit}
              />
              {showDescription && readyToSubmit && (
                <CustomTextInput
                  style={styles.description}
                  value={selectedDescription}
                  onChangeText={setSelectedDescription}
                  placeholder={descriptionPlaceholder}
                  alignTop={true}
                  multiline
                />
              )}
            </View>
            {readyToSubmit && (
              <View style={styles.actionRow}>
                <ActionButton
                  title={buttonText}
                  disabled={!readyToSubmit}
                  onPress={handleButtonPress}
                />
              </View>
            )}
          </Col>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: WHITE,
    justifyContent: 'flex-start',
    paddingTop: SPACE_VALUES.large,
    paddingBottom: 21,
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: WHITE,
  },
  backButton: {
    paddingLeft: SPACE_VALUES.medium,
  },
  titleWrapper: {
    position: 'absolute',
    alignItems: 'center',
    left: 0,
    right: 0,
  },
  title: {
    ...typographyStyles.body.regular,
  },
  description: {
    minHeight: 160,
    maxHeight: 160,
    marginTop: SPACE_VALUES.medium,
  },
  body: {
    paddingHorizontal: SPACE_VALUES.large,
    paddingVertical: SPACE_VALUES.medium,
  },
  actionRow: {
    paddingHorizontal: SPACE_VALUES.large,
  },
});
