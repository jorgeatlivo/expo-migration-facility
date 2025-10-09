import React, { forwardRef, useCallback, useMemo } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ACTION_BLACK, BLUE_FADED } from '@/styles/colors';

// Change the interface to not exclude value or defaultValue
interface PerformanceTextInputProps extends TextInputProps {
  containerStyle?: {
    borderColor?: string;
  };
}

const PerformanceTextInput = forwardRef<TextInput, PerformanceTextInputProps>(
  ({ onFocus, onBlur, style, containerStyle, ...textInputProps }, ref) => {
    const focusAnimation = useSharedValue(0);

    // Use useAnimatedStyle for better performance
    const animatedBorderStyle = useAnimatedStyle(() => {
      return {
        borderColor: interpolateColor(
          focusAnimation.value,
          [0, 1],
          [containerStyle?.borderColor || BLUE_FADED, '#325986']
        ),
        borderWidth: interpolate(focusAnimation.value, [0, 1], [1, 2]),
      };
    });

    // Memoize text input style to prevent recreating the array on each render
    const textInputStyle = useMemo(() => [styles.textInput, style], [style]);

    // Use memoized container style - CHANGE ORDER to prioritize containerStyle
    const containerAnimatedStyle = useMemo(
      () => [styles.inputContainer, animatedBorderStyle, containerStyle],
      [animatedBorderStyle, containerStyle]
    );

    // Memoize event handlers with useCallback
    const handleFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        focusAnimation.value = withTiming(1, { duration: 150 });
        if (onFocus) {
          onFocus(e);
        }
      },
      [onFocus, focusAnimation]
    );

    const handleBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        focusAnimation.value = withTiming(0, { duration: 150 });
        if (onBlur) {
          onBlur(e);
        }
      },
      [onBlur, focusAnimation]
    );

    return (
      <Animated.View style={containerAnimatedStyle}>
        <TextInput
          ref={ref}
          {...textInputProps}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={textInputStyle}
        />
      </Animated.View>
    );
  }
);

// Add display name
PerformanceTextInput.displayName = 'PerformanceTextInput';

const styles = StyleSheet.create({
  inputContainer: {
    height: 48,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: BLUE_FADED,
    overflow: 'hidden',
  },
  textInput: {
    color: ACTION_BLACK,
    padding: 10,
    width: '100%', // Ensure text input takes full width
    flex: 1, // Ensure text input takes full width
  },
});

export default React.memo(PerformanceTextInput);
