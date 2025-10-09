import { useQuery } from '@tanstack/react-query';
import { TIME } from '@/queries/gc-time.enum';
import {
  queryFnShiftCancellationMetadata,
  SHIFT_CANCELLATION_METADATA_QUERY_KEY,
} from '@/queries/shift-cancellation';
import { ApiApplicationError } from '@/services/api';

export function useFetchShiftCancellationMetaData(
  shiftId?: number,
  isModalOpen?: boolean
) {
  const { data, isLoading, error } = useQuery({
    queryKey: [SHIFT_CANCELLATION_METADATA_QUERY_KEY, shiftId],
    queryFn: queryFnShiftCancellationMetadata,
    enabled: !!String(shiftId) && !!isModalOpen,
    staleTime: TIME['5_minutes'],
    retry: (failureCount, err) => {
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
    shiftCancellationMetadata: data,
    isLoading,
    error,
  };
}
