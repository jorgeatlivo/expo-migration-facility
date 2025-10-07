import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import StyledText from '@/components/StyledText';

import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

interface DetailsComponentProps {
  details: string;
}

export const DetailsComponent: React.FC<DetailsComponentProps> = ({
  details,
}) => {
  const { t } = useTranslation();

  return (
    <View
      style={{
        padding: SPACE_VALUES.medium,
      }}
    >
      <StyledText
        style={{
          ...typographyStyles.heading.small,
          marginBottom: SPACE_VALUES.medium,
        }}
      >
        {t('shift_detail_detail_label')}
      </StyledText>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <StyledText
          style={{
            ...typographyStyles.body.regular,
          }}
        >
          {details}
        </StyledText>
      </View>
    </View>
  );
};
