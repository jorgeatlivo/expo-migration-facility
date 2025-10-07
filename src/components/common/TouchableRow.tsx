import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import StyledText from '@/components/StyledText';
import { typographyStyles } from '@/styles/livoFonts';
import { ACTION_BLUE, DIVIDER_GRAY } from '@/styles/colors';
import LivoIcon from '@/assets/icons/LivoIcon';
import { SPACE_VALUES } from '@/styles/spacing';

interface TouchableRowProps {
  leftIcon?: string;
  text: string;
  rightIcon?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: object;
  iconSize?: number;
  leftIconColor?: string;
  rightIconColor?: string;
  onPress?: () => void;
}

export default function TouchableRow({
  leftIcon,
  text,
  rightIcon,
  onPress,
  style,
  textStyle,
  iconSize,
  leftIconColor,
  rightIconColor,
}: TouchableRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[styles.container, style]}
    >
      <View style={styles.leftContent}>
        {leftIcon && (
          <LivoIcon
            name={leftIcon}
            size={iconSize ?? 24}
            color={leftIconColor ?? DIVIDER_GRAY}
          />
        )}
        <StyledText style={[styles.text, textStyle]}>{text}</StyledText>
      </View>

      {rightIcon ? (
        <LivoIcon
          name={rightIcon}
          size={iconSize ?? 24}
          color={rightIconColor ?? ACTION_BLUE}
        />
      ) : (
        <LivoIcon
          name="chevron-right"
          size={iconSize ?? 24}
          color={rightIconColor ?? ACTION_BLUE}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    ...typographyStyles.action.regular,
    color: ACTION_BLUE,
    marginHorizontal: SPACE_VALUES.small,
  },
});
