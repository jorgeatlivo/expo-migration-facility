import {  ShiftConfigDTO } from '@/services/shifts';
import { ProfessionalOverviewDTO } from './professionals';

export interface SearchProForShiftInvitationRequest {
  shiftConfig: ShiftConfigDTO;
  search: {
    name?: string;
    selectedProfessionalIds: number[];
  };
  page?: number;
  size?: number;
}

export interface SearchProForShiftInvitationResponse {
  page: number;
  total: number;
  finalPage: boolean;
  professionals: ProfessionalOverviewDTO[];
}
