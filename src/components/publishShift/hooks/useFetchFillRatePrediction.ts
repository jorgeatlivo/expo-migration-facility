import { useEffect, useLayoutEffect, useState } from 'react';

import { keepPreviousData } from '@tanstack/query-core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import {
  FillRatePredictionParams,
  fetchShiftFillRateProbabilities,
  ShiftFillRateResponse,
} from '@/services/shifts';

export const FETCH_FILL_RATE_PREDICTION = 'FETCH_FILL_RATE_PREDICTION';

export const useFetchFillRatePrediction = (
  params: Omit<FillRatePredictionParams, 'temporalId'>
) => {
  const queryClient = useQueryClient();
  const [debouncedParams] = useDebounce(params, 300);
  const [temporalId, setTemporalId] = useState<string | undefined>();

  const queryData = useQuery<ShiftFillRateResponse>({
    queryKey: [FETCH_FILL_RATE_PREDICTION, debouncedParams],
    queryFn: () =>
      fetchShiftFillRateProbabilities({
        ...debouncedParams,
        temporalId,
      }),
    enabled: !!params.unit && !!params.category,
    placeholderData: keepPreviousData,
    retry: false,
  });

  useLayoutEffect(() => {
    if (!temporalId && queryData.data?.temporalId) {
      setTemporalId(queryData.data.temporalId);
    }
  }, [queryData?.data?.temporalId, temporalId]);

  /**
   * Cleanup the query and temporalId when the component unmounts
   */
  useEffect(
    () => () => {
      queryClient.removeQueries({ queryKey: [FETCH_FILL_RATE_PREDICTION] });
      setTemporalId(undefined);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return queryData;
};
