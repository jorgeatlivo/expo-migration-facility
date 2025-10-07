import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextProps,
  View,
  ActivityIndicator,
} from 'react-native';
import StyledText from '../StyledText';
import { typographyStyles } from '@/styles/livoFonts';
import {
  BADGE_GRAY,
  DARK_GRAY,
  DIVIDER_GRAY,
  PRIMARY_BLUE,
} from '@/styles/colors';
import { SPACE_VALUES } from '@/styles/spacing';
import Row from '../atoms/Row';
import LivoIcon from '@/assets/icons/LivoIcon';
import { TouchableWrapper } from '@/components/buttons/TouchableWrapper';

export type ButtonWithUndoOptionProps =
  | {
      undoAction?: () => void;
      undoTitle?: string;
      undoColor?: string;
    }
  | {
      undoAction?: undefined;
      undoTitle?: undefined;
      undoColor?: undefined;
    };

type CommonProps = TouchableOpacityProps &
  ButtonWithUndoOptionProps & {
    disabled?: boolean;
    iconAfterText?: boolean;
    iconColor?: string;
    iconName?: string;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textProps?: TextProps;
    textStyle?: StyleProp<TextStyle>;
    title: string;
    borderColor?: string;
    borderWidth?: number;
    color: string;
  };

type TextCommonButtonProps = CommonProps & {
  variant?: 'text' | 'default';
  backgroundColor?: string;
};

type RegularCommonButtonProps = CommonProps & {
  variant?: 'default';
  backgroundColor: string;
};

type CommonButtonProps = TextCommonButtonProps | RegularCommonButtonProps;

const CommonButton: React.FC<CommonButtonProps> = ({
  backgroundColor,
  borderColor,
  borderWidth,
  color,
  disabled,
  iconAfterText,
  iconColor,
  iconName,
  loading,
  style,
  textProps,
  textStyle,
  variant = 'default',
  title,
  undoAction,
  undoTitle,
  undoColor,
  ...props
}) => {
  const buttonBorderColor = disabled ? DARK_GRAY : borderColor;
  const buttonBackgroundColor = disabled ? DARK_GRAY : backgroundColor;
  const buttonColor = disabled ? DIVIDER_GRAY : color;
  return (
    <View style={styles.wrapper}>
      <TouchableWrapper
        disabled={disabled || loading}
        {...props}
        style={[
          styles.button,
          {
            borderWidth: buttonBorderColor ? borderWidth || 2 : undefined,
            borderColor: buttonBorderColor,
            backgroundColor: buttonBackgroundColor,
          },
          styles[variant],
          style,
        ]}
      >
        {!loading ? (
          <Row alignItems={'center'} style={styles.body}>
            {iconName && !iconAfterText ? (
              <LivoIcon
                name={iconName}
                size={24}
                color={iconColor || buttonColor || BADGE_GRAY}
                style={styles.leftIcon}
              />
            ) : null}
            <StyledText
              {...textProps}
              style={[styles.label, { color: buttonColor }, textStyle]}
            >
              {title}
            </StyledText>
            {iconName && iconAfterText ? (
              <LivoIcon
                name={iconName}
                size={24}
                color={iconColor || buttonColor || BADGE_GRAY}
                style={styles.rightIcon}
              />
            ) : null}
          </Row>
        ) : (
          <ActivityIndicator
            size="small"
            color={color}
            style={styles.loading}
          />
        )}
      </TouchableWrapper>
      {undoTitle ? (
        <CommonButton
          title={undoTitle}
          onPress={undoAction}
          color={undoColor ?? PRIMARY_BLUE}
          backgroundColor={'transparent'}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: SPACE_VALUES.small,
  },
  button: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACE_VALUES.tiny,
    paddingHorizontal: SPACE_VALUES.huge,
  },
  body: {
    columnGap: SPACE_VALUES.small,
  },
  label: {
    ...typographyStyles.action.regular,
    textAlign: 'center',
    paddingTop: SPACE_VALUES.medium,
    paddingBottom: SPACE_VALUES.medium,
    marginBottom: -SPACE_VALUES.tiny,
  },
  leftIcon: {
    marginRight: SPACE_VALUES.small,
  },
  rightIcon: {
    marginLeft: SPACE_VALUES.small,
  },
  loading: {
    paddingVertical: SPACE_VALUES.small,
  },
  text: {
    paddingHorizontal: 0,
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    borderRadius: SPACE_VALUES.medium,
    borderWidth: 0,
  },
  default: {},
});

export default CommonButton;
