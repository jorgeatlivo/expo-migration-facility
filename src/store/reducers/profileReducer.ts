import { ProfileAction } from "../../types";

const initialState = {
  facilityProfile: null,
  isLoading: false,
};

const profileReducer = (state = initialState, action: ProfileAction) => {
  switch (action.type) {
    case 'LOAD_FACILITY_PROFILE_ACTION':
      return { ...state, isLoading: true }
    case 'LOAD_FACILITY_PROFILE_ACTION_SUCCESS': {
      return { ...state, facilityProfile: action.payload, isLoading: false }
    }
    case 'LOAD_FACILITY_PROFILE_ACTION_ERROR':
      return { ...state, isLoading: false }
    default:
      return state;
  }
};

export default profileReducer;
