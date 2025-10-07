import { Dispatch } from 'redux';

import { fetchClaimInfo } from '@/services/claims';
import { ClaimRequest, CVType } from '@/services/shifts';

import {
  CLAIM_INFO_LOADING,
  CLAIM_INFO_NOT_LOADING,
  LOAD_CLAIM_INFO,
} from './actionTypes';

export const claimInfoLoadingAction = () => ({
  type: CLAIM_INFO_LOADING,
});

export const claimInfoNotLoadingAction = () => ({
  type: CLAIM_INFO_NOT_LOADING,
});

export const loadClaimInfoAction = (claimRequest: ClaimRequest) => ({
  type: LOAD_CLAIM_INFO,
  payload: claimRequest,
});

export const fetchClaimInfoAction =
  (shiftId: number, shiftClaimId: number) => async (dispatch: Dispatch) => {
    dispatch(claimInfoLoadingAction());

    return fetchClaimInfo(shiftId, shiftClaimId)
      .then((response) => dispatch(loadClaimInfoAction(response)))
      .catch(() => dispatch(claimInfoNotLoadingAction()));
  };
