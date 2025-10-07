import { ShiftTimeInDayEnum } from '.';

export type ProfessionalAgenda = {
  date: string;
  shiftTimeInDay: ShiftTimeInDayEnum;
  professionalsPerUnit: ProfessionalPerUnit[];
  next: {
    date: string;
    shiftTimeInDay: ShiftTimeInDayEnum;
  } | null;
  previous: {
    date: string;
    shiftTimeInDay: ShiftTimeInDayEnum;
  } | null;
};

export type ProfessionalPerUnit = {
  unit: string;
  professionals: ProfessionalAgendaItem[];
};

export type ProfessionalAgendaItem = {
  profilePictureUrl: string;
  firstName: string;
  lastName: string;
  tag: ProfessionalAgendaTag;
  professionalId: string;
};

export type ProfessionalAgendaTag = {
  text: string;
  color: string;
};

export type ProfessionalAgendaState = {
  professionalAgendaList: {
    professionalAgenda: ProfessionalAgenda | null;
    isLoading: boolean;
  };
};

export type ProfessionalAgendaAction =
  | {
      type: 'LOAD_PROFESSIONAL_AGENDA';
      payload: {
        date?: string;
        shiftTimeInDay?: ShiftTimeInDayEnum;
      };
    }
  | {
      type: 'LOAD_PROFESSIONAL_AGENDA_SUCCESS';
      payload: ProfessionalAgenda | null;
    };

export type ProfessionalAgendaDetailView = {
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  currentUnit: string;
  tag: {
    text: string;
    color: string;
  };
  noShowContactNumber: string;
  professionalHistoryInfo: {
    totalShiftsInFacility: number;
    facilityName: string;
    shiftsInFacility: {
      unit: string;
      numberOfShifts: number;
    }[];
  };
};
