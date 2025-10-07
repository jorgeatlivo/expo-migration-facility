import { ProfessionalProfile } from '@/services/shifts';

export enum ProfessionalRole {
  EXTERNAL_PROFESSIONAL = 'PROFESSIONAL',
  INTERNAL_PROFESSIONAL = 'INTERNAL_PROFESSIONAL',
}

export interface ProfessionalOverviewDTO {
  id: number;
  name: string;
  avatarUrl?: string | null;
  favorite: boolean;
  completedShiftsInFacility: number;
  role: ProfessionalRole;
  note?: string | null;

  // FE-only field
  readOnly?: boolean;
}

export function professionalProfileToOverviewDTO(
  profile: ProfessionalProfile,
  readOnly?: boolean
): ProfessionalOverviewDTO {
  return {
    id: profile.id,
    name: `${profile.firstName} ${profile.lastName}`,
    completedShiftsInFacility: profile.totalShiftsInFacility ?? 0,
    favorite: profile.favorite ?? false,
    role:
      profile.modality === 'INTERNAL'
        ? ProfessionalRole.INTERNAL_PROFESSIONAL
        : ProfessionalRole.EXTERNAL_PROFESSIONAL,
    avatarUrl: profile.profilePictureUrl,
    readOnly,
  };
}
