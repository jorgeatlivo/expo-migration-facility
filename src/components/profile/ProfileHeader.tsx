import React from 'react';
import { ProfessionalProfile } from '@/services/shifts';
import { ProfileHeaderComponent } from './ProfileHeaderComponent';
import { FacilityStaffProfile, ShiftModalityEnum } from '@/types';
import { TouchableOpacity } from 'react-native-gesture-handler';

type ProfileHeaderProps = {
  modality: ShiftModalityEnum | null;
  professionalProfile: ProfessionalProfile;
  facilityProfile: FacilityStaffProfile;
  navigateToReviews: () => void;
  note?: string | null;
};

export default function ProfileHeader({
  modality,
  professionalProfile,
  facilityProfile,
  navigateToReviews,
  note,
}: ProfileHeaderProps) {
  return modality === ShiftModalityEnum.INTERNAL ? (
    <ProfileHeaderComponent
      modality={modality}
      professionalProfile={professionalProfile}
      facilityProfile={facilityProfile}
      note={note}
    />
  ) : (
    <ProfileHeaderComponent
      modality={modality}
      professionalProfile={professionalProfile}
      facilityProfile={facilityProfile}
      note={note}
      subtitleComponent={
        <TouchableOpacity
          disabled={
            professionalProfile.professionalReview?.averageRating === null
          }
          onPress={() => navigateToReviews()}
        ></TouchableOpacity>
      }
    />
  );
}
