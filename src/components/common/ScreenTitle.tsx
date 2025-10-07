import React, {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import StyledText from '@/components/StyledText';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

interface ScreenTitleProps {
  title: string;
  children?: ReactNode;
  style?: object;
  textStyle?: object;
}

const ScreenTitle: React.FC<ScreenTitleProps> = ({
  title,
  children,
  style,
  textStyle
}) => {
  return (
    <View style={{...styles.container, ...style}}>
      <StyledText
        style={{...typographyStyles.heading.medium, ...textStyle}}
        >{title}</StyledText>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACE_VALUES.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACE_VALUES.medium,
    paddingTop: SPACE_VALUES.large,
  },
});

export default ScreenTitle;
