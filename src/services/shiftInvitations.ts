import { SearchProForShiftInvitationRequest, SearchProForShiftInvitationResponse } from "@/types/shiftInvitations";
import api, { handleApiError } from "./api";

export function searchProfessionalsForShiftInvitation(searchRequest: SearchProForShiftInvitationRequest): Promise<SearchProForShiftInvitationResponse> {
  const url = `/facility/shift-invitation/search`;

  return api
    .post(url, searchRequest)
    .then(response => response.data)
    .catch(handleApiError);
}
