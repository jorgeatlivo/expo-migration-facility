import React, { useState } from 'react';
import { FlatList, Keyboard, Text, TouchableOpacity, View } from 'react-native';

import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

import CustomTextInput from './CustomTextInput';

interface AutoCompleteTextInputProps<T> {
  parentOption: T;
  allOptions: T[];
  placeholder: string;
  setParentOption: (option: T) => void;
  optionToString: (option: T) => string;
  setReady: (ready: boolean) => void;
}

export default function AutoCompleteTextInput<T>({
  parentOption,
  allOptions,
  placeholder,
  setParentOption,
  optionToString,
  setReady,
}: AutoCompleteTextInputProps<T>) {
  const [filteredOptions, setFilteredOptions] = useState(allOptions);

  const [showOptions, setShowOptions] = useState(
    optionToString(parentOption) === ''
  );
  const [inputText, setInputText] = useState(optionToString(parentOption));
  const [selectedOption, setSelectedOption] = useState(parentOption);

  function handleInputChange(input: string) {
    setReady(false);
    setShowOptions(true);
    setInputText(input);
    const filtered = allOptions.filter((item) =>
      optionToString(item).toLowerCase().includes(input.toLowerCase())
    );
    setFilteredOptions(filtered);
  }

  function handleItemPress(option: T) {
    const optionName = optionToString(option);
    setInputText(optionName);
    setSelectedOption(option);
    setParentOption(option);

    Keyboard.dismiss();
    setFilteredOptions([]);
    setShowOptions(false);
    setReady(true);
  }

  function resetInput() {
    setReady(false);
    setInputText('');
    setShowOptions(true);
    setFilteredOptions(allOptions);
  }

  function dismissWrongInput() {
    const selectedOptionName = optionToString(selectedOption);
    if (inputText !== selectedOptionName) {
      setInputText(selectedOptionName);
    }

    setFilteredOptions([]);
    setShowOptions(false);
    setReady(selectedOptionName !== '');
  }

  return (
    <View>
      <CustomTextInput
        value={inputText}
        placeholder={placeholder}
        autoFocus={optionToString(parentOption) === ''}
        onChangeText={handleInputChange}
        onFocusAction={resetInput}
        onBlurAction={dismissWrongInput}
      />
      <View
        style={{
          marginTop: SPACE_VALUES.medium,
        }}
      >
        {showOptions && filteredOptions.length > 0 && (
          <FlatList<T>
            data={filteredOptions}
            keyboardShouldPersistTaps={'handled'}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleItemPress(item)}
                style={{ paddingBottom: SPACE_VALUES.medium }}
              >
                <Text style={{ ...typographyStyles.body.medium }}>
                  {optionToString(item)}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}
