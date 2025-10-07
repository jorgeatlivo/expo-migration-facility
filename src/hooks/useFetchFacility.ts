import { useQuery } from '@tanstack/react-query';

import { fetchFacilityProfile } from '@/services/authentication';

const FETCH_FACILITY_PROFILE_QUERY = 'FETCH_FACILITY_PROFILE_QUERY';

export const useFetchFacility = () =>
  useQuery({
    queryKey: [FETCH_FACILITY_PROFILE_QUERY],
    queryFn: fetchFacilityProfile,
    retry: 3,
  });
