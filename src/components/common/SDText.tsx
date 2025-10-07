import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import StyledText from '@/components/StyledText';

import { SPACE_VALUES } from '@/styles/spacing';
import { TextDTO } from '@/types/widgets';
import { resolveTypographyStyles } from '@/utils/utils';

import { SDIcon } from './SDIcon';

interface SDTextProps extends TextDTO {
  style?: StyleProp<ViewStyle>;
}

export function SDText(props: SDTextProps) {
  return (
    <View style={[styles.row, props.style]}>
      {props.icon && <SDIcon {...props.icon} style={styles.icon} />}
      <View style={styles.column}>
        {props.displayText.split('\n').map((textLine, index) => (
          <StyledText
            key={`${textLine}-${index}`}
            style={[
              {
                color: props.color,
                backgroundColor: props.backgroundColor,
              },
              resolveTypographyStyles(
                props.typographyStyle || 'body',
                props.typographySize || 'regular'
              ),
            ]}
          >
            {textLine}
          </StyledText>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  icon: { marginRight: SPACE_VALUES.tiny },
});
