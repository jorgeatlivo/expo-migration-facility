import api, { handleApiError } from './api';

export function shiftCancellationResolve(
  shiftId: number,
  shiftClaimId: number
) {
  const uri = `/facility/shifts/${shiftId}/claims/${shiftClaimId}/resolve-cancellation`;

  return api
    .post(uri, null)
    .then((res) => res.data)
    .catch(handleApiError);
}

export function shiftCancellationAccept(shiftId: number, shiftClaimId: number) {
  const uri = `/facility/shifts/${shiftId}/claims/${shiftClaimId}/accept-cancellation`;

  return api
    .post(uri, null)
    .then((res) => res.data)
    .catch(handleApiError);
}

export function shiftCancelApprovedClaim(
  shiftId: number,
  shiftClaimId: number,
  reason?: string
) {
  const uri = `/facility/shifts/${shiftId}/claims/${shiftClaimId}/cancel-approved-claim`;

  return api
    .post(uri, {
      reason,
    })
    .then((res) => res.data)
    .catch(handleApiError);
}
