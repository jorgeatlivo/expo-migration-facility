import { Dispatch } from 'redux';
import { ClaimRequest, fetchFacilityShiftClaimRequests, fetchShiftInfo } from "../../services/shifts";
import { DayShift, Shift } from "../../types";
import { LOAD_CLAIM_REQUESTS, LOAD_CLAIM_REQUESTS_SUCCESS, LOAD_DAY_SHIFTS, LOAD_DAY_SHIFTS_SUCCESS, LOAD_PAST_SHIFT_DAYS, LOAD_PAST_SHIFT_DAYS_SUCCESS, LOAD_SHIFT_INFO, LOAD_SHIFT_INFO_SUCCESS, NEW_NOTIFICATION_TOGGLE, SET_APP_STATE, SET_DAY_SELECTED, SET_LAST_ACTIVE_TIME, TOGGLE_NEW_SHIFT_AVAILABLE } from "./actionTypes";

export const loadShiftsActionSuccess = (shifts: DayShift[]) => ({
    payload: shifts,
    type: LOAD_DAY_SHIFTS_SUCCESS
})

export const loadShiftsAction = () => ({
    type: LOAD_DAY_SHIFTS,
})

export const loadPastShiftDaysAction = () => ({
    type: LOAD_PAST_SHIFT_DAYS
})

export const loadPastShiftDaysActionSuccess = (shifts: DayShift[]) => ({
    payload: shifts,
    type: LOAD_PAST_SHIFT_DAYS_SUCCESS
})

export const loadClaimRequestsActionSuccess = (shiftId: number, claimRequests: any) => ({
    payload: {
        claimRequests,
        shiftId
    },
    type: LOAD_CLAIM_REQUESTS_SUCCESS
})

export const loadClaimRequestsAction = () => ({
    type: LOAD_CLAIM_REQUESTS
})

export const loadShiftInfoAction = () => ({
    type: LOAD_SHIFT_INFO
})

export const loadShiftInfoActionSuccess = (shiftInfo: Shift | null, claimRequests: ClaimRequest[]) => ({
    payload: {shiftInfo, claimRequests},
    type: LOAD_SHIFT_INFO_SUCCESS
})
export const toggleNewShiftAvailableAction = (newShiftAvailable: boolean) => ({
    payload: newShiftAvailable,
    type: TOGGLE_NEW_SHIFT_AVAILABLE
})


export const fetchShiftInfoDataAction = (
    shiftId: number
  ) => async (dispatch: Dispatch) => {
    
    dispatch(loadShiftInfoAction());
  
    try {
        // TODO: Implement pagination for claimRequests LIV-319
      const claimRequests = await fetchFacilityShiftClaimRequests(shiftId); 
      const shiftInfo = await fetchShiftInfo(shiftId)
  
      dispatch(loadShiftInfoActionSuccess(shiftInfo ||  null, claimRequests));
    } catch (error) {
      dispatch(loadShiftInfoActionSuccess(null, []));
      throw error;
    }
  };

  export const newNotificationToggleAction = (newNotificationToggle: boolean) => ({
    payload: newNotificationToggle,
    type: NEW_NOTIFICATION_TOGGLE
  })

  export const setDaySelectedAction = (daySelected: string) => ({
    payload: daySelected,
    type: SET_DAY_SELECTED
  })