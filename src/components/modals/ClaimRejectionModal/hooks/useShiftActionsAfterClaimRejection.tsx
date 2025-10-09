import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  cancelShiftAfterClaimRejection,
  reduceShiftCapacityAfterClaimRejection,
} from '@/services/claims';
import { FETCH_SHIFT_INFO_DATA_QUERY } from '@/queries/shift-info';
import { CALENDAR_SHIFTS_QUERY_KEY } from '@/queries/calendar-shifts';
import { SHIFTS_QUERY_KEY } from '@/queries/shifts';

export function useCancelShiftAfterClaimRejection(params?: {
  onSuccess?: () => void;
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
    mutationFn: async (shiftId: number) => {
      return await cancelShiftAfterClaimRejection(shiftId);
    },
    onSuccess: (data, shiftId) => {
      if (shiftId) {
        // Invalidate related queries
        queryClient.invalidateQueries({
          queryKey: [FETCH_SHIFT_INFO_DATA_QUERY, shiftId],
        });
        queryClient.invalidateQueries({
          queryKey: [CALENDAR_SHIFTS_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [SHIFTS_QUERY_KEY],
        });
      }
      params?.onSuccess?.();
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

export function useReduceShiftCapacityAfterClaimRejection(params?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();

  const {
    isPending,
    data: result,
    mutate: reduceCapacity,
    mutateAsync: reduceCapacityAsync,
    reset,
    error,
  } = useMutation({
    mutationFn: async (shiftId: number) => {
      return await reduceShiftCapacityAfterClaimRejection(shiftId);
    },
    onSuccess: (data, variables) => {
      if (variables) {
        // Invalidate related queries
        queryClient.invalidateQueries({
          queryKey: [FETCH_SHIFT_INFO_DATA_QUERY, variables],
        });
        queryClient.invalidateQueries({
          queryKey: [CALENDAR_SHIFTS_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [SHIFTS_QUERY_KEY],
        });
      }
      params?.onSuccess?.();
    },
    onError: params?.onError,
  });

  return {
    isPending,
    result,
    error,
    reduceCapacity,
    reduceCapacityAsync,
    reset,
  };
}
