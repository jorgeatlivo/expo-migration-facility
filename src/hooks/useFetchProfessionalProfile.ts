import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { fetchProfessionalProfile } from '@/services/professionals';

const FETCH_PROFESSIONAL_PROFILE_QUERY = 'FETCH_PROFESSIONAL_PROFILE_QUERY';

export const useFetchProfessionalProfile = (professionalId: number) =>
  useQuery({
    queryKey: [FETCH_PROFESSIONAL_PROFILE_QUERY],
    queryFn: useCallback(
      () => fetchProfessionalProfile(professionalId),
      [professionalId]
    ),
    retry: 1,
  });
