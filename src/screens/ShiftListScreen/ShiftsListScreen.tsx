import remoteConfig from '@react-native-firebase/remote-config';
import { StackScreenProps } from '@react-navigation/stack';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import ActionButton from '@/components/buttons/ActionButton';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import ScreenTitle from '@/components/common/ScreenTitle';
import { HeaderTabs } from '@/components/shiftList/HeaderTabs';
import { ShiftsEmptyState } from '@/components/shiftList/ShiftsEmptyState';
import { ShiftsDayView } from '@/components/ShiftsDayView';
import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack';
import { ApiApplicationError } from '@/services/api';
import { fetchShifts } from '@/services/shifts';
import {
  loadShiftsAction,
  loadShiftsActionSuccess,
  newNotificationToggleAction,
  toggleNewShiftAvailableAction,
} from '@/store/actions/shiftActions';
import { commonStyles } from '@/styles/commonStyles';
import { DayShift, RootState, Shift } from '@/types';
import { CompositeScreenProps } from '@react-navigation/native';
import { TabRoutes, TabsParamsList } from '@/router/TabsNavigator';
import { SPACE_VALUES } from '@/styles/spacing';

type ShiftListScreenProps = CompositeScreenProps<
  StackScreenProps<TabsParamsList, TabRoutes.ShiftsList>,
  StackScreenProps<ProtectedStackParamsList, ProtectedStackRoutes.Home>
>;

export const ShiftsListScreen: React.FC<ShiftListScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();

  const { dayShiftsData, shiftInfoData, newNotificationToggle } = useSelector(
    (state: RootState) => state.shiftData
  );
  const { lastActiveTime, appState } = useSelector(
    (state: RootState) => state.configurationData
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { isLoading, dayShifts, newShiftAvailable } = dayShiftsData;
  const [tab, setTab] = useState(t('shift_list_claims_shifts_title'));

  const filterShifts = (chosenTab: string, shifts: Shift[]) => {
    return shifts.filter((shift) => {
      if (chosenTab === t('shift_list_claims_shifts_title')) {
        return (
          shift.totalPendingClaims > 0 || shift.totalCancellationRequests > 0
        );
      } else if (chosenTab === t('shift_list_pending_shifts_title')) {
        return shift.capacity - shift.totalAcceptedClaims > 0;
      } else if (chosenTab === t('shift_list_filled_shifts_title')) {
        return shift.capacity === shift.totalAcceptedClaims;
      }
    });
  };

  const refreshInterval = remoteConfig().getValue('auto_refresh_interval');
  const fetchShiftData = async () => {
    if (shiftInfoData.isLoading) {
      return;
    }
    const today = new Date();
    dispatch(loadShiftsAction());
    fetchShifts(
      today,
      undefined,
      undefined,
      tab === t('shift_list_claims_shifts_title') ? true : undefined, // fetch shifts with pending claims
      tab === t('shift_list_filled_shifts_title')
        ? true // fetch shifts that are filled
        : tab === t('shift_list_pending_shifts_title')
        ? false // fetch shifts that are not filled
        : undefined
    )
      .then((dayShiftsResponse) => {
        const filteredDayShifts = dayShiftsResponse
          .map((dayShift) => {
            return {
              ...dayShift,
              shifts: filterShifts(tab, dayShift.shifts)
            };
          })
          .filter((dayShift) => dayShift.shifts.length > 0);
        dispatch(loadShiftsActionSuccess(filteredDayShifts));
      })
      .catch((error) => {
        dispatch(loadShiftsActionSuccess([]));
        const errorMessage =
          error instanceof ApiApplicationError
            ? error.message
            : t('shift_list_error_server_message');
        Alert.alert(t('shift_list_error_loading_shifts'), errorMessage);
      });
    dispatch(toggleNewShiftAvailableAction(false));
  };

  useEffect(() => {
    if (
      appState === 'active' &&
      Date.now() - Number(lastActiveTime) > refreshInterval.asNumber()
    ) {
      fetchShiftData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  useEffect(() => {
    if (newShiftAvailable) {
      fetchShiftData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shiftInfoData.isLoading, newShiftAvailable]);

  useEffect(() => {
    if (newNotificationToggle) {
      fetchShiftData().then(() => {
        dispatch(newNotificationToggleAction(false));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newNotificationToggle]);

  useEffect(() => {
    if (!shiftInfoData.isLoading) {
      fetchShiftData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shiftInfoData.isLoading, tab]);

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
    setIsRefreshing(true);
    fetchShiftData().then(() => {
      setIsRefreshing(false);
    });
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
        refreshing={isRefreshing}
        ListFooterComponent={<View style={{ height: 70 }} />}
      />
    </>
  ) : (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refreshData} />
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
    <>{isLoading && !isRefreshing ? <LoadingScreen /> : content}</>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenTitle
        style={styles.headerStyle}
        title={t('shift_list_published_shifts_title')}
      />
      <HeaderTabs
        tabs={[
          t('shift_list_claims_shifts_title'),
          t('shift_list_pending_shifts_title'),
          t('shift_list_filled_shifts_title'),
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
});
