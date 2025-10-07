import React, { useCallback, useEffect, useRef } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ACTION_BLUE, BADGE_GRAY, DARK_GRAY } from '@/styles/colors';

import LivoIcon from '@/assets/icons/LivoIcon';

interface CustomCheckBoxProps {
  option: string;
  partial?: boolean;
  type?: 'checkbox' | 'radiobox';
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  checked: boolean;
  onPress: (nextChecked: boolean) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  rowStyle?: StyleProp<ViewStyle>;
  singleSelect?: boolean;
}

const animationTime = 200;

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({
                                                         option,
                                                         onPress,
                                                         checked,
                                                         disabled,
                                                         partial,
                                                         type = 'radiobox',
                                                         style,

                                                         textStyle,
                                                         rowStyle,
                                                         singleSelect,
                                                       }) => {
  const scale = useSharedValue(1);
  const progress = useSharedValue(checked ? 1 : 0);
  const lastCheckWasPartial = useRef<string>(type);

  useEffect(() => {
    scale.value = withSpring(0.92, { stiffness: 200, damping: 10 }, () => {
      scale.value = withSpring(1);
    });

    progress.value = withTiming(checked || partial ? 1 : 0, {
      duration: animationTime,
    });
  }, [checked, partial]);

  const toggle = useCallback(() => {
    if (!disabled) {
      runOnJS(onPress)(!checked);
    }
  }, [checked, onPress, disabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const uncheckedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  if (checked || partial) {
    // needed to ensure it doesnt default to type when unchecking while partial
    lastCheckWasPartial.current = partial ? 'partial' : type;
  }

  return (
      <Pressable onPress={toggle} style={style} disabled={disabled}>
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
          <Animated.View style={[StyleSheet.absoluteFill, checkedStyle]}>
            <LivoIcon
                size={24}
                name={`${lastCheckWasPartial.current}-checked`}
                color={disabled ? DARK_GRAY : ACTION_BLUE}
            />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, uncheckedStyle]}>
            <LivoIcon
                size={24}
                name={`${type}-unchecked`}
                color={disabled ? DARK_GRAY : BADGE_GRAY}
            />
          </Animated.View>
        </Animated.View>
      </Pressable>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
  },
});

export default CustomCheckBox;
