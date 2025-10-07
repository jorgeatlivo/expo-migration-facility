import { ClaimRequest, SpecializationDTO } from '@/services/shifts';
import { ProfessionalAgendaState } from './professionalAgenda';
import { ProfessionalOverviewDTO } from './professionals';

export enum ShiftTimeStatusEnum {
  'PAST' = 'PAST',
  'ONGOING' = 'ONGOING',
  'UPCOMING' = 'UPCOMING',
}

export enum CategoryCode {
  Nurse = 'ENF',
  TCAE = 'TCAE',
  Doctor = 'DOC',
  Other = 'OTHER',
}

export type Category = {
  code: CategoryCode;
  acronym: string;
  displayText: string;
  visibleForLivoPool: boolean;
  visibleForLivoInternal: boolean;
};

export type ShiftOnboardingStatus = 'PENDING_APPROVAL' | 'APPROVED';

export type ShiftSummaryData = {
  specialization?: string;
  livoUnit?: string;
  professionalField?: string;
  startTime: string;
  finishTime: string;
  shiftTimeInDay: string;
  price: string;
};

export type ShiftOnboarding = {
  status: ShiftOnboardingStatus;
  coverageShift?: ShiftSummaryData;
};

export interface Shift {
  id: number;
  shiftTimeInDay: ShiftTimeInDayEnum;
  date: string;
  status: string;
  capacity: number;

  // deprecated by Skills project
  specialization: SpecializationDTO;

  professionalField: ValueDisplayPair;
  livoUnit?: ValueDisplayPair;
  unit?: string;

  totalAcceptedClaims: number;
  totalPendingClaims: number;
  totalPendingInvitationClaims: number;
  hourRate: string;
  totalPay: string;
  currency: string;
  startTime: string;
  finishTime: string;
  details?: string;
  shiftTimeStatus: ShiftTimeStatusEnum;
  unitVisible: boolean;
  internalVisible: boolean;
  externalVisible: boolean;
  livoPoolOnboarded: boolean;
  livoInternalOnboarded: boolean;
  totalCancellationRequests: number;
  multipleClaimsEnabled: boolean;
  externalId: string;
  category: Category;
  onboardingShiftsRequired: boolean;
  onboardingShiftsPrice: string;
  shiftActionsAllow: boolean;
  onboarding?: ShiftOnboarding;
  skills: {
    displayText: string;
    value: string;
  }[];
  title: string;
  shouldShowSlotReasonList: boolean;
  holiday?: boolean;
  compensationOptions?: {
    value: string;
    displayText: string;
  }[];

  // FE-only field for communicating between components
  invitedProfessionals: ProfessionalOverviewDTO[];
  selectedCompensationOptions?: string[];
}

export interface DayShift {
  date: string;
  holiday?: boolean;
  shifts: Shift[];
  hasAlert: boolean;
}

export type ShiftAction =
  | { type: 'LOAD_DAY_SHIFTS' }
  | { type: 'LOAD_DAY_SHIFTS_SUCCESS'; payload: DayShift[] }
  | { type: 'LOAD_PAST_SHIFT_DAYS' }
  | { type: 'LOAD_PAST_SHIFT_DAYS_SUCCESS'; payload: DayShift[] }
  | { type: 'LOAD_SHIFT_INFO' }
  | {
      type: 'LOAD_SHIFT_INFO_SUCCESS';
      payload: { shiftInfo: Shift; claimRequests: ClaimRequest[] };
    }
  | { type: 'TOGGLE_NEW_SHIFT_AVAILABLE'; payload: boolean }
  | { type: 'NEW_NOTIFICATION_TOGGLE'; payload: boolean }
  | { type: 'SET_DAY_SELECTED'; payload: string };

export type ProfileAction =
  | { type: 'LOAD_FACILITY_PROFILE_ACTION'; payload: FacilityStaffProfile }
  | {
      type: 'LOAD_FACILITY_PROFILE_ACTION_SUCCESS';
      payload: FacilityStaffProfile;
    }
  | { type: 'LOAD_FACILITY_PROFILE_ACTION_ERROR'; payload: string };

export type ProfileState = {
  facilityProfile: FacilityStaffProfile;
  isLoading: boolean;
};

export type ConfigurationAction =
  | {
      type: 'LOAD_LIVO_CONTACT';
      payload: LivoContact;
    }
  | {
      type: 'SET_LAST_ACTIVE_TIME';
      payload: string;
    }
  | {
      type: 'SET_APP_STATE';
      payload: string;
    }
  | {
      type: 'LOAD_USER_ID';
      payload: string;
    };

type AuthenticationState = {
  token: string;
  isSigningOut: boolean;
  isLoading: boolean;
  isSigningUp: boolean;
  isSigningIn: boolean;
  email: string;
};

export type RootState = {
  shiftData: ShiftState;
  claimData: ClaimState;
  profileData: ProfileState;
  configurationData: {
    livoContact: LivoContact;
    lastActiveTime: string;
    appState: string;
    userId: string;
  };
  professionalAgendaData: ProfessionalAgendaState;
  authData: AuthenticationState;
};

export type ShiftState = {
  dayShiftsData: {
    dayShifts: DayShift[];
    isLoading: boolean;
    newShiftAvailable: boolean;
  };
  pastDayShiftsData: {
    pastDayShifts: DayShift[];
    isLoading: boolean;
  };
  shiftInfoData: {
    isLoading: boolean;
    shiftInfo: Shift | null;
    claimRequests: ClaimRequest[];
  };
  newNotificationToggle: boolean;
  calendarData: {
    daySelected: string;
  };
};

export type ClaimAction =
  | { type: 'CLAIM_INFO_LOADING' }
  | { type: 'CLAIM_INFO_NOT_LOADING' }
  | { type: 'LOAD_CLAIM_INFO'; payload: ClaimRequest };

export interface ValueDisplayPair<T = string> {
  value: T;
  displayText: string;
}

export type ClaimState = {
  claimRequest: ClaimRequest;
  isLoading: boolean;
};

export type ClaimSummary = {
  professionalId: number;
  shiftId: number;
  claimId: number;
};

export type Unit = {
  displayName: string;
  value: string;
};

export type FacilityStaffProfile = {
  email: string;
  firstName: string;
  lastName: string;
  facility: FacilityInfo;
  livoPoolOnboarded: boolean;
  livoInternalOnboarded: boolean;
  visibleTabMenu: string[];
  lastTimeSignIn: string;
  multipleClaimsEnabled: boolean;
  units: Unit[];
  userFeatures: UserFeatureEnum[];
  locale: string;
  country: string;
};

export type FacilityInfo = {
  id: number;
  name: string;
  address: string;
  addressLatitude: number;
  addressLongitude: number;
  mapLink: string;
  addressCity: string;
  addressCountry: string;
  categories: Category[];
};

export type LivoContact = {
  email: string;
  phoneNumber: string;
  whatsappLink: string;
  termsAndConditionsLink: string;
  cookiesPolicyLink: string;
  privacyPolicyLink: string;
};

export enum ShiftModalityEnum {
  'INTERNAL' = 'INTERNAL',
  'EXTERNAL' = 'EXTERNAL',
}

export enum ShiftTimeInDayEnum {
  DAY_SHIFT = 'DAY_SHIFT',
  EVENING_SHIFT = 'EVENING_SHIFT',
  NIGHT_SHIFT = 'NIGHT_SHIFT',
}

export enum UserFeatureEnum {
  FAVOURITE_PROFESSIONALS_MANAGEMENT = 'FAV_PRO_MGMT',
  SHIFT_UNIT_AND_PROFESSIONAL_FIELDS = 'SHIFT_UNIT_AND_FIELDS_ENABLED',
  FACILITY_PROFESSIONAL_INVITE_ENABLED = 'FACILITY_PROFESSIONAL_INVITE_ENABLED',
}
