import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';

import { WHITE, YELLOW } from '@/styles/colors';
import { fontSize, LayoutTextEnum } from '@/styles/fonts';

import LivoIcon from '@/assets/icons/LivoIcon';
import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack.types';
import { ProfessionalReviewComponent } from './ProfessionalReviewComponent';
import StyledText from './StyledText';

type ProfessionalReviewsScreenProps = StackScreenProps<
  ProtectedStackParamsList,
  ProtectedStackRoutes.ProfessionalReviews
>;

export const ProfessionalReviewsScreen: React.FC<
  ProfessionalReviewsScreenProps
> = ({ route }) => {
  const { reviewInfo } = route.params;
  const { t } = useTranslation();

  const summaryComponent = (
    <View style={styles.summary}>
      <StyledText type={LayoutTextEnum.header} style={styles.summaryText}>
        {t('shift_list_summary_label')}
      </StyledText>
      {reviewInfo?.averageRating ? (
        <StyledText type={LayoutTextEnum.header} style={styles.headerText}>
          <LivoIcon name="star" size={20} color={YELLOW} />
          &nbsp;{reviewInfo.averageRating.toFixed(1)}&nbsp;
          <StyledText type={LayoutTextEnum.subHeader}>
            ({reviewInfo.totalReviews} {t('shift_list_reviews_label')})
          </StyledText>
        </StyledText>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={reviewInfo.reviews}
          renderItem={({ item }) => (
            <ProfessionalReviewComponent review={item} />
          )}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={summaryComponent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  summary: {
    marginBottom: 20,
  },
  summaryText: {
    marginBottom: 15,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
  },
  headerText: {
    fontSize: fontSize.biggest,
    lineHeight: 30,
    marginBottom: 10,
  },
  summaryBreakdownContainer: {
    marginLeft: 20,
  },
  breakDownSummaryText: {
    marginBottom: 10,
  },
});
