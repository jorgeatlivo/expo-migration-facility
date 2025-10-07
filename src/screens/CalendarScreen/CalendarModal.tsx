import React, { useEffect, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';

import { ApiApplicationError } from '@/services/api';
import { fetchShiftsSummary, ShiftSummary } from '@/services/shifts';
import { setDaySelectedAction } from '@/store/actions/shiftActions';
import { AppDispatch } from '@/store/configureStore';

import StyledText from '@/components/StyledText';

import { BLACK, DARK_BLUE, GRAY, PRIMARY_BLUE, WHITE } from '@/styles/colors';
import { fontSize, fontWeight, LayoutTextEnum } from '@/styles/fonts';

import { formatDateToYYYYMMDD } from '@/common/utils';
import { timeConfiguration } from '@/locale/timeConfiguration';
import { RootState } from '@/types';

interface CalendarModalProps {
  calendarModalVisible: boolean;
  setCalendarModalVisible: (value: boolean) => void;
}
export const CalendarModal: React.FC<CalendarModalProps> = ({
  calendarModalVisible,
  setCalendarModalVisible,
}) => {
  const { t } = useTranslation();

  const [shiftsSummary, setShiftsSummary] = useState<ShiftSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { daySelected } = useSelector(
    (state: RootState) => state.shiftData.calendarData
  );
  const dispatch = useDispatch<AppDispatch>();

  const loadShiftSummary = async (initialDay: string, finalDay: string) => {
    fetchShiftsSummary(initialDay, finalDay)
      .then((shiftsSummaryResponse) => {
        setShiftsSummary(shiftsSummaryResponse);
        setIsLoading(false);
      })
      .catch((error) => {
        setShiftsSummary([]);
        setIsLoading(false);
        setCalendarModalVisible(false);
        const errorMessage =
          error instanceof ApiApplicationError
            ? error.message
            : t('shift_list_error_server_message');
        Alert.alert(t('shift_list_error_loading_shifts'), errorMessage);
      });
  };
  const initialDay = new Date(daySelected);
  const finalDay = new Date(daySelected);
  initialDay.setDate(1);
  finalDay.setDate(31);

  useEffect(() => {
    setIsLoading(true);

    loadShiftSummary(
      formatDateToYYYYMMDD(initialDay),
      formatDateToYYYYMMDD(finalDay)
    );
  }, [moment(initialDay).format('YYYY-MM-DD')]);

  interface CalendarDayItemProps {
    day: string;
    hasShifts: boolean;
    hasAlert: boolean;
    isSelected: boolean;
    onPress: () => void;
    isToday: boolean;
  }

  LocaleConfig.locales.es = timeConfiguration();
  LocaleConfig.defaultLocale = 'es';

  const CalendarDayItem: React.FC<CalendarDayItemProps> = ({
    day,
    hasShifts,
    hasAlert,
    isSelected,
    onPress,
    isToday,
  }) => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {hasAlert && (
          <View
            style={{
              position: 'absolute',
              top: 1,
              right: 1,
              backgroundColor: 'red',
              borderRadius: 5,
              width: 7,
              height: 7,
              zIndex: 2,
            }}
          />
        )}
        <TouchableOpacity
          onPress={onPress}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
            backgroundColor: isSelected
              ? DARK_BLUE
              : hasShifts
                ? WHITE
                : 'transparent',
            width: 25,
            height: 25,
            borderWidth: isToday ? 1 : 0,
            borderColor: isToday ? DARK_BLUE : 'transparent',
          }}
        >
          <StyledText
            type={LayoutTextEnum.body}
            style={{
              color: isSelected ? WHITE : hasShifts ? DARK_BLUE : BLACK,
              fontFamily: hasShifts ? fontWeight.bold : fontWeight.regular,
            }}
          >
            {day}
          </StyledText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      isVisible={calendarModalVisible}
      onDismiss={() => setCalendarModalVisible(false)}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={300}
      useNativeDriver={true}
      onBackdropPress={() => setCalendarModalVisible(false)}
      hideModalContentWhileAnimating={true}
    >
      <Calendar
        style={{
          borderRadius: 10,
          backgroundColor: WHITE,
          padding: 10,
        }}
        firstDay={1}
        initialDate={moment(daySelected).format('YYYY-MM-DD')}
        onDayPress={(day: DateData) => {
          dispatch(setDaySelectedAction(day.dateString));
          setCalendarModalVisible(false);
        }}
        theme={{
          backgroundColor: WHITE,
          calendarBackground: WHITE,
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: PRIMARY_BLUE,
          selectedDayTextColor: WHITE,
          todayTextColor: PRIMARY_BLUE,
          dayTextColor: GRAY,
          textDayHeaderFontFamily: fontWeight.light,
          textDayFontSize: fontSize.medium,
        }}
        dayComponent={({ date }: { date?: DateData }) => {
          const summary = shiftsSummary.find(
            (summary) => summary.date === date?.dateString
          );
          return (
            <CalendarDayItem
              day={date?.day.toString() || ''}
              isToday={moment().format('YYYY-MM-DD') === date?.dateString}
              hasShifts={summary?.date ? true : false}
              hasAlert={summary?.hasAlert ? true : false}
              isSelected={
                moment(daySelected).format('YYYY-MM-DD') === date?.dateString
              }
              onPress={() => {
                date && dispatch(setDaySelectedAction(date.dateString));
                setCalendarModalVisible(false);
              }}
            />
          );
        }}
        onMonthChange={(month: DateData) => {
          const initialDay = new Date(month.dateString);
          const finalDay = new Date(month.dateString);
          initialDay.setDate(1);
          finalDay.setDate(31);
          loadShiftSummary(
            formatDateToYYYYMMDD(initialDay),
            formatDateToYYYYMMDD(finalDay)
          );
        }}
        hideExtraDays={true}
      />
    </Modal>
  );
};
