import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { IconStarFilled } from 'tabler-icons-react-native';

import { Typography } from '@/components/atoms/Typography';

interface ReviewRowProps {
  totalReviews: number;
  averageRating: number | null;
}
export const ReviewRow: React.FC<ReviewRowProps> = ({
  totalReviews,
  averageRating,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {!!totalReviews && (
        <View style={styles.container}>
          <IconStarFilled size={12} color="#FFCE1F" />
          <Typography variant="subtitle/small">{averageRating}</Typography>
          <Typography variant="info/caption" color={'#5B6478'}>
            {t('review_label', {
              count: totalReviews,
            })}
          </Typography>
        </View>
      )}

      {!totalReviews && (
        <Typography variant="info/caption" color={'#5B6478'}>
          {t('no_review_label')}
        </Typography>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
