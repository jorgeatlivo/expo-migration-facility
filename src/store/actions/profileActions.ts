import { FacilityStaffProfile, RootState } from "../../types";
import { fetchFacilityProfile } from "../../services/authentication";
import { ApiApplicationError } from "../../services/api";
import { Dispatch } from 'redux';
import i18n from "../../locale/i18n";

export const loadFacilityProfileAction = () => ({
    type: 'LOAD_FACILITY_PROFILE_ACTION'
  })
  
  export const loadFacilityProfileActionSuccess = (facilityProfile: FacilityStaffProfile) => ({
    type: 'LOAD_FACILITY_PROFILE_ACTION_SUCCESS',
    payload: facilityProfile
  })
  
  export const loadFacilityProfileActionError = (error: string) => ({
    type: 'LOAD_FACILITY_PROFILE_ACTION_ERROR',
    payload: error
  })

  export const fetchFacilityProfileAction = () => async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    if (state.profileData.isLoading) {
      return;
    }
    dispatch(loadFacilityProfileAction());
    return fetchFacilityProfile()
      .then(async response => {
        dispatch(loadFacilityProfileActionSuccess(response));
      })
      .catch(error => {
        const errorMessage =
          error instanceof ApiApplicationError
            ? error.message
            : i18n.t('common_unexpected_error_message');
        dispatch(loadFacilityProfileActionError(errorMessage))
      });
  };
  