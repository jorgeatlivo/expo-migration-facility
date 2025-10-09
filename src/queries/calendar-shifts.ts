import { QueryFunction } from '@tanstack/react-query';

import { fetchShifts } from '@/services/shifts';

import { DayShift } from '@/types';

export const CALENDAR_SHIFTS_QUERY_KEY = 'CALENDAR_SHIFTS';

export interface CalendarShiftsQueryParams {
  startOfWeek: string;
  endOfWeek: string;
}

export const queryFnCalendarShifts: QueryFunction<
  DayShift[],
  [string, CalendarShiftsQueryParams]
> = async ({ queryKey }) => {
  const [, params] = queryKey;
  const { startOfWeek, endOfWeek } = params;

  return await fetchShifts(new Date(startOfWeek), new Date(endOfWeek), 'DESC');
};
