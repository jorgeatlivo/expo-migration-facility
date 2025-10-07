import { FacilityProfessionalsDTO } from '@/components/widgets/professionals/types';

import { LivoCVDetailsDTO } from '@/types/curriculum';

import api, { handleApiError } from './api';
import { ProfessionalProfile } from './shifts';

export async function fetchFacilityProfessionals(): Promise<FacilityProfessionalsDTO> {
  const uri = '/facility/professionals';
  return api
    .get(uri)
    .then((res) => res.data)
    .catch(handleApiError);
}

export async function updateFavoriteProfessional(
  professionalId: string,
  favorite: boolean
): Promise<boolean | void> {
  const uri = `/facility/professionals/${professionalId}/update-favorite`;
  return api
    .post(uri, null, { params: { favorite } })
    .then((res) => res.status === 200)
    .catch(handleApiError);
}

export async function fetchLivoCVDetails(
  professionalId: number
): Promise<LivoCVDetailsDTO> {
  const url = `/facility/professionals/${professionalId}/cv-details`;

  return api
    .get(url)
    .then((response) => response.data)
    .catch(handleApiError);
}

export async function fetchProfessionalProfile(
  professionalId: number
): Promise<ProfessionalProfile> {
  const url = `/facility/professionals/${professionalId}/profile`;

  return api
    .get(url)
    .then((response) => response.data)
    .catch(handleApiError);
}
