import { useEffect, useRef } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
  FillRatePredictionParams,
  fetchShiftFillRateProbabilities,
} from '@/services/shifts';

import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export const FETCH_FILL_RATE_PREDICTION = 'FETCH_FILL_RATE_PREDICTION';

export const useFetchFillRatePrediction = (
  params: Omit<FillRatePredictionParams, 'temporalId'>
) => {
  const queryClient = useQueryClient();
  const temporalId = useRef<string | undefined>();
  const debouncedParams = useDebouncedValue(
    { ...params, temporalId: temporalId.current },
    300
  );

  const queryData = useQuery({
    queryKey: [FETCH_FILL_RATE_PREDICTION, JSON.stringify(debouncedParams)],
    queryFn: () => fetchShiftFillRateProbabilities(debouncedParams),
    enabled: !!params.unit && !!params.category,
    keepPreviousData: true,
    retry: false,
  });

  if (!temporalId.current && queryData.data?.temporalId) {
    temporalId.current = queryData.data.temporalId;
  }

  useEffect(
    () => () => {
      queryClient.removeQueries({ queryKey: [FETCH_FILL_RATE_PREDICTION] });
      temporalId.current = undefined;
    },
    [queryClient]
  );

  return queryData;
};
