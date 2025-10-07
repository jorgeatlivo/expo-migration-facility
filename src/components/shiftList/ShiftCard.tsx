import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import Col from '@/components/atoms/Col';
import Row from '@/components/atoms/Row';
import { TouchableWrapper } from '@/components/buttons/TouchableWrapper';
import { shiftTimeInDayLabels } from '@/components/claimReviews/Separators';
import { TagComponent } from '@/components/profile/TagComponent';
import StyledText from '@/components/StyledText';
import { CategoryTag } from '@/components/shiftDetails/CategoryTag';

import { useFetchFacility } from '@/hooks/useFetchFacility';
import { WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

import LivoIcon from '@/assets/icons/LivoIcon';
import { formatDate } from '@/common/utils';
import { Shift, ShiftModalityEnum, UserFeatureEnum } from '@/types';
import { CapacityComponent } from './CapacityComponent';
import { ModalityTag } from './ModalityTag';
import { ScheduleComponent } from './ScheduleComponent';
import { ShiftCardTag } from './ShiftCardTag';

interface ShiftCardProps {
  shift: Shift;
  navigateToShiftDetailsForShiftId: (facilityShiftId: number) => void;
}

export const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  navigateToShiftDetailsForShiftId,
}) => {
  const { data: facilityProfile } = useFetchFacility();
  const areNewFieldsAndUnitsActive = useMemo(
    () =>
      facilityProfile?.userFeatures.includes(
        UserFeatureEnum.SHIFT_UNIT_AND_PROFESSIONAL_FIELDS
      ),
    [facilityProfile?.userFeatures]
  );

  function getShiftTitle(unit: string, professionalField?: string): string {
    return !!unit && !!professionalField
      ? `${unit} · ${professionalField}`
      : (professionalField ?? unit);
  }

  const { livoPoolOnboarded, livoInternalOnboarded } = facilityProfile || {};
  const poolAndInternalOnboarded =
    !!livoPoolOnboarded && !!livoInternalOnboarded;

  const isPendingApproval = shift?.onboarding?.status === 'PENDING_APPROVAL';
  const timeColor = shiftTimeInDayLabels[shift.shiftTimeInDay].color;

  return (
    <TouchableWrapper
      onPress={() => navigateToShiftDetailsForShiftId(shift.id)}
      style={[styles.touchableOpacity, isPendingApproval && styles.opaque]}
    >
      <Row>
        {shift.shiftTimeInDay ? (
          <View style={[styles.colorBand, { backgroundColor: timeColor }]} />
        ) : null}

        <Col flex={1} gap={SPACE_VALUES.small} style={styles.cardBody}>
          <Row alignItems={'flex-start'} justifyContent={'space-between'}>
            <Col gap={SPACE_VALUES.tiny}>
              <Row flex={1} gap={SPACE_VALUES.tiny}>
                {shift.category ? (
                  <CategoryTag category={shift.category} />
                ) : null}
                {shift.internalVisible && poolAndInternalOnboarded ? (
                  <ModalityTag
                    shortTag={true}
                    modality={ShiftModalityEnum.INTERNAL}
                  />
                ) : null}
                {shift.externalVisible && poolAndInternalOnboarded ? (
                  <ModalityTag
                    shortTag={true}
                    modality={ShiftModalityEnum.EXTERNAL}
                  />
                ) : null}
                {shift.onboarding && (
                  <LivoIcon name="onboarding-shift" size={24} color="#7E58C2" />
                )}
              </Row>

              <StyledText style={typographyStyles.heading.small}>
                {/* TODO  - simplify upon finishing migration to units and fields */}
                {areNewFieldsAndUnitsActive
                  ? getShiftTitle(
                      shift.unit ?? '',
                      shift.professionalField?.displayText
                    )
                  : shift.title}
              </StyledText>
            </Col>
            <ShiftCardTag
              totalPendingClaims={
                shift.totalPendingClaims + shift.totalCancellationRequests
              }
              isFilled={
                shift.totalAcceptedClaims === shift.capacity &&
                shift.totalCancellationRequests === 0
              }
            />
          </Row>
          {areNewFieldsAndUnitsActive ? (
            <StyledText style={typographyStyles.body.regular}>
              {formatDate(new Date(shift.startTime), true)}
            </StyledText>
          ) : (
            <Row wrap flexShrink={1} justifyContent={'flex-start'}>
              <Row gap={SPACE_VALUES.tiny}>
                {shift.skills.map((skill) => (
                  <TagComponent key={skill.value} text={skill.displayText} />
                ))}
              </Row>
            </Row>
          )}
          <Row justifyContent={'space-between'} alignItems={'center'}>
            <ScheduleComponent
              startTime={shift.startTime}
              finishTime={shift.finishTime}
            />
            <CapacityComponent
              acceptedClaims={shift.totalAcceptedClaims}
              pendingInvitationClaims={shift.totalPendingInvitationClaims}
              capacity={shift.capacity}
            />
          </Row>
        </Col>
      </Row>
    </TouchableWrapper>
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    overflow: 'hidden',
    borderRadius: SPACE_VALUES.small,
    marginBottom: SPACE_VALUES.small,
    backgroundColor: WHITE,
  },
  opaque: {
    opacity: 0.5,
  },
  colorBand: {
    width: SPACE_VALUES.small,
    flexGrow: 0,
  },
  cardBody: {
    padding: SPACE_VALUES.small,
  },
});
