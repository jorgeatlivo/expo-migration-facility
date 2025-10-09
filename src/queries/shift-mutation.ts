import { cancelShiftWithReason } from '@/services/shifts';

export interface CancelShiftRequest {
  shiftId: number;
  data: {
    reason: string;
    reasonDetails?: string;
    recurrentShiftIds: number[];
  };
}

export const mutateCancelShift = ({ shiftId, data }: CancelShiftRequest) => {
  return cancelShiftWithReason(shiftId, data);
};
