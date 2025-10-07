import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { IconChevronRight } from 'tabler-icons-react-native';

import { ClaimRequest, ShiftClaimStatus } from '@/services/shifts';

import { Typography } from '@/components/atoms/Typography';
import Countdown from '@/components/Countdown';
import { SquareProfilePicture } from '@/components/claimReviews/SquareProfileImage';
import FavoriteTag from '@/components/profile/FavoriteTag';
import { FirstShifterTag } from '@/components/profile/FirstShifterTag';
import { ReviewRow } from '@/components/profile/ReviewRow';
import { TagComponent } from '@/components/profile/TagComponent';

import { SPACE_VALUES } from '@/styles/spacing';
import { markdown } from '@/utils/markdown';
import { formatTime, formattedDayMonth } from '@/utils/utils';

import LivoIcon from '@/assets/icons/LivoIcon';
import { ShiftModalityEnum } from '@/types';

interface ProfessionalClaimRowProps {
  request: ClaimRequest;
  onPress: () => void;
}

const InvitationIconsByStatus: Record<
  string,
  {
    name: string;
    color: string;
  }
> = {
  [ShiftClaimStatus.PENDING_PRO_ACCEPT]: {
    name: 'pending-invitation',
    color: '#EFB300',
  },
  [ShiftClaimStatus.INVITATION_EXPIRED]: {
    name: 'pending-invitation',
    color: '#848DA9',
  },
  [ShiftClaimStatus.REJECTED_BY_PRO]: {
    name: 'rejected-invitation',
    color: '#FA3D3B',
  },
  [ShiftClaimStatus.PRO_NOT_AVAILABLE]: {
    name: 'pro-not-available-invitation',
    color: '#848DA9',
  },
};

export const ProfessionalClaimRow: React.FC<ProfessionalClaimRowProps> = ({
  request,
  onPress,
}) => {
  const { t } = useTranslation();
  const {
    professionalProfile,
    modality,
    compensationOption,
    cancellationRequest,
    onboardingShift,
  } = request ?? {};
  const isOnboardingShift = !!onboardingShift;
  const {
    profilePictureUrl,
    firstName,
    lastName,
    firstShifterForFacility,
    professionalReview,
    favorite,
  } = professionalProfile ?? {};
  const totalTags = professionalProfile?.tags?.length || 0;
  const visibleTags = professionalProfile?.tags?.slice(0, 6) || [];
  const hasMoreTags = totalTags > 6;
  const invitationIcon = InvitationIconsByStatus[request.status];

  return (
    <Pressable onPress={onPress}>
      <View style={styles.outerContainer}>
        <View style={styles.profileInfoContainer}>
          <SquareProfilePicture
            size={48}
            profilePictureUrl={profilePictureUrl}
            modality={modality}
          />
          <View style={styles.textAndTagsContainer}>
            <Typography
              variant="heading/small"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {firstName} {lastName}
            </Typography>

            {/* tags */}
            <View style={styles.tagsContainer}>
              {!!firstShifterForFacility && (
                <View style={styles.tagItem}>
                  <FirstShifterTag />
                </View>
              )}

              {visibleTags.map((tag) => {
                return (
                  <TagComponent
                    key={`visible-tag-${tag.label}`}
                    text={tag.label}
                    backgroundColor={
                      tag.styling?.backgroundColor
                        ? tag.styling.backgroundColor
                        : undefined
                    }
                    color={
                      tag.styling?.textColor ? tag.styling.textColor : undefined
                    }
                    style={styles.tagItem}
                  />
                );
              })}

              {hasMoreTags && (
                <Typography variant="info/caption" style={styles.moreTagsText}>
                  ...
                </Typography>
              )}
            </View>

            {modality === ShiftModalityEnum.INTERNAL &&
              !!compensationOption?.label && (
                <View style={styles.compensationContainer}>
                  <Typography
                    variant="info/caption"
                    style={styles.compensationText}
                  >
                    {compensationOption.label}:{' '}
                    {compensationOption.compensationValue}
                  </Typography>
                </View>
              )}

            {!!favorite && <FavoriteTag />}

            {professionalReview && (
              <ReviewRow
                totalReviews={professionalReview.totalReviews}
                averageRating={professionalReview.averageRating}
              />
            )}

            {isOnboardingShift && (
              <Typography variant="body/small">
                {markdown(
                  t('onboarding_shift_time', {
                    day: formattedDayMonth(onboardingShift.startTime),
                    startTime: formatTime(onboardingShift.startTime),
                    endTime: formatTime(onboardingShift.finishTime),
                  })
                )}
              </Typography>
            )}

            {!!request.invitationExpirationTime &&
              request.status === ShiftClaimStatus.PENDING_PRO_ACCEPT && (
                <View style={[styles.row, { marginTop: SPACE_VALUES.tiny }]}>
                  <Typography variant="subtitle/small">
                    Tiempo restante
                  </Typography>
                  <Countdown
                    date={request.invitationExpirationTime}
                    style={styles.invitationExpirationTime}
                  />
                </View>
              )}
          </View>

          {!!cancellationRequest && (
            <View style={styles.cancellationIconContainer}>
              <LivoIcon
                name="exclamation-circle-filled"
                color="#FF5A59"
                size={24}
              />
            </View>
          )}
        </View>
        <View style={styles.row}>
          {!!invitationIcon && (
            <LivoIcon
              name={invitationIcon.name}
              size={24}
              color={invitationIcon.color}
            />
          )}
          <IconChevronRight size={24} color={'#616673'} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  textAndTagsContainer: {
    marginLeft: SPACE_VALUES.medium,
    marginRight: SPACE_VALUES.medium,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexShrink: 1,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: -SPACE_VALUES.tiny,
    overflow: 'scroll',
  },
  tagItem: {
    marginRight: SPACE_VALUES.tiny,
    marginBottom: SPACE_VALUES.tiny,
  },
  moreTagsText: {
    marginRight: SPACE_VALUES.tiny,
    flexShrink: 1,
    alignSelf: 'flex-end',
  },
  compensationContainer: {
    flex: 1,
  },
  compensationText: {
    marginRight: SPACE_VALUES.tiny,
    flexShrink: 1,
    color: '#848DA9',
  },
  reviewContainer: {
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancellationIconContainer: {
    marginRight: SPACE_VALUES.tiny,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  invitationExpirationTime: {
    marginLeft: SPACE_VALUES.tiny,
  },
});
