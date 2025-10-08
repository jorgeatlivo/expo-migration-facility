export enum TabRoutes {
  ShiftsList = 'shift-listing',
  ShiftsCalendar = 'shift-calendar',
  Settings = 'Settings',
  ProAgenda = 'professional-agenda',
}

export type TabsParamsList = {
  [TabRoutes.ShiftsList]: undefined;
  [TabRoutes.ShiftsCalendar]: undefined;
  [TabRoutes.Settings]: undefined;
  [TabRoutes.ProAgenda]: undefined;
};
