import api, { handleApiError } from './api';
import { ClaimRequest } from './shifts';

export function fetchClaimInfo(
  shiftId: number,
  shiftClaimId: number
): Promise<ClaimRequest> {
  const uri = `/facility/shifts/${shiftId}/claims/${shiftClaimId}`;
  return api
    .get(uri)
    .then((res) => res.data)
    .catch(handleApiError);
}
