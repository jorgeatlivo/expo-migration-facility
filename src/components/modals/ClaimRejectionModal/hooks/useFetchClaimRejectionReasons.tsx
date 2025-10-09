import { useQuery } from '@tanstack/react-query';

import { ApiApplicationError } from '@/services/api';
import { fetchClaimRejectionReasons } from '@/services/claims';
import { TIME } from '@/queries/gc-time.enum';

export interface RejectionReason {
  name: string;
  displayText: string;
}

export function useFetchClaimRejectionReasons(isModalOpen?: boolean) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['claimRejectionReasons'],
    queryFn: fetchClaimRejectionReasons,
    enabled: !!isModalOpen,
    staleTime: TIME['5_minutes'],
    retry: (failureCount, err) => {
      if (err instanceof ApiApplicationError) {
        // Don't retry for certain error codes if needed
        return false;
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
    rejectionReasons: data ?? [],
    isLoading,
    error,
  };
}
