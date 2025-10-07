import {
  ProfessionalAgendaAction,
  ProfessionalAgendaState,
} from '@/types/professionalAgenda';
import {
  LOAD_PROFESSIONAL_AGENDA,
  LOAD_PROFESSIONAL_AGENDA_SUCCESS,
} from '@/store/actions/actionTypes';

const initialState: ProfessionalAgendaState = {
  professionalAgendaList: {
    isLoading: false,
    professionalAgenda: null,
  },
};

const professionalAgendaReducer = (
  state = initialState,
  action: ProfessionalAgendaAction
) => {
  switch (action.type) {
    case LOAD_PROFESSIONAL_AGENDA:
      return {
        ...state,
        professionalAgendaList: {
          ...state.professionalAgendaList,
          professionalAgenda: {
            date: action.payload.date,
            shiftTimeInDay: action.payload.shiftTimeInDay,
            professionalsPerUnit: [],
            next: null,
            previous: null,
          },
          isLoading: true,
        },
      };
    case LOAD_PROFESSIONAL_AGENDA_SUCCESS:
      return {
        ...state,
        professionalAgendaList: {
          ...state.professionalAgendaList,
          professionalAgenda: action.payload,
          isLoading: false,
        },
      };
    default:
      return state;
  }
};

export default professionalAgendaReducer;
