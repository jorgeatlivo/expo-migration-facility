import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { SlotReason } from '@/services/shifts';

import StyledText from '@/components/StyledText';

import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

import LivoIcon from '@/assets/icons/LivoIcon';

interface SlotReasonComponentProps {
  reason: SlotReason | null;
  professionalName: string;
  style?: object;
  onPress: () => void;
}

export const SlotReasonComponent: React.FC<SlotReasonComponentProps> = ({
  reason,
  professionalName,
  style,
  onPress,
}) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...style,
      }}
    >
      <StyledText
        style={{
          ...typographyStyles.body.small,
        }}
      >
        {professionalName}
      </StyledText>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: SPACE_VALUES.tiny,
          }}
        >
          <LivoIcon name="replace" size={24} color="#ACBBCB" />
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          {reason ? (
            <View style={{}}>
              <StyledText
                style={{
                  ...typographyStyles.subtitle.regular,
                }}
              >
                {reason.displayText}
              </StyledText>
              <StyledText
                style={{
                  ...typographyStyles.info.caption,
                  color: '#707A91',
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {reason.comment || ' '}
              </StyledText>
            </View>
          ) : (
            <View style={{}}>
              <StyledText
                style={{
                  ...typographyStyles.subtitle.regular,
                  color: '#ACBBCB',
                }}
              >
                {t('shift_detail_empty_slot_reason')}
              </StyledText>
              <StyledText
                style={{
                  ...typographyStyles.info.caption,
                  color: '#ACBBCB',
                }}
              >
                {' '}
              </StyledText>
            </View>
          )}
        </View>

        <LivoIcon name="chevron-right" size={24} color={'#616673'} />
      </View>
    </TouchableOpacity>
  );
};
