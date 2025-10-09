import { QueryFunction } from '@tanstack/react-query';

import { fetchShifts } from '@/services/shifts';

import { DayShift } from '@/types';

export const SHIFTS_QUERY_KEY = 'SHIFTS';

export interface ShiftsQueryParams {
  fromDate?: Date;
  toDate?: Date;
  ordering?: 'ASC' | 'DESC';
  withPendingClaims?: boolean;
  isFilled?: boolean;
}

export const queryFnShifts: QueryFunction<
  DayShift[],
  [string, ShiftsQueryParams]
> = async ({ queryKey }) => {
  const [, params] = queryKey;
  const { fromDate, toDate, ordering, withPendingClaims, isFilled } = params;

  return await fetchShifts(
    fromDate,
    toDate,
    ordering,
    withPendingClaims,
    isFilled
  );
};
