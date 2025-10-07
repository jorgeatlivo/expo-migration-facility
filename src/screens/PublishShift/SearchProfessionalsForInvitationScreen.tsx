import React, { useState } from 'react';
import { SearchProfessionals } from '@/components/widgets/professionals/SearchProfessionals';
import { useTranslation } from 'react-i18next';
import { renderProfessionalProfileCardByOverviewDTO } from '@/components/widgets/professionals/ProfessionalProfileCard';
import { useSearchProfessionalsForShiftInvitations } from '@/hooks/useSearchProfessionalsForShiftInvitation';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CommonButton from '@/components/buttons/CommonButton';
import { ACTION_BLUE, BACKGROUND_BLUE, WHITE } from '@/styles/colors';
import { SPACE_VALUES } from '@/styles/spacing';
import { ProfessionalOverviewDTO } from '@/types/professionals';
import AnalyticsService from '@/services/analytics/analytics.service';
import { AnalyticEvents } from '@/services/analytics/events';

type SearchProfessionalsForShiftInvitationScreenProps = StackScreenProps<
  ProtectedStackParamsList,
  ProtectedStackRoutes.SearchProfessionalForShiftInvitation
>;

export const SearchProfessionalsForShiftInvitationScreen = ({
  navigation,
  route,
}: SearchProfessionalsForShiftInvitationScreenProps) => {
  const { t } = useTranslation();
  const { shiftConfig, selectedProfessionalIds, onSelectPro, source } =
    route.params;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPro, setSelectedPro] = useState<
    ProfessionalOverviewDTO | undefined
  >();

  const { professionals, isFetching, fetchNextPage, hasNextPage } =
    useSearchProfessionalsForShiftInvitations(
      shiftConfig,
      searchTerm,
      selectedProfessionalIds
    );

  const onAddProfessional = () => {
    onSelectPro(selectedPro);
    navigation.goBack();
  };

  const onChangeSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const onClearSearch = () => {
    setSearchTerm('');
  };

  const onLoadNextPage = () => {
    if (isFetching || !hasNextPage) {
      return;
    }
    fetchNextPage();
  };

  const onViewProfessionalProfile = (
    professionalId: number,
    note?: string | null
  ) => {
    AnalyticsService.trackEvent(
      AnalyticEvents.ASSIGN_CANDIDATES_OPEN_SEE_MORE,
      {
        professionalId,
      }
    );
    navigation.navigate(ProtectedStackRoutes.ViewProfessionalProfile, {
      professionalId,
      note,
      source,
    });
  };

  if (!Array.isArray(professionals)) {
    return <LoadingScreen />;
  }

  return (
    <SearchProfessionals
      professionals={professionals}
      emptyListMessage={t(
        'search_professionals_for_invitation_empty_list_placeholder'
      )}
      searchTerm={searchTerm}
      onSearchChange={onChangeSearch}
      onClearSearch={onClearSearch}
      onLoadNextPage={onLoadNextPage}
      isLoadingNextPage={isFetching}
      renderProfessionalCard={(pro) => {
        const proOverview = pro as ProfessionalOverviewDTO;
        return (
          <TouchableOpacity onPress={() => setSelectedPro(proOverview)}>
            {renderProfessionalProfileCardByOverviewDTO(proOverview, {
              style:
                proOverview.id === selectedPro?.id
                  ? styles.selectedProCard
                  : styles.normalProCard,
              navigateToProfessionalProfile: () =>
                onViewProfessionalProfile(proOverview.id, proOverview.note),
            })}
          </TouchableOpacity>
        );
      }}
      renderBottomAction={() => (
        <View style={styles.bottomActionRow}>
          <CommonButton
            color={WHITE}
            backgroundColor={ACTION_BLUE}
            borderColor={ACTION_BLUE}
            title={t('add_label')}
            onPress={onAddProfessional}
            disabled={!selectedPro}
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  normalProCard: {
    padding: SPACE_VALUES.medium,
  },
  selectedProCard: {
    backgroundColor: BACKGROUND_BLUE,
    padding: SPACE_VALUES.medium,
    borderRadius: SPACE_VALUES.small,
  },
  bottomActionRow: {
    margin: SPACE_VALUES.medium,
  },
});
