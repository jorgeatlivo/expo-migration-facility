import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LivoIcon from '@/assets/icons/LivoIcon';
import { ProfessionalProfile } from '@/services/shifts';
import { BADGE_GRAY, WHITE, YELLOW } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import StyledText from '../StyledText';
import { ProtectedStackRoutes } from '@/router/ProtectedStack';

interface ReviewsCardProps {
  professionalProfile: ProfessionalProfile;
  navigation: any;
  style?: StyleProp<ViewStyle>;
}

export default function ReviewsCard({
  professionalProfile,
  navigation,
  style,
}: ReviewsCardProps) {
  const { t } = useTranslation();

  const { professionalReview } = professionalProfile;
  const displayAverageRating =
    professionalReview.totalReviews && professionalReview.averageRating;

  const navigateToProfessionalReviews = () => {
    navigation.navigate(ProtectedStackRoutes.ProfessionalReviews, {
      reviewInfo: professionalReview,
    });
  };

  return (
    <TouchableOpacity
      style={[styles.cardStyle, style]}
      onPress={() => navigateToProfessionalReviews()}
      disabled={!displayAverageRating}
    >
      <View style={styles.container}>
        <View style={styles.column}>
          <StyledText style={styles.title}>
            {t('total_reviews_title')}
          </StyledText>

          {professionalReview.totalReviews > 1 && (
            <StyledText style={styles.subtitle}>
              {/* <Translation  /> */}
              {t('total_reviews_subtitle', {
                review: professionalReview.totalReviews,
              })}
            </StyledText>
          )}
        </View>

        <View style={styles.ratingContainer}>
          <StyledText
            style={
              displayAverageRating ? styles.ratingText : styles.noReviewsText
            }
          >
            {displayAverageRating
              ? professionalReview.averageRating
              : t('no_reviews_title')}
          </StyledText>

          <LivoIcon
            name={displayAverageRating ? 'star-filled' : 'star'}
            size={24}
            color={YELLOW}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardStyle: {
    padding: SPACE_VALUES.large,
    borderRadius: SPACE_VALUES.small,
    backgroundColor: WHITE,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
  title: {
    ...typographyStyles.subtitle.regular,
  },
  subtitle: {
    ...typographyStyles.body.regular,
    color: BADGE_GRAY,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...typographyStyles.heading.small,
    marginRight: SPACE_VALUES.small,
  },
  noReviewsText: {
    ...typographyStyles.subtitle.regular,
    marginRight: SPACE_VALUES.small,
    color: BADGE_GRAY,
  },
});
