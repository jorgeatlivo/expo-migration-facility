import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Row from '@/components/atoms/Row';
import { shiftTimeInDayLabels } from '@/components/claimReviews/Separators';
import StyledText from '@/components/StyledText';

import { ACTION_BLUE, BORDER_GRAY, WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { formattedMonth, formattedShortMonth } from '@/utils/utils';

import LivoIcon from '@/assets/icons/LivoIcon';
import { ShiftTimeInDayEnum } from '@/types';

interface ProfessionalAgendaHeaderProps {
  date?: string;
  onClickLeft?: () => void;
  onClickRight?: () => void;
  shiftTimeInDay?: ShiftTimeInDayEnum;
}
export const ProfessionalAgendaHeader: React.FC<
  ProfessionalAgendaHeaderProps
> = ({ date, onClickLeft, onClickRight, shiftTimeInDay }) => {
  const { t } = useTranslation();
  return (
    <View
      style={{
        paddingTop: SPACE_VALUES.tiny,
        paddingBottom: SPACE_VALUES.small,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_GRAY,
        backgroundColor: WHITE,
      }}
    >
      <Row alignItems={'center'} justifyContent={'space-between'}>
        <TouchableOpacity
          disabled={!onClickLeft}
          style={{
            padding: SPACE_VALUES.medium,
          }}
          onPress={onClickLeft}
        >
          <LivoIcon
            name="chevron-left"
            size={24}
            color={onClickLeft ? ACTION_BLUE : BORDER_GRAY}
          />
        </TouchableOpacity>
        {date && shiftTimeInDay ? (
          <View
            style={{
              flex: 1,
            }}
          >
            <StyledText
              style={{
                ...typographyStyles.info.caption,
                textAlign: 'center',
              }}
            >
              {formattedMonth(date)}
            </StyledText>
            <StyledText
              style={{
                ...typographyStyles.heading.small,
                textAlign: 'center',
              }}
            >
              <StyledText
                style={{
                  ...typographyStyles.heading.small,
                  color:
                    shiftTimeInDayLabels[
                      shiftTimeInDay as keyof typeof shiftTimeInDayLabels
                    ].textColor,
                }}
              >
                {t(
                  shiftTimeInDayLabels[
                    shiftTimeInDay as keyof typeof shiftTimeInDayLabels
                  ].label as any
                )}
              </StyledText>
              &nbsp;{t('of_label')} {formattedShortMonth(date)}
            </StyledText>
          </View>
        ) : null}
        <TouchableOpacity
          disabled={!onClickRight}
          style={{
            padding: SPACE_VALUES.medium,
          }}
          onPress={onClickRight}
        >
          <LivoIcon
            name="chevron-right"
            size={24}
            color={onClickRight ? ACTION_BLUE : BORDER_GRAY}
          />
        </TouchableOpacity>
      </Row>
    </View>
  );
};
