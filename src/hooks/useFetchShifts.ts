import { useQuery } from '@tanstack/react-query';
import { TIME } from '@/queries/gc-time.enum';
import {
  queryFnShifts,
  SHIFTS_QUERY_KEY,
  ShiftsQueryParams,
} from '@/queries/shifts';

export function useFetchShifts(
  params: ShiftsQueryParams,
  enabled: boolean = true
) {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: [SHIFTS_QUERY_KEY, params],
    queryFn: queryFnShifts,
    enabled,
    staleTime: TIME['5_minutes'],
    retry: (failureCount, err) => {
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
    dayShifts: data || [],
    isLoading,
    isFetching,
    error,
    refetch,
  };
}
