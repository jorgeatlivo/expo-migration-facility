import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { ClaimRequest } from '@/services/shifts';
import StyledText from '@/components/StyledText';
import { ReviewRow } from '@/components/profile/ReviewRow';
import { FirstShifterTag } from '@/components/profile/FirstShifterTag';
import { typographyStyles } from '@/styles/livoFonts';
import { SquareProfilePicture } from '@/components/claimReviews/SquareProfileImage';
import FavoriteTag from '@/components/profile/FavoriteTag';
import { commonStyles } from '@/styles/commonStyles';
import { Typography } from '@/components/atoms/Typography';
import { markdown } from '@/utils/markdown';
import { formattedDayMonth, formatTime } from '@/utils/utils';
import { useTranslation } from 'react-i18next';

export interface ProfileHeaderProps {
  claimRequest: ClaimRequest;
  navigateToReviews: (claimRequest: ClaimRequest) => void;
}
export const ProfileHeaderComponent: React.FC<ProfileHeaderProps> = ({
  claimRequest,
  navigateToReviews,
}) => {
  const onboardingShift = claimRequest.onboardingShift;
  const isOnboardingShift = !!onboardingShift;
  const { t } = useTranslation();
  return (
    <View style={commonStyles.spaceBetweenContainer}>
      <View style={commonStyles.row}>
        <SquareProfilePicture
          size={48}
          profilePictureUrl={claimRequest.professionalProfile.profilePictureUrl}
          modality={claimRequest.modality}
        />
        <TouchableOpacity
          style={styles.touchableOpacity}
          disabled={
            claimRequest.professionalProfile.professionalReview
              ?.averageRating === null
          }
          onPress={() => navigateToReviews(claimRequest)}
        >
          <StyledText style={styles.professionalName}>
            {claimRequest.professionalProfile.firstName}{' '}
            {claimRequest.professionalProfile.lastName}
          </StyledText>
          {claimRequest.professionalProfile.favorite ? (
            <FavoriteTag />
          ) : (
            <ReviewRow
              totalReviews={
                claimRequest.professionalProfile.professionalReview
                  ?.totalReviews
              }
              averageRating={
                claimRequest.professionalProfile.professionalReview
                  ?.averageRating
              }
            />
          )}

          {!!isOnboardingShift && (
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
        </TouchableOpacity>
      </View>
      {claimRequest.professionalProfile.firstShifterForFacility ? (
        <FirstShifterTag />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    marginLeft: 6,
  },
  professionalName: {
    ...typographyStyles.heading.small,
  },
});
