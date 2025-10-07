import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
 StyleProp
} from 'react-native';
import { SPACE_VALUES } from '@/styles/spacing';
import { typographyStyles } from '@/styles/livoFonts';
import StyledText from '@/components/StyledText';
import {
  BADGE_GRAY,
  BLUE_FADED,
  DARK_GRAY,
  DIVIDER_GRAY,
  NOTIFICATION_RED,
  WHITE,
} from '@/styles/colors';
import Row from '@/components/atoms/Row';
import LivoIcon from '@/assets/icons/LivoIcon';

interface CustomTextInputProps extends TextInputProps {
  endAdornment?: string;
  errorMessage?: string;
  style?: StyleProp<any>;
  textInputStyle?: StyleProp<any>;
  alignTop?: boolean;
  leftIcon?: string;
  onFocusAction?: () => void;
  onBlurAction?: () => void;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  errorMessage,
  style,
  textInputStyle,
  alignTop,
  onFocusAction,
  onBlurAction,
  endAdornment,
  leftIcon,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={customInputStyles.wrapper}>
      <Row
        alignItems={'center'}
        justifyContent={'space-between'}
        style={[
          customInputStyles.input,
          isFocused && customInputStyles.focus,
          !!errorMessage && customInputStyles.error,
          props.editable === false && customInputStyles.disabled,
          style,
        ]}
      >
        <View
          style={[
            customInputStyles.textInputContainer,
            {
              alignItems: !!props.multiline ? 'flex-start' : 'center',
            },
          ]}
        >
          {leftIcon ? (
            <View style={customInputStyles.leftIcon}>
              <LivoIcon name={leftIcon} size={24} color={DIVIDER_GRAY} />
            </View>
          ) : null}
          <TextInput
            {...props}
            style={[customInputStyles.textInput, textInputStyle]}
            placeholderTextColor={!props.editable ? DIVIDER_GRAY : BLUE_FADED}
            textAlignVertical={alignTop ? 'top' : 'center'}
            onFocus={() => {
              setIsFocused(true);
              if (onFocusAction) onFocusAction();
            }}
            onBlur={() => {
              setIsFocused(false);
              if (onBlurAction) onBlurAction();
            }}
          />
        </View>
        {endAdornment && (
          <StyledText style={customInputStyles.adornment}>
            {endAdornment}
          </StyledText>
        )}
      </Row>
      {errorMessage ? (
        <StyledText style={customInputStyles.errorMessage}>
          {errorMessage}
        </StyledText>
      ) : null}
    </View>
  );
};

export default CustomTextInput;

export const customInputStyles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: SPACE_VALUES.small,
    borderColor: BLUE_FADED,
    backgroundColor: WHITE,
    paddingHorizontal: SPACE_VALUES.medium,
    paddingVertical: SPACE_VALUES.tiny,
    ...typographyStyles.body.regular,
  },
  textInputContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  textInput: {
    paddingVertical: SPACE_VALUES.small - (Platform.OS === 'ios' ? 0 : 2),
    flex: 1,
  },
  leftIcon: {
    marginRight: SPACE_VALUES.small,
  },
  focus: {
    borderWidth: 2,
    borderColor: '#325986',
    paddingVertical: SPACE_VALUES.tiny - 1,
    paddingHorizontal: SPACE_VALUES.medium - 1,
  },
  error: {
    borderWidth: 2,
    borderColor: NOTIFICATION_RED,
    paddingVertical: SPACE_VALUES.tiny - 1,
    paddingHorizontal: SPACE_VALUES.medium - 1,
  },
  disabled: {
    backgroundColor: DARK_GRAY,
    borderColor: DARK_GRAY,
    color: DIVIDER_GRAY,
  },
  adornment: {
    ...typographyStyles.body.regular,
    color: BADGE_GRAY,
    padding: 0,
  },
  errorMessage: {
    ...typographyStyles.info.caption,
    color: NOTIFICATION_RED,
    marginTop: SPACE_VALUES.small,
  },
});
