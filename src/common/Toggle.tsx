import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

import StyledText from '@/components/StyledText';

import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

interface ToggleProps {
  option1: { label: string; value: string };
  option2: { label: string; value: string };
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  unselectedColor: string;
  unselectedTextColor: string;
  selectedColor: string;
  selectedTextColor: string;
  style?: object;
}

export const Toggle: React.FC<ToggleProps> = ({
  option1,
  option2,
  selectedOption,
  setSelectedOption,
  unselectedColor,
  unselectedTextColor,
  selectedColor,
  selectedTextColor,
  style,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [buttonWidth, setButtonWidth] = useState(0);

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: selectedOption === option2.value ? buttonWidth : 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }, [selectedOption, buttonWidth, translateX, option2.value]);

  return (
    <View
      style={[styles.container, { backgroundColor: unselectedColor }, style]}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setButtonWidth(width / 2);
      }}
    >
      <Animated.View
        style={[
          styles.animatedBackground,
          {
            backgroundColor: selectedColor,
            width: buttonWidth,
            transform: [{ translateX }],
          },
        ]}
      />
      <TouchableOpacity
        onPress={() => setSelectedOption(option1.value)}
        style={styles.button}
      >
        <StyledText
          style={{
            ...typographyStyles.action.small,
            color:
              selectedOption === option1.value
                ? selectedTextColor
                : unselectedTextColor,
          }}
        >
          {option1.label}
        </StyledText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setSelectedOption(option2.value)}
        style={styles.button}
      >
        <StyledText
          style={{
            ...typographyStyles.action.small,
            color:
              selectedOption === option2.value
                ? selectedTextColor
                : unselectedTextColor,
          }}
        >
          {option2.label}
        </StyledText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 100,
    position: 'relative',
    overflow: 'hidden',
  },
  animatedBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 100,
  },
  button: {
    flex: 1,
    paddingVertical: SPACE_VALUES.small,
    paddingHorizontal: SPACE_VALUES.medium,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

export default Toggle;
