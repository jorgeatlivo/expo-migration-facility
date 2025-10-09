import {
  ClaimRequest,
  fetchFacilityShiftClaimRequests,
  fetchShiftInfo,
} from '@/services/shifts';

import { Shift } from '@/types';

export const FETCH_SHIFT_INFO_DATA_QUERY = 'FETCH_SHIFT_INFO_DATA_QUERY';

export interface ShiftInfoData {
  shiftInfo: Shift | null;
  claimRequests: ClaimRequest[];
}

export const fetchShiftInfoData = async (
  shiftId: number
): Promise<ShiftInfoData> => {
  try {
    // TODO: Implement pagination for claimRequests LIV-319
    const [claimRequests, shiftInfo] = await Promise.all([
      fetchFacilityShiftClaimRequests(shiftId),
      fetchShiftInfo(shiftId),
    ]);

    return {
      shiftInfo: shiftInfo || null,
      claimRequests: claimRequests || [],
    };
  } catch (error) {
    return {
      shiftInfo: null,
      claimRequests: [],
    };
  }
};
