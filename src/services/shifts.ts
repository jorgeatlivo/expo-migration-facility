import useSWR from 'swr';

import { IconDTO } from '@/types/widgets';

import { formatDateToYYYYMMDD, mapDayShift, mapShift } from '@/common/utils';
import {
  Category,
  DayShift,
  Shift,
  ShiftModalityEnum,
  ShiftSummaryData,
  ValueDisplayPair,
} from '@/types';
import api, { handleApiError } from './api';

type FetchShiftParams = {
  fromDate?: string;
  toDate?: string;
  sortOrder?: string;
  withPendingClaims?: boolean;
  isFilled?: boolean;
};
export async function fetchShifts(
  fromDate?: Date,
  toDate?: Date,
  ordering: 'ASC' | 'DESC' = 'ASC',
  withPendingClaims?: boolean,
  isFilled?: boolean
): Promise<DayShift[] & { noFilter?: boolean }> {
  const uri = '/facility/shifts';

  const params: FetchShiftParams = {};
  if (fromDate) {
    params.fromDate = formatDateToYYYYMMDD(fromDate);
  }
  if (toDate) {
    params.toDate = formatDateToYYYYMMDD(toDate);
  }

  if (ordering) {
    params.sortOrder = ordering;
  }

  if (withPendingClaims !== undefined) {
    params.withPendingClaims = withPendingClaims;
  }

  if (isFilled !== undefined) {
    params.isFilled = isFilled;
  }

  return api
    .get(uri, { params })
    .then((response) => {
      return response.data ? response.data.map(mapDayShift) : [];
    })
    .catch(handleApiError);
}

export function useConfiguration(category?: string) {
  const fetcher = () =>
    api
      .get(
        '/facility/config/publish-shift-config',
        category
          ? {
              params: {
                category,
              },
            }
          : {}
      )
      .then(
        (res) =>
          ({
            ...res.data,
          }) as PublishShiftConfigurationDTO
      )
      .catch(handleApiError);

  const { data, error, isLoading } = useSWR(
    '/facility/config/publish-shift-config',
    fetcher
  );

  return {
    configuration: data,
    error,
    isLoading,
  };
}

export async function publishShift(shiftRequest: ShiftPublicationRequest) {
  const uri = '/facility/shifts/create-shift';

  return api.post(uri, shiftRequest).catch(handleApiError);
}

export async function fetchFacilityShiftClaimRequests(shiftId: number) {
  const uri = `/facility/shifts/${shiftId}/claims`;
  return api
    .get(uri)
    .then((res) => {
      return res.data.rows
        .filter(
          (claimRequest: any) =>
            claimRequest.status !== 'PROFESSIONAL_SELF_CANCELLED'
        )
        .map((claimRequest: any) => ({
          ...claimRequest,
        }));
    })
    .catch(handleApiError);
}

export async function shiftClaimAccept(
  shiftId: number,
  shiftClaimId: number,
  slotReason?: string | null,
  slotReasonComment?: string | null
) {
  const uri = `/facility/shifts/${shiftId}/claims/${shiftClaimId}/accept`;

  const body = {
    slotReason,
    slotReasonComment,
  };

  return api
    .post(uri, body)
    .then((res) => res.data)
    .catch(handleApiError);
}

export async function shiftClaimReject(
  shiftId: number,
  shiftClaimId: number,
  rejectReason: string,
  reasonDetail: string
): Promise<boolean | void> {
  const uri = `/facility/shifts/${shiftId}/claims/${shiftClaimId}/reject-claim`;
  const body = {
    reason: rejectReason,
    reasonDetail,
  };

  return api
    .post(uri, body)
    .then((res) => res.status === 200)
    .catch(handleApiError);
}

export async function shiftClaimUpdateReason(
  shiftId: number,
  shiftClaimId: number,
  slotReason: string,
  slotReasonComment: string
): Promise<boolean | void> {
  const uri = `/facility/shifts/${shiftId}/claims/${shiftClaimId}/update-reason`;
  const body = {
    slotReason,
    slotReasonComment,
  };

  return api
    .post(uri, body)
    .then((res) => res.status === 200)
    .catch(handleApiError);
}

export async function fetchShiftInfo(shiftId: number): Promise<Shift | void> {
  const uri = `/facility/shifts/${shiftId}`;
  return api
    .get(uri)
    .then((res) => mapShift(res.data))
    .catch(handleApiError);
}

export async function cancelShiftRequest(
  shiftId: number,
  cancelReason: string,
  reasonDetails: string
): Promise<boolean | void> {
  const uri = `/facility/shifts/${shiftId}/cancel-shift`;

  const body = {
    reason: cancelReason,
    reasonDetails,
  };

  return api
    .post(uri, body)
    .then((res) => res.status === 200)
    .catch(handleApiError);
}

export async function updateShiftRequest(
  shiftId: number,
  shiftRequest: ShiftUpdateRequest
): Promise<boolean | void> {
  const uri = `/facility/shifts/${shiftId}/update-shift`;

  return api
    .post(uri, shiftRequest)
    .then((res) => res.status === 200)
    .catch(handleApiError);
}

export type ShiftSummary = {
  date: string;
  hasAlert: boolean;
  holiday: boolean;
};
export async function fetchShiftsSummary(
  fromDate: string,
  toDate: string
): Promise<ShiftSummary[]> {
  //format is YYYY-MM-DD
  const uri = '/facility/shifts/shifts-summary';

  const params = {
    fromDate,
    toDate,
  };
  return api
    .get(uri, { params })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return handleApiError(error);
    });
}

export async function fetchShiftCancelReasons() {
  const uri = '/facility/common/shift-cancel-reasons';
  return api
    .get(uri)
    .then((res) => res.data)
    .catch(handleApiError);
}

export async function fetchShiftClaimRejectReasons() {
  const uri = '/facility/common/shift-claim-reject-reasons';
  return api
    .get(uri)
    .then((res) => res.data)
    .catch(handleApiError);
}

export async function fetchShiftFillRateProbabilities(
  params: FillRatePredictionParams
): Promise<ShiftFillRateResponse> {
  const uri = '/facility/shifts/predict-shift-fill-rate';

  return api
    .post(uri, params)
    .then((res) => res.data)
    .catch(handleApiError);
}

export async function checkEligibleProfessionalsForShift(
  shiftConfig: ShiftConfigDTO,
  professionalIds: number[]
): Promise<EligibleProfessionalsForShiftResponse> {
  const uri = '/facility/shifts/check-eligible-professionals';
  return api
    .post(uri, { shiftConfig, professionalIds })
    .then((res) => res.data)
    .catch(handleApiError);
}

export interface ShiftPublicationRequest {
  startTime: Date;
  endTime: Date;
  professionalField?: string;
  totalPay?: number;
  capacity: number;
  details: string;
  modality?: ShiftModalityEnum;
  unit?: string;
  externalVisible: boolean;
  internalVisible: boolean;
  category?: string;
  onboardingShiftsRequired?: boolean;
  invitedProfessionalIds?: number[];
  compensationOptions?: string[];
  temporalId?: string;

  /**
   * @deprecated
   */
  unitVisible?: boolean;
  specialization?: string;
}

export interface ShiftUpdateRequest {
  startTime: Date;
  endTime: Date;
  totalPay: number;
  details: string | null;
  unit?: string;
  unitVisible?: boolean;
  capacity?: number;
  internalVisible: boolean;
  externalVisible: boolean;
  decreaseCapacityReason?: string;
  decreaseCapacityReasonDetails?: string;
  professionalField?: string | null;
  invitedProfessionalIds?: number[];
  compensationOptions?: string[];
  onboardingShiftsRequired?: boolean;
}

/**
 * Deprecated by fields and units project
 */
export interface SpecializationDTO {
  name: string;
  translationDefault: string;
  translations: {
    es: string;
  };
  displayText?: string;
}

interface TimeDTO {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

interface ScheduleDTO {
  startTime: TimeDTO;
  endTime: TimeDTO;
}

export interface ShiftTimeConfigDTO {
  dayShift: ScheduleDTO;
  eveningShift: ScheduleDTO;
  nightShift: ScheduleDTO;
}

export interface CalendarSummary {
  date: string;
  holiday: boolean;
}

export interface OnboardingShiftsConfig {
  featureEnabled: boolean;
  defaultValue: boolean;
  pricing: string;
  hours: number;
}

export interface CompensationSelectionOption {
  value: string;
  displayText: string;
  enabledByDefault?: boolean;
}

export interface CompensationOptionsConfig {
  configurable: boolean;
  options: CompensationSelectionOption[];
}

export interface PublishShiftConfigurationDTO {
  specializations: SpecializationDTO[];
  shiftTimeConfig: ShiftTimeConfigDTO;
  livoPoolOnboarded: boolean;
  livoInternalOnboarded: boolean;
  categories: Category[];
  units: string[] | null;
  professionalFields: ValueDisplayPair[];
  calendarSummary: CalendarSummary[];
  unitVisibleConfigurable: boolean;
  unitConfigurable: boolean;
  onboardingShifts?: OnboardingShiftsConfig;
  compensationOptions?: CompensationOptionsConfig;
}

export type ProfessionalTag = {
  label: string;
  styling: {
    backgroundColor?: string;
    icon?: string;
    textColor?: string;
  } | null;
};

export type ProfessionalDataField = {
  key: string;
  label: string;
  value: string;
  values: [
    {
      value: string;
      displayText: string;
    },
  ];
  displayText: string;
};

export interface ProfessionalProfile {
  category: Category | null;
  id: number;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  licenseNumber: string;
  professionalCV: string;
  status: string;
  professionalReview: ProfessionalReviewInfo;
  totalPerformedShifts: number;
  firstShifterForFacility: boolean;
  tags: ProfessionalTag[];
  favorite?: boolean;
  internal: {
    employeeNumber: string;
    unit: string;
    contractType: string;
    dataFields: ProfessionalDataField[];
  } | null;
  modality?: ShiftModalityEnum;
  cvSummary?: string | null;
  availableCVTypes: CVType[];
  totalShiftsInFacility?: number | null;
}

export type ProfessionalReviewInfo = {
  averageRating: number | null;
  totalReviews: number;
  reviews: ProfessionalReview[];
};

export type ReviewFeedback = {
  generalRating: number;
  feedback: string;
};

export type ProfessionalReview = {
  facilityName: string;
  specialization: SpecializationDTO;
  review: ReviewFeedback;
  month: string;
  year: number;
};

enum CompensationOptionType {
  EXTRA_PAY = 'EXTRA_PAY',
  TIME_OFF = 'TIME_OFF',
  SHIFT_SWAP = 'SHIFT_SWAP',
}

export type CompensationOption = {
  type: CompensationOptionType;
  label: string;
  compensationValue: string;
};

export type SlotReason = {
  value: string;
  displayText: string;
  comment: string;
};
export type SlotReasonOption = {
  value: string;
  displayText: string;
};

export interface ClaimRequest {
  claimedAt: string;
  id: 0;
  status: string;
  statusUpdatedAt: string;
  professionalProfile: ProfessionalProfile;
  compensationOption: CompensationOption | null;
  modality: ShiftModalityEnum | null;
  livoPoolOnboarded: boolean;
  livoInternalOnboarded: boolean;
  cancellationRequest: {
    requestedAt: string;
    reason: string;
  };
  slotReason: SlotReason | null;
  slotReasonOptions?: SlotReasonOption[];
  slotReasonCommentDisplayed: boolean;
  onboardingShift?: ShiftSummaryData;
  coverageShift?: ShiftSummaryData;
  invitation?: boolean;
  invitationExpirationTime?: Date | null;
}

export enum ShiftClaimStatus {
  PENDING_LIVO_REVIEW = 'PENDING_LIVO_REVIEW',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  PENDING_PRO_ACCEPT = 'PENDING_PRO_ACCEPT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REJECTED_BY_PRO = 'REJECTED_BY_PRO',
  CANCELED = 'CANCELED',
  WITHDRAWN = 'WITHDRAWN',
  INVITATION_EXPIRED = 'INVITATION_EXPIRED',
  PRO_NOT_AVAILABLE = 'PRO_NOT_AVAILABLE',
}

export enum CVType {
  LIVO_CV = 'LIVO_CV',
  PDF_UPLOAD = 'PDF_UPLOAD',
}

export interface ShiftConfigDTO {
  category: String;
  specialization?: string;
  unit?: string;
  professionalField?: string;
  endTime: Date;
  startTime: Date;
  externalVisible: Boolean;
  internalVisible: Boolean;
}

export interface EligibleProfessionalsForShiftResponse {
  eligibleProfessionalIds: number[];
  inEligibleProfessionals: {
    professionalId: number;
    professionalName: string;
    reason?: string;
  }[];
}

export interface FillRatePredictionParams
  extends Partial<Omit<ShiftPublicationRequest, 'startTime' | 'endTime'>> {
  startTime: string;
  endTime: string;
  category: string;
  recurrentDates: string[];
  temporalId: string | undefined;
  shiftId: number | undefined;
}

export enum ProvabilityValue {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface PredictionBandsCounter {
  low: number;
  medium: number;
  high: number;
}

export interface FillRatePrediction {
  predictedBand: ProvabilityValue;
  isDisplayed: boolean;
  startDate: string;
}

export interface CommonBannerDto {
  title?: string;
  body: string;
  color: string;
  backgroundColor: string;
  icon: IconDTO;
}

export interface ShiftFillRateResponse {
  predictions: FillRatePrediction;
  bands: PredictionBandsCounter;
  temporalId: string;
  displayBanner: boolean;
  banner: CommonBannerDto;
}
