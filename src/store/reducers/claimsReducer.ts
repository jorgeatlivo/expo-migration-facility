import {
  CLAIM_INFO_LOADING,
  CLAIM_INFO_NOT_LOADING,
  LOAD_CLAIM_INFO,
} from '@/store/actions/actionTypes';

import { ClaimAction } from '@/types';

const initialState = {
  claimRequest: null,
  isLoading: true,
};

const claimsReducer = (state = initialState, action: ClaimAction) => {
  switch (action.type) {
    case CLAIM_INFO_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case CLAIM_INFO_NOT_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    case LOAD_CLAIM_INFO:
      return {
        ...state,
        claimRequest: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default claimsReducer;
