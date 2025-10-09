import api, { handleApiError } from './api';
import { ClaimRequest } from './shifts';

export interface RejectionReason {
  name: string;
  displayText: string;
}

export interface RejectClaimRequest {
  reason: string;
  reasonDetail?: string;
}

export interface ShiftClaimRejectResponse {
  shiftActionSuggestion:
    | 'SHIFT_CANCELLATION'
    | 'DECREASE_SHIFT_CAPACITY'
    | 'DECREASE_SHIFT_REMAINING_CAPACITIES'
    | null;
}

export async function fetchClaimInfo(
  shiftId: number,
  shiftClaimId: number
): Promise<ClaimRequest> {
  const uri = `/facility/shifts/${shiftId}/claims/${shiftClaimId}`;
  return api
    .get(uri)
    .then((res) => res.data)
    .catch(handleApiError);
}

export async function fetchClaimRejectionReasons(): Promise<RejectionReason[]> {
  const uri = '/facility/common/shift-claim-reject-reasons';
  return api
    .get(uri)
    .then((res) => res.data)
    .catch(handleApiError);
}

export async function rejectClaim({
  shiftId,
  claimId,
  reason,
  reasonDetail,
}: {
  shiftId: number;
  claimId: number;
  reason: string;
  reasonDetail?: string;
}): Promise<ShiftClaimRejectResponse> {
  const uri = `/facility/shifts/${shiftId}/claims/${claimId}/reject-claim`;
  const body: RejectClaimRequest = {
    reason,
    reasonDetail,
  };
  return api
    .post(uri, body)
    .then((res) => res.data)
    .catch(handleApiError);
}

export async function cancelShiftAfterClaimRejection(
  shiftId: number
): Promise<void> {
  const uri = `/facility/shifts/${shiftId}/cancel-shift-after-claim-rejection`;
  return api
    .post(uri)
    .then((res) => res.data)
    .catch(handleApiError);
}

export async function reduceShiftCapacityAfterClaimRejection(
  shiftId: number
): Promise<void> {
  const uri = `/facility/shifts/${shiftId}/reduce-shift-capacity-after-claim-rejection`;
  return api
    .post(uri)
    .then((res) => res.data)
    .catch(handleApiError);
}
