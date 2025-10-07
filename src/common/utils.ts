import { Alert, Linking } from 'react-native';

import moment from 'moment';

import i18n from '@/locale/i18n';
import { DayShift, Shift } from '@/types';

function isToday(date: Date): boolean {
  return moment(date).isSame(moment.now(), 'day');
}

function getTomorrowOf(date: Date): Date {
  return moment(date).add(1, 'days').toDate();
}

function isTomorrow(date: Date): boolean {
  let tomorrow = getTomorrowOf(new Date());
  return moment(date).isSame(tomorrow, 'day');
}

export function formatDate(parsedDate: Date, shorten?: boolean) {
  // compare 2 dates in typescript
  if (isToday(parsedDate)) {
    return i18n.t('common_today');
  }

  if (isTomorrow(parsedDate)) {
    return i18n.t('common_tomorrow');
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: shorten ? 'short' : 'long',
    day: 'numeric',
    month: shorten ? 'short' : 'long',
  };
  let formattedDate = parsedDate.toLocaleDateString(i18n.language, options);
  formattedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return formattedDate;
}

export function formatSchedule(startTime: string, finishTime: string) {
  const startTimeDate = new Date(startTime);
  const finishTimeDate = new Date(finishTime);
  const formattedEndTime = finishTimeDate.toLocaleTimeString(i18n.language, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  const formattedStartTime = startTimeDate.toLocaleTimeString(i18n.language, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  return `${formattedStartTime} - ${formattedEndTime}`;
}

export function formatDateToYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const handleLinkPress = (link: string) => {
  Linking.openURL(link).catch((error) =>
    Alert.alert(i18n.t('common_accessing_link_error_title'), error)
  );
};

export function mapDayShift(dayShiftResponse: DayShift) {
  return {
    ...dayShiftResponse,
    shifts: dayShiftResponse.shifts.map(mapShift),
  };
}

export function mapShift(shiftResponse: any) {
  return {
    ...shiftResponse,
  } as Shift;
}
