import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { GRAY, LIGHT_GRAY, WHITE } from '@/styles/colors';
import { LayoutTextEnum, fontWeight } from '@/styles/fonts';
import StyledText from '../StyledText';

interface LivoTextInputProps extends TextInputProps {
  style?: any;
  errorMessage?: string;
  inputFieldStyle?: any;
}

const LivoTextInput: React.FC<LivoTextInputProps> = ({ errorMessage, style, inputFieldStyle, ...props }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View
      style={style}>
      <TextInput
        {...props}
        style={[styles.input, 
          isFocused ? styles.focus : {},
          errorMessage ? styles.error : {}]}
        placeholderTextColor={GRAY}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {errorMessage ? <StyledText
        style={{
          fontFamily: fontWeight.regular,
          fontSize: 12,
          marginTop: 8,
          color: '#FA3D3B',
        }}>
        {errorMessage}
      </StyledText> : null}
    </View>

  );
};

export default LivoTextInput;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderColor: '#8C95A7',
    backgroundColor: WHITE,
    fontSize: 16,
  },
  focus: {
    borderWidth: 2,
    borderColor: '#325986',
  },
  error: {
    borderWidth: 2,
    borderColor: '#FA3D3B',
  }
});
