import React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';

const wrapperKeys: (keyof ViewStyle)[] = [
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginVertical',
  'marginHorizontal',
  'width',
  'flex',
  'height',
];

export function extractWrapperStyles(style?: StyleProp<ViewStyle>) {
  const flat = StyleSheet.flatten(style) || {};

  const button: ViewStyle = {};
  const wrapper: ViewStyle = {
    overflow: 'hidden',
    borderRadius: flat.borderRadius,
  };

  Object.entries(flat).forEach(([key, value]) => {
    if (wrapperKeys.includes(key as keyof ViewStyle)) {
      wrapper[key as keyof ViewStyle] = value;
    } else {
      button[key as keyof ViewStyle] = value;
    }
  });

  return { wrapper, button };
}

export const TouchableWrapper = (props: TouchableOpacityProps) => {
  const { onPress, disabled, style, children } = props;

  const androidStyles = extractWrapperStyles(style);

  return Platform.OS === 'android' ? (
    <View style={androidStyles.wrapper}>
      <TouchableNativeFeedback {...props} disabled={disabled} onPress={onPress}>
        <View style={androidStyles.button}>{children}</View>
      </TouchableNativeFeedback>
    </View>
  ) : (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={style}>
      {children}
    </TouchableOpacity>
  );
};
