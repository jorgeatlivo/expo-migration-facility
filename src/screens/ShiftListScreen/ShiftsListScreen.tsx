import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import remoteConfig from '@react-native-firebase/remote-config';
import moment from 'moment';

import { ApiApplicationError } from '@/services/api';
import {
  newNotificationToggleAction,
  toggleNewShiftAvailableAction,
} from '@/store/actions/shiftActions';

import ActionButton from '@/components/buttons/ActionButton';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import ScreenTitle from '@/components/common/ScreenTitle';
import { ShiftsDayView } from '@/components/ShiftsDayView';
import { HeaderTabs } from '@/components/shiftList/HeaderTabs';
import { ShiftsEmptyState } from '@/components/shiftList/ShiftsEmptyState';

import { useFetchShifts } from '@/hooks/useFetchShifts';
import { commonStyles } from '@/styles/commonStyles';
import { SPACE_VALUES } from '@/styles/spacing';

import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack.types';
import { TabRoutes, TabsParamsList } from '@/router/TabNavigator.types';
import { DayShift, RootState, Shift } from '@/types';

type ShiftListScreenProps = CompositeScreenProps<
  StackScreenProps<TabsParamsList, TabRoutes.ShiftsList>,
  StackScreenProps<ProtectedStackParamsList, ProtectedStackRoutes.Home>
>;

export const ShiftsListScreen: React.FC<ShiftListScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();

  const { newNotificationToggle, dayShiftsData } = useSelector(
    (state: RootState) => state.shiftData
  );
  const { newShiftAvailable } = dayShiftsData;
  const { lastActiveTime, appState } = useSelector(
    (state: RootState) => state.configurationData
  );
  const dispatch = useDispatch();
  const [tab, setTab] = useState<string>('shift_list_claims_shifts_title');

  // Prepare query parameters based on current tab
  const today = useMemo(() => new Date(), []);
  const queryParams = useMemo(
    () => ({
      fromDate: today,
      toDate: undefined,
      ordering: 'ASC' as const,
      withPendingClaims:
        tab === t('shift_list_claims_shifts_title') ? true : undefined,
      isFilled:
        tab === t('shift_list_filled_shifts_title')
          ? true
          : tab === t('shift_list_pending_shifts_title')
            ? false
            : undefined,
    }),
    [tab, today, t]
  );

  // Use the new useQuery hook
  const {
    dayShifts: rawDayShifts,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useFetchShifts(queryParams, true);

  const filterShifts = useCallback(
    (chosenTab: string, shifts: Shift[]) => {
      return shifts.filter((shift) => {
        if (chosenTab === 'shift_list_claims_shifts_title') {
          return (
            shift.totalPendingClaims > 0 || shift.totalCancellationRequests > 0
          );
        } else if (chosenTab === 'shift_list_pending_shifts_title') {
          return shift.capacity - shift.totalAcceptedClaims > 0;
        } else if (chosenTab === 'shift_list_filled_shifts_title') {
          return shift.capacity === shift.totalAcceptedClaims;
        }
      });
    },
    [t]
  );

  // Filter and process the dayShifts data
  const dayShifts = useMemo(
    () =>
      rawDayShifts
        .map((dayShift) => ({
          ...dayShift,
          shifts: filterShifts(tab, dayShift.shifts),
        }))
        .filter((dayShift) => dayShift.shifts.length > 0),
    [rawDayShifts, tab, filterShifts]
  );

  // Handle error display
  useEffect(() => {
    if (error) {
      const errorMessage =
        error instanceof ApiApplicationError
          ? error.message
          : t('shift_list_error_server_message');
      Alert.alert(t('shift_list_error_loading_shifts'), errorMessage);
    }
  }, [error, t]);

  const refreshIntervalMs = useMemo(
    () => remoteConfig().getValue('auto_refresh_interval').asNumber(),
    []
  );

  const handleRefetch = useCallback(() => {
    refetch();
    dispatch(toggleNewShiftAvailableAction(false));
  }, [refetch, dispatch]);

  useEffect(() => {
    if (
      appState === 'active' &&
      Date.now() - Number(lastActiveTime) > refreshIntervalMs
    ) {
      handleRefetch();
    }
  }, [appState, lastActiveTime, refreshIntervalMs, handleRefetch]);

  useEffect(() => {
    if (newShiftAvailable) {
      handleRefetch();
    }
  }, [newShiftAvailable, handleRefetch]);

  useEffect(() => {
    if (newNotificationToggle) {
      handleRefetch();
      dispatch(newNotificationToggleAction(false));
    }
  }, [newNotificationToggle, handleRefetch, dispatch]);

  function navigateToPublishShiftScreen() {
    navigation.navigate(ProtectedStackRoutes.PublishShift, {
      date: moment().format('YYYY-MM-DD'),
      timeInDay: 'dayShift',
    });
  }

  function navigateToShiftDetails(shiftId: number) {
    navigation.navigate(ProtectedStackRoutes.ShiftDetails, { shiftId });
  }

  const refreshData = () => {
    refetch();
  };

  function renderDayShift({ item }: { item: DayShift; index: number }) {
    return (
      <ShiftsDayView
        dayShift={item}
        navigateToShiftDetails={navigateToShiftDetails}
      />
    );
  }

  const AddButton = (
    <ActionButton
      title={t('shift_list_add_shift_button_title')}
      onPress={navigateToPublishShiftScreen}
    />
  );

  const content = dayShifts.length ? (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={dayShifts}
        renderItem={renderDayShift}
        contentContainerStyle={styles.shiftList}
        keyExtractor={(item) => item.date}
        onRefresh={refreshData}
        refreshing={isFetching}
        ListFooterComponent={<View style={styles.listFooter} />}
      />
    </>
  ) : (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refreshData} />
      }
      contentContainerStyle={styles.refreshDataContainer}
    >
      <ShiftsEmptyState
        title={t(
          tab === 'shift_list_claims_shifts_title'
            ? 'shift_list_no_pending_claims_title'
            : tab === 'shift_list_pending_shifts_title'
              ? 'shift_list_no_pending_shifts_title'
              : 'shift_list_no_filled_shifts_title'
        )}
        subtitle={t(
          tab === 'shift_list_claims_shifts_title'
            ? 'shift_list_no_pending_claims_body'
            : tab === 'shift_list_pending_shifts_title'
              ? 'shift_list_no_pending_shifts_body'
              : 'shift_list_no_filled_shifts_body'
        )}
      />
    </ScrollView>
  );

  const filteredContent = (
    <>{isLoading && !isFetching ? <LoadingScreen /> : content}</>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenTitle
        style={styles.headerStyle}
        title={t('shift_list_published_shifts_title')}
      />
      <HeaderTabs
        tabs={[
          'shift_list_claims_shifts_title',
          'shift_list_pending_shifts_title',
          'shift_list_filled_shifts_title',
        ]}
        activeTab={tab}
        onTabPress={setTab}
      />
      <View style={styles.body}>{filteredContent}</View>
      <View style={styles.addButtonContainer}>{AddButton}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ...commonStyles,
  body: {
    flex: 1,
    marginHorizontal: 10,
  },
  shiftList: {
    paddingTop: SPACE_VALUES.medium,
    gap: SPACE_VALUES.medium,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  refreshDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listFooter: {
    height: 70,
  },
});
