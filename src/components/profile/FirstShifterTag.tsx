import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import StyledText from '@/components/StyledText';

import { typographyStyles } from '@/styles/livoFonts';

export const FirstShifterTag = () => {
  const { t } = useTranslation();

  return (
    <View
      style={{
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 6,
        backgroundColor: '#7E58C2', // Content-Content-Bonus-Regular
      }}
    >
      <StyledText
        style={{
          ...typographyStyles.body.small,
          color: '#FFF', //Text-Inverse
        }}
      >
        {t('first_shift')}
      </StyledText>
    </View>
  );
};
