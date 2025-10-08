import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import i18n from 'i18next';

export const formatDateString = (
  date: Date | string,
  format: 'YYYY-MM-DD' | 'DD' | 'MM' | 'YYYY' | string
): string => {
  return dayjs.utc(date).format(format);
};

export const isSameDay = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
};

export const isBeforeDay = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setUTCHours(0, 0, 0, 0);
  d2.setUTCHours(0, 0, 0, 0);
  return d1 < d2;
};

export function diffDays(day1: Date | string, day2: Date | string): number {
  const d1 = new Date(day1);
  const d2 = new Date(day2);
  const d1Days = Math.floor(d1.getTime() / (1000 * 60 * 60 * 24));
  const d2Days = Math.floor(d2.getTime() / (1000 * 60 * 60 * 24));
  return d2Days - d1Days;
}

export const isBeforeToday = (date: Date | string): boolean => {
  return isBeforeDay(date, new Date());
};

export const isWithinFutureLimit = (date: Date, limit: number) => {
  const stripTime = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const today = stripTime(new Date());
  const futureLimit = new Date(today);
  futureLimit.setDate(today.getDate() + limit);

  const inputDate = stripTime(date);

  return inputDate >= today && inputDate <= futureLimit;
};

export const isBeforeNow = (dateStr: string, timeStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);

  const combinedDate = new Date(year, month - 1, day, hour, minute);
  return combinedDate.getTime() < Date.now();
};

// Get days in month
export const getDaysInMonth = (date: Date): number[] => {
  const lastDay = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    0
  ).getDate();
  return Array.from({ length: lastDay }, (_, i) => i + 1);
};

// Start of month
export const startOfMonth = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setUTCDate(1);
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
};

export function getUTCWeekStart(date: Date): Date {
  const dayOfWeek = date.getUTCDay();
  const diff = (dayOfWeek + 6) % 7; // Adjust to make Monday the start of week
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() - diff
    )
  );
}

export function addDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setUTCDate(newDate.getUTCDate() + days);
  return newDate;
}

export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

/**
 * @return date in yyyy-mm-dd format
 */
export function formatISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * @return time in hh:mm format
 */
export function getTimeFromDate(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function isBefore(date1: Date, date2: Date): boolean {
  return date1.getTime() < date2.getTime();
}

export const getStartOfWeek = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getUTCDay();
  const diff = date.getUTCDate() - day;
  const startOfWeek = new Date(date.setUTCDate(diff));
  return formatISODate(startOfWeek);
};

export const getLocalisedDate = (selectedDate: string) =>
  new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(selectedDate));

// Initialize dayjs plugins
dayjs.extend(utc);

/**
 * Calendar utility functions using dayjs
 */

/**
 * Get the first day of week index for a given month/year (Monday = 0, Sunday = 6)
 * @param year - The year
 * @param month - The month (0-indexed)
 * @returns The first day of week index in Monday-first system
 */
export const getFirstDayOfWeekIndex = (year: number, month: number): number => {
  const firstDay = dayjs.utc().year(year).month(month).date(1);
  const jsDay = firstDay.day(); // dayjs.day() returns 0=Sunday, 1=Monday, etc.
  return (jsDay + 6) % 7; // Convert to Monday=0 system
};

/**
 * Get the number of days in a month
 * @param year - The year
 * @param month - The month (0-indexed)
 * @returns Number of days in the month
 */
export const getDaysInMonthCount = (year: number, month: number): number => {
  return dayjs.utc().year(year).month(month).daysInMonth();
};

/**
 * Create a UTC date for calendar usage
 * @param year - The year
 * @param month - The month (0-indexed)
 * @param day - The day
 * @returns Date object in UTC
 */
export const createUTCDate = (
  year: number,
  month: number,
  day: number
): Date => {
  return dayjs.utc().year(year).month(month).date(day).toDate();
};

/**
 * Check if a date is today
 * @param date - The date to check (Date object or string)
 * @returns True if the date is today
 */
export const isToday = (date: Date | string): boolean => {
  const targetDate = dayjs.utc(date);
  const today = dayjs.utc();
  return targetDate.isSame(today, 'day');
};

/**
 * Format date to ISO string (YYYY-MM-DD) using dayjs
 * @param date - The date to format
 * @returns ISO date string
 */
export const formatISODateDayjs = (date: Date | string): string => {
  return dayjs.utc(date).format('YYYY-MM-DD');
};

/**
 * Format date for locale display using dayjs
 * @param date - The date to format
 * @param locale - The locale (default: 'es-ES')
 * @returns Formatted date string
 */
export const formatLocaleDate = (
  date: Date | string,
  locale: string = 'es-ES'
): string => {
  return dayjs.utc(date).locale(locale).format('dddd, DD [de] MMMM [de] YYYY');
};

/**
 * Calendar cell data interface
 */
export interface CalendarCellData {
  date: string;
  today?: boolean;
  notInMonth?: boolean;
  slots?: any[]; // Keep compatible with CalendarCellDTO
}

/**
 * Generate calendar data for a specific month/year using dayjs
 * @param year - The year
 * @param month - The month (0-indexed)
 * @returns Array of calendar cell data
 */
export const generateCalendarData = (
  year: number,
  month: number
): CalendarCellData[] => {
  const firstDayOfWeek = getFirstDayOfWeekIndex(year, month);
  const daysInMonth = getDaysInMonthCount(year, month);

  const calendar: CalendarCellData[] = [];

  // Add previous month's trailing days
  const prevMonthDays = getDaysInMonthCount(year, month - 1);
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const date = createUTCDate(year, month - 1, day);
    calendar.push({
      date: formatISODateDayjs(date),
      notInMonth: true,
    });
  }

  // Add current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = createUTCDate(year, month, day);
    calendar.push({
      date: formatISODateDayjs(date),
      today: isToday(date),
    });
  }

  // Add next month's leading days to complete the week (6 weeks * 7 days = 42 total)
  const remainingDays = 42 - calendar.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = createUTCDate(year, month + 1, day);
    calendar.push({
      date: formatISODateDayjs(date),
      notInMonth: true,
    });
  }

  return calendar;
};
