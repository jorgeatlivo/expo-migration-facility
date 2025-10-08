import { NavigatorScreenParams } from '@react-navigation/native';

import { ProfessionalReviewInfo, ShiftConfigDTO } from '@/services/shifts';

import { ProfessionalOverviewDTO } from '@/types/professionals';

import { TabsParamsList } from '@/router/TabNavigator.types';
import { Category, ClaimSummary, Shift } from '@/types';

export enum ProtectedStackRoutes {
  Home = 'Home',
  PublishShift = 'PublishShift',
  ShiftDetails = 'ShiftDetails',
  EditShift = 'EditShift',
  ProfessionalProfile = 'ProfessionalProfile',
  FavoriteProfessionals = 'FavoriteProfessionals',
  ChangePassword = 'ChangePassword',
  ProfessionalReviews = 'ProfessionalReviews',
  SelectCategory = 'SelectCategory',
  PdfViewer = 'PdfViewer',
  LivoCV = 'LivoCV',
  ViewProfessionalProfile = 'ViewProfessionalProfile',
  SearchProfessionalForShiftInvitation = 'SearchProfessionalForShiftInvitation',
}

export type ProtectedStackParamsList = {
  [ProtectedStackRoutes.Home]: NavigatorScreenParams<TabsParamsList>;
  [ProtectedStackRoutes.PublishShift]: {
    date: string;
    timeInDay: string;
  };
  [ProtectedStackRoutes.ShiftDetails]: { shiftId: number };
  [ProtectedStackRoutes.ProfessionalProfile]: {
    shiftId: number;
    claimId: number;
  };
  [ProtectedStackRoutes.FavoriteProfessionals]:
    | { origin?: ClaimSummary }
    | undefined;
  [ProtectedStackRoutes.ChangePassword]: undefined;
  [ProtectedStackRoutes.PdfViewer]: { uri: string };
  [ProtectedStackRoutes.LivoCV]: { professionalId: number };

  [ProtectedStackRoutes.ProfessionalReviews]: {
    reviewInfo: ProfessionalReviewInfo;
  };
  [ProtectedStackRoutes.EditShift]: {
    shiftInfo: Shift;
  };
  [ProtectedStackRoutes.SelectCategory]: {
    categories: Category[];
    onSelectCategory: (category: Category) => any;
  };
  [ProtectedStackRoutes.ViewProfessionalProfile]: {
    professionalId: number;
    note?: string | null;
    source?: ProtectedStackRoutes;
  };
  [ProtectedStackRoutes.SearchProfessionalForShiftInvitation]: {
    shiftConfig: ShiftConfigDTO;
    selectedProfessionalIds: number[];
    onSelectPro: (selectedPro?: ProfessionalOverviewDTO) => void;
    source?: ProtectedStackRoutes;
  };
};
