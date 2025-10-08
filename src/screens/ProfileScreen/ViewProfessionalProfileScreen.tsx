import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';

import AnalyticsService from '@/services/analytics/analytics.service';
import { AnalyticEvents } from '@/services/analytics/events';

import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ProfileComponent } from '@/components/profile/ProfileComponent';

import { useFetchProfessionalProfile } from '@/hooks/useFetchProfessionalProfile';
import { LIGHT_GRAY, WHITE } from '@/styles/colors';
import { SPACE_VALUES } from '@/styles/spacing';

import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack.types';
import { RootState } from '@/types';

type ProfessionalProfileScreenProps = StackScreenProps<
  ProtectedStackParamsList,
  ProtectedStackRoutes.ViewProfessionalProfile
>;

export const ViewProfessionalProfileScreen: React.FC<
  ProfessionalProfileScreenProps
> = ({ navigation, route }) => {
  const { professionalId, note, source } = route.params;
  const { facilityProfile } = useSelector(
    (state: RootState) => state.profileData
  );
  const {
    data: professionalProfile,
    isLoading,
    isRefetching,
    refetch,
  } = useFetchProfessionalProfile(professionalId);

  const navigateToCV = () => {
    if (!!professionalProfile?.professionalCV) {
      if (
        source === ProtectedStackRoutes.PublishShift ||
        source === ProtectedStackRoutes.EditShift
      ) {
        AnalyticsService.trackEvent(
          AnalyticEvents.ASSIGN_CANDIDATES_OPEN_SEE_CV,
          {
            professionalId,
          }
        );
      }
      navigation.navigate(ProtectedStackRoutes.PdfViewer, {
        uri: professionalProfile.professionalCV,
      });
    }
  };

  const navigateToProfessionalReviews = () => {
    if (professionalProfile?.professionalReview) {
      navigation.navigate(ProtectedStackRoutes.ProfessionalReviews, {
        reviewInfo: professionalProfile.professionalReview,
      });
    }
  };

  const navigateToLivoCV = () => {
    if (
      source === ProtectedStackRoutes.PublishShift ||
      source === ProtectedStackRoutes.EditShift
    ) {
      AnalyticsService.trackEvent(
        AnalyticEvents.ASSIGN_CANDIDATES_OPEN_SEE_CV,
        {
          professionalId,
        }
      );
    }
    navigation.navigate(ProtectedStackRoutes.LivoCV, {
      professionalId: professionalId,
    });
  };

  const insets = useSafeAreaInsets();
  return isLoading || !professionalProfile || isRefetching ? (
    <View style={styles.loading}>
      <LoadingScreen />
    </View>
  ) : (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <ProfileComponent
          modality={professionalProfile.modality ?? null}
          facilityProfile={facilityProfile}
          professionalProfile={professionalProfile}
          navigateToReviews={navigateToProfessionalReviews}
          navigateToCV={navigateToCV}
          navigateToLivoCV={navigateToLivoCV}
          navigation={navigation}
          note={note}
          source={source}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: WHITE,
  },
  screen: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
    padding: SPACE_VALUES.large,
    justifyContent: 'space-between',
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: SPACE_VALUES.xLarge,
  },
  actions: {
    padding: SPACE_VALUES.medium,
  },
});
