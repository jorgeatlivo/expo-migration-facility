import { QueryFunction } from '@tanstack/react-query';

import {
  fetchShiftCancellationMetadata,
  ShiftCancellationMetadata,
} from '@/services/shifts';

export const SHIFT_CANCELLATION_METADATA_QUERY_KEY =
  'SHIFT_CANCELLATION_METADATA';

export const queryFnShiftCancellationMetadata: QueryFunction<
  ShiftCancellationMetadata,
  unknown[]
> = async ({ queryKey }) => {
  const [, shiftId] = queryKey;

  return await fetchShiftCancellationMetadata(shiftId as number);
};
