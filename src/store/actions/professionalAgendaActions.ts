import { Alert } from 'react-native';

import { Dispatch } from 'redux';

import { ApiApplicationError } from '@/services/api';
import { fetchProfessionalAgenda } from '@/services/professionalAgenda';
import { RootState, ShiftTimeInDayEnum } from '@/types';
import { ProfessionalAgenda } from '@/types/professionalAgenda';
import {
  LOAD_PROFESSIONAL_AGENDA,
  LOAD_PROFESSIONAL_AGENDA_SUCCESS,
} from './actionTypes';

export const loadProfessionalAgendaActionSuccess = (
  professionalAgenda: ProfessionalAgenda | null
) => ({
  payload: professionalAgenda,
  type: LOAD_PROFESSIONAL_AGENDA_SUCCESS,
});

export const loadProfessionalAgendaAction = (
  date?: string,
  shiftTimeInDay?: string
) => ({
  type: LOAD_PROFESSIONAL_AGENDA,
  payload: {
    date,
    shiftTimeInDay,
  },
});

export const fetchProfessionalAgendaThunk =
  (date?: string, shiftTimeInDay?: ShiftTimeInDayEnum) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    if (state.professionalAgendaData.professionalAgendaList.isLoading) {
      return;
    }
    dispatch(loadProfessionalAgendaAction(date, shiftTimeInDay));

    try {
      const professionalAgenda = await fetchProfessionalAgenda(
        date,
        shiftTimeInDay
      );
      dispatch(loadProfessionalAgendaActionSuccess(professionalAgenda));
    } catch (error) {
      dispatch(loadProfessionalAgendaActionSuccess(null));
      if (error instanceof ApiApplicationError) {
        Alert.alert('Error', error.message);
      }
    }
  };
