import { useQuery } from '@tanstack/react-query';
import {
  FETCH_SHIFT_INFO_DATA_QUERY,
  fetchShiftInfoData,
} from '@/queries/shift-info';

export const useFetchShiftInfoData = (shiftId: number) =>
  useQuery({
    queryKey: [FETCH_SHIFT_INFO_DATA_QUERY, shiftId],
    queryFn: () => fetchShiftInfoData(shiftId),
    retry: 1,
    enabled: !!shiftId,
  });
