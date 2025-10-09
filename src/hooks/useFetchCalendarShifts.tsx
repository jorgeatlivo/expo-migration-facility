import { useQuery } from '@tanstack/react-query';
import { TIME } from '@/queries/gc-time.enum';
import {
  queryFnCalendarShifts,
  CALENDAR_SHIFTS_QUERY_KEY,
  CalendarShiftsQueryParams,
} from '@/queries/calendar-shifts';
import { ApiApplicationError } from '@/services/api';

export function useFetchCalendarShifts(
  params: { startOfWeek: Date; endOfWeek: Date },
  enabled: boolean = true
) {
  const queryParams: CalendarShiftsQueryParams = {
    startOfWeek: params.startOfWeek.toISOString(),
    endOfWeek: params.endOfWeek.toISOString(),
  };
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: [CALENDAR_SHIFTS_QUERY_KEY, queryParams],
    queryFn: queryFnCalendarShifts,
    enabled,
    staleTime: TIME['5_minutes'],
    retry: (failureCount: number, err: any) => {
      if (err instanceof ApiApplicationError && err.errorCode === '50030') {
        return false; // Do not retry for this specific application error
      }

      // For axios errors, check if it's a server error
      if (err && typeof err === 'object' && 'status' in err) {
        const status = (err as any).status;
        return (
          failureCount < 3 ||
          (status >= 500 && status < 600 && failureCount < 5)
        );
      }
      return failureCount < 3;
    },
  });

  return {
    shifts: data || [],
    isLoading,
    error,
    refetch,
    isRefetching,
  };
}
