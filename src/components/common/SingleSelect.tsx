import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

import Row from '@/components/atoms/Row';
import StyledText from '@/components/StyledText';

import { ACTION_BLUE, SLATE_GRAY } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';

import LivoIcon from '@/assets/icons/LivoIcon';

interface CustomCheckBoxProps extends TouchableOpacityProps {
  option: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  checked: boolean;
  onPress: () => void;
  rowStyle?: StyleProp<ViewStyle>;
}

const SingleSelect: React.FC<CustomCheckBoxProps> = ({
  option,
  onPress,
  checked,
}) => (
  <TouchableOpacity key={option} onPress={onPress}>
    <Row justifyContent="space-between" alignItems="center">
      <StyledText style={checked ? styles.selectedOption : styles.option}>
        {option}
      </StyledText>
      <LivoIcon
        size={24}
        name={checked ? 'radiobox-checked' : 'radiobox-unchecked'}
        color={checked ? ACTION_BLUE : SLATE_GRAY}
      />
    </Row>
  </TouchableOpacity>
);

export default SingleSelect;

const styles = StyleSheet.create({
  selectedOption: {
    ...typographyStyles.subtitle.regular,
    color: ACTION_BLUE,
  },
  option: {
    ...typographyStyles.body.regular,
    color: SLATE_GRAY,
  },
});
