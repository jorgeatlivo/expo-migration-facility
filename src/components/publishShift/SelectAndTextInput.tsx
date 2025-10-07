import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BLACK,
  BLUE_FADED,
  DARK_GRAY,
  DIVIDER_GRAY,
  NOTIFICATION_RED,
  WHITE,
} from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import StyledText from '../StyledText';
import CustomTextInput from '../common/CustomTextInput';
import Row from '../atoms/Row';
import { DropDownPickerModal } from './DropDownPickerModal';
import Col from '@/components/atoms/Col';
import { FullscreenPickerModal } from '@/components/publishShift/FullscreenPickerModal';
import { DropDownInput } from '../common/DropDownInput';

interface SelectAndTextInputProps {
  value: string | undefined;
  setValue: (unit: string) => void;
  options: { label: string; value: string }[] | null;
  label: string;
  placeholder: string;
  description?: string;
  errorMessage?: string;
  disabled?: boolean;
  optional?: boolean;
  iconName?: string;

  // Once UserFeatureEnum.SHIFT_UNIT_AND_PROFESSIONAL_FIELDS is removed, remove this functionality
  enableTextInput?: boolean;
  textPlaceholder?: string;
}

export const SelectAndTextInput: React.FC<SelectAndTextInputProps> = ({
  disabled,
  enableTextInput,
  errorMessage,
  label,
  options,
  placeholder,
  setValue,
  textPlaceholder,
  value,
  iconName,
}) => {
  const [isUnitPickerVisible, setIsUnitPickerVisible] = useState(false);

  const selectedLabel =
    options?.find((opt) => opt.value === value)?.label || value;

  return (
    <Col style={styles.wrapper}>
      <Row alignItems={'center'}>
        {options && options.length > 0 ? (
          <View style={styles.flex}>
            <DropDownInput
              placeholderAsLabel
              disabled={disabled}
              placeholder={label}
              selectedLabel={selectedLabel}
              navigateToOptions={() => !disabled && setIsUnitPickerVisible(true)}
              iconName={iconName}
            />
          </View>
        ) : enableTextInput ? (
          // Once UserFeatureEnum.SHIFT_UNIT_AND_PROFESSIONAL_FIELDS is removed, remove this functionality
          <CustomTextInput
            keyboardType="default"
            returnKeyType="done"
            onChangeText={setValue}
            placeholder={textPlaceholder}
            value={value ?? ''}
            style={styles.flex}
          />
        ) : null}
      </Row>
      {options && options.length > 0 ? (
        options.length > 5 ? (
          <FullscreenPickerModal
            value={value ?? null}
            setValue={setValue}
            isVisible={isUnitPickerVisible}
            openModal={() => setIsUnitPickerVisible(true)}
            closeModal={() => setIsUnitPickerVisible(false)}
            placeHolder={placeholder}
            items={options}
          />
        ) : (
          <DropDownPickerModal
            value={value ?? null}
            setValue={setValue}
            isVisible={isUnitPickerVisible}
            closeModal={() => setIsUnitPickerVisible(false)}
            placeHolder={placeholder}
            items={options}
          />
        )
      ) : null}
      {errorMessage && (
        <StyledText style={styles.errorMessage}>{errorMessage}</StyledText>
      )}
    </Col>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACE_VALUES.large,
  },
  flex: {
    flex: 1,
  },
  label: {
    ...typographyStyles.subtitle.small,
    marginBottom: SPACE_VALUES.medium,
  },
  value: {
    ...typographyStyles.body.regular,
    color: BLUE_FADED,
  },
  selected: {
    color: BLACK,
  },
  unitField: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: WHITE,
    overflow: 'hidden',
    borderColor: BLUE_FADED,
    borderRadius: SPACE_VALUES.small,
    paddingHorizontal: SPACE_VALUES.large,
    paddingVertical: SPACE_VALUES.medium,
    ...typographyStyles.body.regular,
    color: BLUE_FADED,
  },
  disabled: {
    backgroundColor: DARK_GRAY,
    borderColor: DARK_GRAY,
    color: DIVIDER_GRAY,
  },
  error: {
    borderWidth: 2,
    borderColor: NOTIFICATION_RED,
    paddingHorizontal: SPACE_VALUES.large - 1,
    paddingVertical: SPACE_VALUES.medium - 1,
  },
  errorMessage: {
    ...typographyStyles.info.caption,
    color: NOTIFICATION_RED,
    marginTop: SPACE_VALUES.tiny,
  },
});
