import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectClaim } from '@/services/claims';
import { FETCH_SHIFT_INFO_DATA_QUERY } from '@/queries/shift-info';
import { CALENDAR_SHIFTS_QUERY_KEY } from '@/queries/calendar-shifts';
import { SHIFTS_QUERY_KEY } from '@/queries/shifts';

export type ShiftActionSuggestion =
  | 'SHIFT_CANCELLATION'
  | 'DECREASE_SHIFT_CAPACITY'
  | 'DECREASE_SHIFT_REMAINING_CAPACITIES'
  | null;

export interface ShiftClaimRejectResponse {
  shiftActionSuggestion: ShiftActionSuggestion;
}

export interface RejectClaimParams {
  shiftId: number;
  claimId: number;
  data: {
    reason: string;
    reasonDetail?: string;
  };
}

export function useRejectClaim(params?: {
  onSuccess?: (response?: ShiftClaimRejectResponse) => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();

  const {
    isPending,
    data: result,
    mutate: rejectClaimMutate,
    mutateAsync: rejectClaimAsync,
    reset,
    error,
  } = useMutation({
    mutationFn: async (requestParams: RejectClaimParams) => {
      return await rejectClaim({
        shiftId: requestParams.shiftId,
        claimId: requestParams.claimId,
        reason: requestParams.data.reason,
        reasonDetail: requestParams.data.reasonDetail,
      });
    },
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
    rejectClaim: rejectClaimMutate,
    rejectClaimAsync,
    reset,
  };
}
