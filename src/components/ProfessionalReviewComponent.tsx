import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Icon from 'react-native-vector-icons/FontAwesome'; // Adjust this import based on your icon library

import { ProfessionalReview, ReviewFeedback } from '@/services/shifts';

import { LIGHT_GRAY, YELLOW } from '@/styles/colors';
import { fontSize, fontWeight, LayoutTextEnum } from '@/styles/fonts';

import StyledText from './StyledText';

export const ProfessionalReviewComponent = ({
  review,
}: {
  review: ProfessionalReview;
}) => {
  const { t } = useTranslation();

  const reviewInfo = (reviewFeedback: ReviewFeedback) => (
    <>
      <StyledText
        type={LayoutTextEnum.headerSmall}
        style={styles.reviewComponentGeneralRating}
      >
        <Icon name="star" size={15} color={YELLOW} />
        &nbsp;
        {reviewFeedback.generalRating.toFixed(1)}{' '}
        {t('shift_list_general_label')}
      </StyledText>
    </>
  );

  return (
    <View style={styles.reviewComponent}>
      <View style={styles.reviewComponentHeader}>
        <StyledText type={LayoutTextEnum.header}>
          {review.facilityName}
        </StyledText>
        <StyledText
          type={LayoutTextEnum.subHeader}
          style={styles.monthYearText}
        >
          {review.month} {review.year}
        </StyledText>
      </View>
      <StyledText
        type={LayoutTextEnum.subHeader}
        style={styles.specializationSubHeader}
      >
        {review.specialization?.displayText ??
          review.specialization.translations.es}
      </StyledText>
      {reviewInfo(review.review)}
    </View>
  );
};

const styles = StyleSheet.create({
  reviewComponent: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: LIGHT_GRAY,
    marginBottom: 20,
  },
  reviewComponentHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  monthYearText: {
    opacity: 0.5,
    fontSize: fontSize.medium,
    alignSelf: 'flex-start',
  },
  specializationSubHeader: {
    marginBottom: 10,
    opacity: 0.5,
  },
  reviewComponentRatings: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  reviewComponentGeneralRating: {
    marginBottom: 10,
    fontFamily: fontWeight.regular,
  },
  reviewComponentBreakDown: {},
  breakDownText: {
    marginBottom: 5,
    fontSize: fontSize.medium,
  },
  onlyVisibleForYouText: {
    fontSize: fontSize.small,
    marginBottom: 5,
    opacity: 0.5,
  },
  collapsibleIcon: {
    marginTop: 3.5,
  },
});
