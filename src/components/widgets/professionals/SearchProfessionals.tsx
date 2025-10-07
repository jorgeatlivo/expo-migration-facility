import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfessionalProfile } from '@/services/shifts';

import { Divider } from '@/components/common/Divider';
import SearchBar from '@/components/common/SearchBar';
import StyledText from '@/components/StyledText';

import { ACTION_BLUE, BADGE_GRAY, WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { ProfessionalOverviewDTO } from '@/types/professionals';

interface SearchProfessionalsProps {
  professionals: ProfessionalOverviewDTO[] | ProfessionalProfile[];
  emptyListMessage: string;
  style?: StyleProp<ViewStyle>;
  searchTerm?: string;
  onSearchChange: (searchTerm: string) => any;
  onClearSearch: () => any;
  renderProfessionalCard: (
    item: ProfessionalOverviewDTO | ProfessionalProfile
  ) => any;
  renderBottomAction?: () => any;
  onRefresh?: () => any;
  isRefreshing?: boolean;
  onLoadNextPage?: () => any;
  isLoadingNextPage?: boolean;
}

export function SearchProfessionals({
  professionals,
  emptyListMessage,
  style,
  searchTerm,
  onSearchChange,
  onClearSearch,
  onRefresh,
  isRefreshing,
  onLoadNextPage,
  isLoadingNextPage,
  renderProfessionalCard,
  renderBottomAction,
}: SearchProfessionalsProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const changeSearchQuery = (searchTerm: string) => {
    onSearchChange(searchTerm);
  };

  return (
    <View style={[styles.container, style, { paddingBottom: insets.bottom }]}>
      <SearchBar
        value={searchTerm ?? ''}
        style={styles.searchBar}
        onChangeText={changeSearchQuery}
        placeholder={t('search_professionals_placeholder')}
      />
      <Divider />
      <FlatList<any>
        data={professionals}
        renderItem={({ item }) => renderProfessionalCard(item)}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        onRefresh={onRefresh}
        refreshing={!!isRefreshing}
        onEndReached={onLoadNextPage}
        ListFooterComponent={
          !!isLoadingNextPage ? (
            <ActivityIndicator size="large" style={styles.loading} />
          ) : null
        }
        ListEmptyComponent={
          !isLoadingNextPage && !isRefreshing ? (
            <View style={styles.emptyContainer}>
              <StyledText style={styles.emptyText}>
                {emptyListMessage}
              </StyledText>
              <TouchableOpacity onPress={onClearSearch}>
                <StyledText style={styles.clearSearchText}>
                  {t('clear_search_label')}
                </StyledText>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
      {renderBottomAction ? renderBottomAction() : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  searchBar: {
    marginTop: SPACE_VALUES.small,
    marginHorizontal: SPACE_VALUES.medium,
    marginBottom: SPACE_VALUES.large,
  },
  emptyContainer: {
    flex: 1,
    padding: SPACE_VALUES.medium,
    justifyContent: 'flex-start',
    marginTop: SPACE_VALUES.medium,
  },
  emptyText: {
    ...typographyStyles.body.medium,
    marginBottom: SPACE_VALUES.small,
    textAlign: 'left',
    color: BADGE_GRAY,
  },
  flatList: {
    paddingTop: SPACE_VALUES.large,
    paddingHorizontal: SPACE_VALUES.medium,
  },
  professionalCard: {
    marginTop: SPACE_VALUES.medium,
  },
  clearSearchText: {
    ...typographyStyles.action.small,
    color: ACTION_BLUE,
  },
  loading: {
    paddingVertical: SPACE_VALUES.xLarge,
  },
});
