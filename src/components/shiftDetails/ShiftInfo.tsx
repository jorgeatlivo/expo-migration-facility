import React, { PropsWithChildren, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { IconHeartHandshake } from 'tabler-icons-react-native';

import Col from '@/components/atoms/Col';
import Row from '@/components/atoms/Row';
import { Typography } from '@/components/atoms/Typography';
import { shiftTimeInDayLabels } from '@/components/claimReviews/Separators';
import { TagComponent } from '@/components/profile/TagComponent';
import StyledText from '@/components/StyledText';

import { useFetchFacility } from '@/hooks/useFetchFacility';
import { ACTION_BLACK, BADGE_GRAY, PURPLE_FADED, WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { formattedSchedule } from '@/utils/utils';

import { formatDate } from '@/common/utils';
import { Category, Shift, UserFeatureEnum } from '@/types';
import { CategoryTag } from './CategoryTag';
import { ShiftInfoRow } from './ShiftInfoRow';

interface ShiftInfoProps {
  shift: Shift;
}

function SkillTags({ shift }: { shift: Shift }) {
  return (
    <Row
      wrap
      flexShrink={1}
      justifyContent={'flex-start'}
      gap={SPACE_VALUES.tiny}
      style={styles.skills}
    >
      {shift.skills.map((skill) => {
        return <TagComponent key={skill.value} text={skill.displayText} />;
      })}
    </Row>
  );
}

const CategoryTagRow = ({
  category,
  children,
}: PropsWithChildren<{ category: Category }>) => (
  <Row
    flex={1}
    alignItems={'center'}
    justifyContent={'space-between'}
    gap={SPACE_VALUES.small}
  >
    {children}
    {category && <CategoryTag category={category} />}
  </Row>
);

export const ShiftInfo: React.FC<ShiftInfoProps> = ({ shift }) => {
  const { t } = useTranslation();
  const { data: facilityProfile } = useFetchFacility();

  const areNewFieldsAndUnitsActive = useMemo(
    () =>
      facilityProfile?.userFeatures.includes(
        UserFeatureEnum.SHIFT_UNIT_AND_PROFESSIONAL_FIELDS
      ),
    [facilityProfile?.userFeatures]
  );

  return (
    <Col gap={SPACE_VALUES.tiny} style={styles.container}>
      <Col fullWidth alignItems={'flex-start'}>
        {!areNewFieldsAndUnitsActive && (
          <CategoryTagRow category={shift.category}>
            <StyledText style={styles.titleTextStyle}>{shift.title}</StyledText>
          </CategoryTagRow>
        )}
        {!areNewFieldsAndUnitsActive && <SkillTags shift={shift} />}
        {!!shift.onboarding && (
          <Row gap={SPACE_VALUES.tiny} style={styles.onboardingChip}>
            <IconHeartHandshake size={16} color="#7E58C2" />
            <Typography variant="info/caption" color={'#7E58C2'}>
              {'Onboarding'}
            </Typography>
          </Row>
        )}
      </Col>
      {areNewFieldsAndUnitsActive && (
        <>
          {!!shift.unit && (
            <CategoryTagRow category={shift.category}>
              <ShiftInfoRow
                label={shift.unit}
                icon={'patient-in-bed'}
                overline={
                  shift.unitVisible
                    ? undefined
                    : t('shift_detail_non_visible_label')
                }
              />
            </CategoryTagRow>
          )}
          {!!shift.professionalField &&
            (shift.unit ? (
              <ShiftInfoRow
                label={shift.professionalField.displayText}
                icon={'heartbeat'}
              />
            ) : (
              <CategoryTagRow category={shift.category}>
                <ShiftInfoRow
                  label={shift.professionalField.displayText}
                  icon={'heartbeat'}
                />
              </CategoryTagRow>
            ))}
          <Row>
            <ShiftInfoRow
              label={formatDate(new Date(shift?.startTime), true)}
              icon={'calendar'}
            />

            {shift.holiday && (
              <TagComponent
                text={t('common_holiday')}
                color={'#52377C'}
                backgroundColor={WHITE}
              />
            )}
          </Row>
        </>
      )}
      <ShiftInfoRow
        label={formattedSchedule(shift.startTime, shift.finishTime)}
        icon={shiftTimeInDayLabels[shift.shiftTimeInDay].iconName}
        iconColor={shiftTimeInDayLabels[shift.shiftTimeInDay].color}
      />

      {shift.totalPay && shift.externalVisible && (
        <View>
          <ShiftInfoRow
            icon={'coins'}
            label={`${shift.totalPay} €`}
            overline={
              shift.livoInternalOnboarded
                ? t('shift_detail_only_livo_pool')
                : undefined
            }
          />
          {shift.onboardingShiftsRequired && shift.onboardingShiftsPrice && (
            <Typography
              variant="body/small"
              style={styles.onboardingPriceText}
              color={BADGE_GRAY}
            >
              {t('onboarding_price', { price: shift.onboardingShiftsPrice })}
            </Typography>
          )}
        </View>
      )}

      {!!shift.compensationOptions &&
        shift.compensationOptions.length > 0 &&
        shift.internalVisible && (
          <ShiftInfoRow
            label={shift.compensationOptions
              .map((compensation) => compensation.displayText)
              .join(', ')}
            icon={'money'}
            style={{
              alignItems: 'flex-start',
            }}
          />
        )}

      {shift.onboardingShiftsRequired && (
        <ShiftInfoRow
          label={t('onboarding_shift_required')}
          icon={'onboarding-shift'}
          iconColor={'#7E58C2'}
        />
      )}
    </Col>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACE_VALUES.medium,
  },
  headerRow: {
    marginBottom: SPACE_VALUES.small,
  },
  titleTextStyle: {
    flex: 1,
    ...typographyStyles.heading.medium,
    color: ACTION_BLACK,
  },
  skills: {
    marginBottom: SPACE_VALUES.small,
  },
  onboardingPriceText: {
    marginLeft: 28,
  },
  onboardingChip: {
    borderRadius: 4,
    alignSelf: 'flex-start',
    backgroundColor: PURPLE_FADED,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
});
