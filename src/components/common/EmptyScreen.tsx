import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import ActionButton from '@/components/buttons/ActionButton';
import StyledText from '@/components/StyledText';

interface EmptyScreenProps {
  onPress: () => void;
  style?: any;
}

export const EmptyScreen: React.FC<EmptyScreenProps> = ({ onPress, style }) => {
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: SPACE_VALUES.medium,
        justifyContent: 'space-between',
        backgroundColor: WHITE,
        ...style,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            paddingVertical: SPACE_VALUES.large,
            marginBottom: SPACE_VALUES.medium,
          }}
        >
          <StyledText
            style={{
              textAlign: 'center',
              fontSize: 76,
            }}
          >
            😢
          </StyledText>
        </View>

        <StyledText
          style={{
            ...typographyStyles.heading.medium,
            marginBottom: SPACE_VALUES.medium,
          }}
        >
          {t('empty_screen_title')}
        </StyledText>
        <StyledText
          style={{
            ...typographyStyles.body.regular,
            marginBottom: SPACE_VALUES.medium,
          }}
        >
          {t('empty_screen_subtitle')}
        </StyledText>
      </View>

      <ActionButton
        title={t('empty_screen_button')}
        onPress={onPress}
        style={{ marginVertical: SPACE_VALUES.medium }}
      />
    </View>
  );
};
