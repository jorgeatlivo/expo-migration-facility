export enum ProfessionalAgendaStackRoutes {
  ProfessionalAgendaList = 'ProfessionalAgendaList',
  ProfessionalAgendaDetail = 'ProfessionalAgendaDetail',
}

export type ProfessionalAgendaStackParamList = {
  [ProfessionalAgendaStackRoutes.ProfessionalAgendaList]: undefined;
  [ProfessionalAgendaStackRoutes.ProfessionalAgendaDetail]: {
    professionalId: string;
  };
};
