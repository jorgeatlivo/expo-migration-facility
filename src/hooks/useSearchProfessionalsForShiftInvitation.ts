import { useMemo } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import { searchProfessionalsForShiftInvitation } from '@/services/shiftInvitations';
import { ShiftConfigDTO } from '@/services/shifts';

import { SearchProForShiftInvitationResponse } from '@/types/shiftInvitations';

const QUERY_KEY = 'SEARCH_PROFESSIONALS_FOR_SHIFT_INVITATION';
const QUERY_CONFIG = {
  staleTime: 30_000, // 3 seconds
  gcTime: 3 * 60 * 1000, // 3 minutes
};
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

function buildShiftConfigKey(shiftConfig: ShiftConfigDTO) {
  // Normalize date values to timestamps to keep queryKey stable
  return {
    ...shiftConfig,
    startTime: shiftConfig?.startTime
      ? new Date(shiftConfig.startTime).getTime()
      : null,
    endTime: shiftConfig?.endTime
      ? new Date(shiftConfig.endTime).getTime()
      : null,
  };
}

export function useSearchProfessionalsForShiftInvitations(
  shiftConfig: ShiftConfigDTO,
  searchTerm: string,
  selectedProfessionalIds: number[],
  pageSize: number = DEFAULT_PAGE_SIZE
) {
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const shiftConfigKey = shiftConfig ? buildShiftConfigKey(shiftConfig) : null;
  const fullQueryKey = useMemo(
    () => [
      QUERY_KEY,
      shiftConfigKey,
      debouncedSearchTerm ?? '',
      selectedProfessionalIds ?? [],
      pageSize,
    ],
    [shiftConfigKey, debouncedSearchTerm, selectedProfessionalIds, pageSize]
  );

  // @ts-ignore
  const query = useInfiniteQuery<SearchProForShiftInvitationResponse>({
    queryKey: fullQueryKey,
    queryFn: async ({ pageParam = DEFAULT_PAGE }) => {
      return searchProfessionalsForShiftInvitation({
        shiftConfig: shiftConfig as ShiftConfigDTO,
        search: {
          name: debouncedSearchTerm || undefined,
          selectedProfessionalIds,
        },
        page: pageParam as number,
        size: pageSize,
      });
    },
    initialPageParam: DEFAULT_PAGE,
    getNextPageParam: (lastPage) =>
      lastPage.finalPage ? undefined : lastPage.page + 1,
    staleTime: QUERY_CONFIG.staleTime,
    gcTime: QUERY_CONFIG.gcTime,
  });

  const professionals = useMemo(
    () =>
      query.data?.pages.flatMap(
        (page) => (page as SearchProForShiftInvitationResponse).professionals
      ) ?? [],
    [query.data]
  );

  return {
    professionals: professionals,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    data: query.data,
  };
}
