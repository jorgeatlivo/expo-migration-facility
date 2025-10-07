import moment from 'moment';
import { decode } from 'base-64';
import Clipboard from '@react-native-clipboard/clipboard';
import i18n from '@/locale/i18n';
import { typographyStyles } from '@/styles/livoFonts';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
export const MAX_CAPACITY = 5;

export const getStartAndEndTimeFromDate = (
  shiftDate: Date,
  shiftStartTime: Date,
  shiftEndTime: Date
) => {
  let startTime = moment({
    year: shiftDate.getFullYear(),
    month: shiftDate.getMonth(),
    day: shiftDate.getDate(),
    hour: shiftStartTime.getHours(),
    minute: shiftStartTime.getMinutes(),
  });

  let endTime = moment({
    year: shiftDate.getFullYear(),
    month: shiftDate.getMonth(),
    day: shiftDate.getDate(),
    hour: shiftEndTime.getHours(),
    minute: shiftEndTime.getMinutes(),
  });

  if (endTime.isBefore(startTime)) {
    endTime.add(1, 'day');
  }
  return { startTime, endTime };
};

export const calculatePricePerHour = (
  shiftStartTime: Date,
  shiftEndTime: Date,
  price: string
) => {
  const startTime = moment(shiftStartTime);
  const endTime = moment(shiftEndTime);

  const durationInMilliseconds = endTime.diff(startTime); // Get the duration in milliseconds
  const durationInHours = moment.duration(durationInMilliseconds).asHours(); // Convert milliseconds to hours
  return +price / durationInHours;
};

export function getFormattedTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString(i18n.language, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
}

export function formattedSchedule(startTime: string, endTime: string) {
  const formattedEndTime = getFormattedTime(endTime);

  const formattedStartTime = getFormattedTime(startTime);

  return `${formattedStartTime} - ${formattedEndTime}`;
}

export const formattedWeekDay = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
  return new Intl.DateTimeFormat(i18n.language, options).format(date);
};

export const formattedDay = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(i18n.language, {
    day: 'numeric',
  });
};

export const formattedMonthYear = (dateString: string) => {
  const date = new Date(dateString);

  const monthOptions = { month: 'long' } as Intl.DateTimeFormatOptions;
  const formattedMonth = new Intl.DateTimeFormat(
    i18n.language,
    monthOptions
  ).format(date);

  const yearOptions = { year: 'numeric' } as Intl.DateTimeFormatOptions;
  const formattedYear = new Intl.DateTimeFormat(
    i18n.language,
    yearOptions
  ).format(date);

  // Capitalize the first letter of the month.
  const capitalizedMonth =
    formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1);

  // Return the formatted result.
  return `${capitalizedMonth} ${formattedYear}`;
};

export function decodeJWT(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  // Use the base-64 library to decode the Base64 string
  const jsonPayload = decode(base64);

  return JSON.parse(jsonPayload);
}

const toUpperCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);
const getShortMonth = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
  };
  const formatteDate = date.toLocaleDateString(i18n.language, options);
  return toUpperCase(formatteDate);
};

const getDay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.getDate().toString();
};

export function formattedShortMonth(dateString: string) {
  const date = moment(dateString);
  const today = moment();

  const isToday = date.isSame(today, 'day');
  const isTomorrow = date.isSame(today.clone().add(1, 'day'), 'day');

  if (isToday) {
    return i18n.t('common_today');
  } else if (isTomorrow) {
    return i18n.t('common_tomorrow');
  } else {
    return (
      toUpperCase(formattedWeekDay(dateString)) +
      ', ' +
      getDay(dateString) +
      ' ' +
      getShortMonth(dateString)
    );
  }
}

export const formattedMonth = (dateString: string) => {
  return (
    getDay(dateString) + ` ${i18n.t('of_label')} ` + getShortMonth(dateString)
  );
};

export const formattedDayMonth = (dateString: string) => {
  return getDay(dateString) + ' ' + getShortMonth(dateString);
};

export const copyToClipboard = async (text: string) => {
  Clipboard.setString(text);
};

export function formatTime(date: string) {
  const timeDate = new Date(date);
  return timeDate.toLocaleTimeString(i18n.language, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
}

export function resolveTypographyStyles(style?: string, size?: string) {
  if (!!style && !!size) {
    const styles = typographyStyles as any;
    if (style in styles && size in styles[style]) {
      return styles[style][size];
    }
  }
  return {};
}

export function resolveIconSize(size: string) {
  if (size.endsWith('px') && /^\d{1,}px$/.test(size)) {
    return parseInt(size.replace('px', ''), 10) || 100;
  }
  if (size.endsWith('%') && /^\d{1,3}%$/.test(size)) {
    const percent = parseInt(size.replace('%', ''), 10) || 100;
    return (width * percent) / 100;
  }
  return 1;
}

export function buildShiftDateTime(shiftDate: Date, shiftTime: Date): moment.Moment {
  return moment({
    year: shiftDate.getFullYear(),
    month: shiftDate.getMonth(),
    day: shiftDate.getDate(),
    hour: shiftTime.getHours(),
    minute: shiftTime.getMinutes(),
  });
}

export function splitName(fullName: string): [string, string] {
  const [first, ...rest] = fullName.trim().split(/\s+/)
  return [first, rest.join(' ')]
}

export function sortBy<T extends object>(array: T[], iteratee: any) {
  const getValue =
    typeof iteratee === "function"
      ? iteratee
      : (item: T) => (item as any)[iteratee];

  return [...array].sort((a, b) => {
    const valA = getValue(a);
    const valB = getValue(b);

    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  });
}