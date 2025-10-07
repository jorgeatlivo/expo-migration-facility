import {
  ProfessionalAgenda,
  ProfessionalAgendaDetailView,
} from '@/types/professionalAgenda';

import { ShiftTimeInDayEnum } from '@/types';
import api, { handleApiError } from './api';

export const fetchProfessionalAgenda = async (
  date?: string,
  shiftTimeInDay?: ShiftTimeInDayEnum
): Promise<ProfessionalAgenda> => {
  const uri =
    date && shiftTimeInDay
      ? `/facility/professionals-agenda?date=${date}&shiftTimeInDay=${shiftTimeInDay}`
      : '/facility/professionals-agenda';
  return api
    .get(uri)
    .then((response) => {
      return response.data;
    })
    .catch(handleApiError);
};

// Information for the professional detail view

export const fetchProfessionalAgendaDetailView = async (
  professionalId: string
): Promise<ProfessionalAgendaDetailView> => {
  const uri = `/facility/professionals-agenda/${professionalId}`;

  return api
    .get(uri)
    .then((response) => {
      return response.data;
    })
    .catch(handleApiError);
};
