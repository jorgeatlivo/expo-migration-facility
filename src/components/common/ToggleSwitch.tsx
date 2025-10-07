import { useEffect, useRef } from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import Row from '@/components/atoms/Row';
import StyledText from '@/components/StyledText';

import { BLUE_FADED, WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

interface ToggleSwitchProps {
  description?: string;
  isOn?: boolean;
  onToggle: (isOn: boolean) => void;
  style?: StyleProp<ViewStyle>;
  hide?: boolean;
}

export default function ToggleSwitch({
  description,
  isOn = true,
  onToggle,
  style,
  hide = false,
}: ToggleSwitchProps) {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Whenever isOn changes, update the animation to reflect the change
    Animated.timing(animation, {
      toValue: isOn ? 16 : 0, // Move the circle based on the toggle
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  // Handle toggle
  const toggleSwitch = () => {
    onToggle(!isOn);
  };

  // Interpolate background color from gray to blue
  const backgroundColor = animation.interpolate({
    inputRange: [0, 16],
    outputRange: ['#E3E6EC', '#149EF2'],
  });

  return hide ? null : (
    <Row alignItems={'center'} style={style}>
      <TouchableOpacity onPress={toggleSwitch}>
        <Animated.View style={[styles.toggle, { backgroundColor }]}>
          <Animated.View
            style={[styles.circle, { transform: [{ translateX: animation }] }]}
          />
        </Animated.View>
      </TouchableOpacity>
      {description && (
        <StyledText style={styles.text}>{description}</StyledText>
      )}
    </Row>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggle: {
    width: 36,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    padding: 2,
  },
  circle: {
    backgroundColor: WHITE,
    width: SPACE_VALUES.large,
    height: SPACE_VALUES.large,
    borderRadius: SPACE_VALUES.small,
  },
  text: {
    ...typographyStyles.info.caption,
    marginLeft: SPACE_VALUES.small,
    color: BLUE_FADED,
  },
});
