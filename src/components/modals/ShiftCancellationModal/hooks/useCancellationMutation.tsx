import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mutateCancelShift } from '@/queries/shift-mutation';
import { FETCH_SHIFT_INFO_DATA_QUERY } from '@/queries/shift-info';
import { CALENDAR_SHIFTS_QUERY_KEY } from '@/queries/calendar-shifts';
import { SHIFTS_QUERY_KEY } from '@/queries/shifts';

export function useCancelShift(params?: {
  onSuccess?: (result?: void) => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();

  const {
    isPending,
    data: result,
    mutate: cancelShift,
    mutateAsync: cancelShiftAsync,
    reset,
    error,
  } = useMutation({
    mutationFn: mutateCancelShift,
    onSuccess: (data, variables) => {
      if (variables?.shiftId) {
        // Invalidate related queries
        queryClient.invalidateQueries({
          queryKey: [FETCH_SHIFT_INFO_DATA_QUERY, variables.shiftId],
        });
        queryClient.invalidateQueries({
          queryKey: [CALENDAR_SHIFTS_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [SHIFTS_QUERY_KEY],
        });
      }
      params?.onSuccess?.(data);
    },
    onError: params?.onError,
  });

  return {
    isPending,
    result,
    error,
    cancelShift,
    cancelShiftAsync,
    reset,
  };
}
