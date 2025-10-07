import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import StyledText from '@/components/StyledText';;

interface InformationRowProps {
  label: string;
  value: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const InformationRow: React.FC<InformationRowProps> = ({
  label,
  value,
  onPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <StyledText
          style={{
            ...typographyStyles.body.regular,
            color: '#707A91', //Text-Sutle
          }}
        >
          {label}
        </StyledText>
      </View>
      <StyledText
        onPress={onPress}
        style={{
          ...typographyStyles.subtitle.regular,
          color: onPress ? '#149EF2' : undefined,
        }}
      >
        {value}
      </StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACE_VALUES.small,
    alignItems: 'center',
  },
});
