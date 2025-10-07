import { ProfessionalProfile } from '@/services/shifts';

export interface FacilityProfessionalsDTO {
  professionals: ProfessionalProfile[];
  placeholder: {
    input: string;
    professionalsList: string;
  };
}
