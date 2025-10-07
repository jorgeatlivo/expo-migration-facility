import React from 'react';
import { View } from 'react-native';

import StyledText from '@/components/StyledText';

import { CAPTION_GRAY } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

import { Category } from '@/types';

interface CategoryTagProps {
  category: Category;
  showLabel?: boolean;
  style?: any;
}

export const CategoryTag: React.FC<CategoryTagProps> = ({
  category,
  showLabel,
  style,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
      }}
    >
      <View
        style={{
          borderRadius: SPACE_VALUES.tiny,
          padding: SPACE_VALUES.tiny,
          borderWidth: 1,
          borderColor: '#848DA9',
          ...style,
        }}
      >
        <StyledText
          style={{
            ...typographyStyles.body.small,
          }}
        >
          {category.acronym}
        </StyledText>
      </View>
      {showLabel && (
        <StyledText
          style={{
            ...typographyStyles.body.regular,
            marginLeft: SPACE_VALUES.small,
            color: CAPTION_GRAY,
          }}
        >
          {category.displayText}
        </StyledText>
      )}
    </View>
  );
};
