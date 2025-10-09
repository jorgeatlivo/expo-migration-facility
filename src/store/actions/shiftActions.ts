import { Dispatch } from 'redux';

import {
  ClaimRequest,
  fetchFacilityShiftClaimRequests,
  fetchShiftInfo,
} from '@/services/shifts';

import { Shift } from '@/types';
import {
  LOAD_SHIFT_INFO,
  LOAD_SHIFT_INFO_SUCCESS,
  NEW_NOTIFICATION_TOGGLE,
  SET_DAY_SELECTED,
  TOGGLE_NEW_SHIFT_AVAILABLE,
} from './actionTypes';

export const loadShiftInfoAction = () => ({
  type: LOAD_SHIFT_INFO,
});

export const loadShiftInfoActionSuccess = (
  shiftInfo: Shift | null,
  claimRequests: ClaimRequest[]
) => ({
  payload: { shiftInfo, claimRequests },
  type: LOAD_SHIFT_INFO_SUCCESS,
});
export const toggleNewShiftAvailableAction = (newShiftAvailable: boolean) => ({
  payload: newShiftAvailable,
  type: TOGGLE_NEW_SHIFT_AVAILABLE,
});

export const fetchShiftInfoDataAction =
  (shiftId: number) => async (dispatch: Dispatch) => {
    dispatch(loadShiftInfoAction());

    try {
      // TODO: Implement pagination for claimRequests LIV-319
      const claimRequests = await fetchFacilityShiftClaimRequests(shiftId);
      const shiftInfo = await fetchShiftInfo(shiftId);

      dispatch(loadShiftInfoActionSuccess(shiftInfo || null, claimRequests));
    } catch (error) {
      dispatch(loadShiftInfoActionSuccess(null, []));
      throw error;
    }
  };

export const newNotificationToggleAction = (
  newNotificationToggle: boolean
) => ({
  payload: newNotificationToggle,
  type: NEW_NOTIFICATION_TOGGLE,
});

export const setDaySelectedAction = (daySelected: string) => ({
  payload: daySelected,
  type: SET_DAY_SELECTED,
});
