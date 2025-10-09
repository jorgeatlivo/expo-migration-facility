import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import moment from 'moment';

import { ApiApplicationError } from '@/services/api';
import { setDaySelectedAction } from '@/store/actions/shiftActions';
import { AppDispatch } from '@/store/configureStore';

import { DayRowItem } from '@/screens/CalendarScreen/DayRowItem';

import Row from '@/components/atoms/Row';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import ScreenTitle from '@/components/common/ScreenTitle';
import StyledText from '@/components/StyledText';

import { useFetchCalendarShifts } from '@/hooks/useFetchCalendarShifts';
import { BADGE_GRAY, DARK_BLUE, NEW_LIGHT_GRAY, WHITE } from '@/styles/colors';
import { commonStyles } from '@/styles/commonStyles';
import { LayoutTextEnum } from '@/styles/fonts';
import { SPACE_VALUES } from '@/styles/spacing';

import LivoIcon from '@/assets/icons/LivoIcon';
import { timeConfiguration } from '@/locale/timeConfiguration';
import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack.types';
import { TabRoutes, TabsParamsList } from '@/router/TabNavigator.types';
import { DayShift, RootState, Shift } from '@/types';
import { CalendarModal } from './CalendarModal';
import { CalendarShiftList } from './CalendarShiftList';

interface DayShiftFormatted {
  weekDay: number;
  dayNumber: string;
  shifts: Shift[];
  date: string;
  hasAlert: boolean;
  holiday?: boolean;
}
type CalendarScreenProps = CompositeScreenProps<
  StackScreenProps<TabsParamsList, TabRoutes.ShiftsCalendar>,
  StackScreenProps<ProtectedStackParamsList, ProtectedStackRoutes.Home>
>;

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();

  const { daySelected } = useSelector(
    (state: RootState) => state.shiftData.calendarData
  );
  const { dayShiftsData } = useSelector((state: RootState) => state.shiftData);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { newShiftAvailable } = dayShiftsData;

  const getWeekDayShifts = useCallback(
    (startOfWeek: Date, shiftsForWeek: DayShift[]): DayShiftFormatted[] => {
      const weekDayShifts = [];
      const days = timeConfiguration().dayNamesShort;

      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        const formattedDay = moment(currentDay).format('YYYY-MM-DD');
        const dayOfMonth = currentDay.getDate();
        const day = days[currentDay.getDay()];
        const matchingShift = shiftsForWeek.find(
          (shift) => shift.date === formattedDay
        );
        weekDayShifts.push({
          weekDay: dayOfMonth,
          dayNumber: day,
          shifts: matchingShift?.shifts || [],
          date: formattedDay,
          hasAlert: matchingShift?.hasAlert || false,
          holiday: matchingShift?.holiday || undefined,
        });
      }
      return weekDayShifts;
    },
    []
  );

  const startOfWeek = useMemo(() => {
    const selectedDate = new Date(daySelected);
    const start = new Date(daySelected);

    start.setDate(selectedDate.getDate() - ((selectedDate.getDay() + 6) % 7));
    return start;
  }, [daySelected]);

  const endOfWeek = useMemo(() => {
    const end = new Date(startOfWeek);
    end.setDate(startOfWeek.getDate() + 6); // Set to Sunday
    return end;
  }, [startOfWeek]);

  // Use the new hook to fetch shifts
  const { shifts, isLoading, error, refetch, isRefetching } =
    useFetchCalendarShifts({ startOfWeek, endOfWeek }, true);

  const weekShiftDays = useMemo(
    () => getWeekDayShifts(startOfWeek, shifts),
    [getWeekDayShifts, startOfWeek, shifts]
  );

  // Get the name of the month from the middle day
  const monthName = useMemo(
    () => timeConfiguration().monthNames[new Date(daySelected).getMonth()],
    [daySelected]
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

  const refreshData = useCallback(() => {
    refetch();
  }, [refetch]);

  // Refetch when newShiftAvailable changes
  useEffect(() => {
    if (newShiftAvailable) {
      refetch();
    }
  }, [newShiftAvailable, refetch]);

  function navigateToShiftDetails(shiftId: number) {
    navigation.navigate(ProtectedStackRoutes.ShiftDetails, { shiftId });
  }

  function navigateToPublishShift(shiftTimeInDay: string) {
    navigation.navigate(ProtectedStackRoutes.PublishShift, {
      date: daySelected,
      timeInDay: shiftTimeInDay,
    });
  }

  const selectFollowingWeek = useCallback(() => {
    const nextMonday = new Date(startOfWeek);
    nextMonday.setDate(startOfWeek.getDate() + 7);
    dispatch(setDaySelectedAction(moment(nextMonday).format('YYYY-MM-DD')));
  }, [dispatch, startOfWeek]);

  const selectPreviousWeek = useCallback(() => {
    const previousMonday = new Date(startOfWeek);
    previousMonday.setDate(startOfWeek.getDate() - 1);
    dispatch(setDaySelectedAction(moment(previousMonday).format('YYYY-MM-DD')));
  }, [dispatch, startOfWeek]);

  const daysRow = (
    <Row alignItems={'center'} justifyContent={'space-between'}>
      <TouchableOpacity
        onPress={() => selectPreviousWeek()}
        style={[styles.selectWeekButton, styles.previousButton]}
      >
        <LivoIcon name="chevron-left" size={24} color={BADGE_GRAY} />
      </TouchableOpacity>
      <Row alignItems={'center'} justifyContent={'space-between'} flex={1}>
        {weekShiftDays.map((dayShift) => {
          return (
            <DayRowItem
              key={dayShift.date}
              weekDay={dayShift.dayNumber}
              day={dayShift.weekDay.toString()}
              isSelected={dayShift.date === daySelected}
              hasShifts={dayShift.shifts.length > 0}
              onPress={() => dispatch(setDaySelectedAction(dayShift.date))}
              hasAlert={dayShift.hasAlert}
              isToday={moment().format('YYYY-MM-DD') === dayShift.date}
              isHoliday={dayShift.holiday}
            />
          );
        })}
      </Row>
      <TouchableOpacity
        onPress={() => selectFollowingWeek()}
        style={[styles.selectWeekButton, styles.nextButton]}
      >
        <LivoIcon name="chevron-right" size={24} color={BADGE_GRAY} />
      </TouchableOpacity>
    </Row>
  );

  const shiftsForDay = useMemo(
    () =>
      weekShiftDays.find((dayShift) => dayShift.date === daySelected)?.shifts ||
      [],
    [weekShiftDays, daySelected]
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <ScreenTitle style={commonStyles.headerStyle} title={monthName}>
          <Row alignItems={'center'} gap={SPACE_VALUES.xLarge}>
            <TouchableOpacity
              onPress={() =>
                dispatch(setDaySelectedAction(moment().format('YYYY-MM-DD')))
              }
            >
              <StyledText type={LayoutTextEnum.link} style={styles.todayLabel}>
                {t('shift_list_today_label')}
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCalendarModalVisible(!calendarModalVisible)}
            >
              <LivoIcon name="calendar" size={25} color={BADGE_GRAY} />
            </TouchableOpacity>
          </Row>
        </ScreenTitle>
        {daysRow}
      </View>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refreshData} />
          }
        >
          <CalendarShiftList
            shifts={shiftsForDay}
            navigateToShiftDetails={navigateToShiftDetails}
            navigateToPublishShift={navigateToPublishShift}
          />
        </ScrollView>
      )}
      <View />
      <CalendarModal
        calendarModalVisible={calendarModalVisible}
        setCalendarModalVisible={setCalendarModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  selectWeekButton: {
    width: 50,
    height: 40,
    justifyContent: 'center',
  },
  previousButton: {
    alignItems: 'flex-start',
  },
  nextButton: {
    alignItems: 'flex-end',
  },
  header: {
    paddingBottom: SPACE_VALUES.large,
    paddingHorizontal: SPACE_VALUES.large,
    borderWidth: 1,
    borderColor: NEW_LIGHT_GRAY,
    backgroundColor: WHITE,
    zIndex: 2,
  },
  todayLabel: {
    color: DARK_BLUE,
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: SPACE_VALUES.large,
    paddingHorizontal: SPACE_VALUES.large,
    paddingBottom: SPACE_VALUES.large,
  },
});
