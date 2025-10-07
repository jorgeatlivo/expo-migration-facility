import { ShiftTimeInDayEnum } from '@/types';

export const shiftTimeInDayLabels = {
  [ShiftTimeInDayEnum.DAY_SHIFT]: {
    label: 'common_morning',
    color: '#FFA538',
    backgroundColor: '#E0EFFF',
    textColor: '#FFA538',
    iconName: 'sun',
    publishShiftConfigKey: 'dayShift',
  },
  [ShiftTimeInDayEnum.EVENING_SHIFT]: {
    label: 'common_evening',
    color: '#FE85C6',
    backgroundColor: '#FFF6ED',
    textColor: '#FE85C6',
    iconName: 'sunset',
    publishShiftConfigKey: 'eveningShift',
  },
  [ShiftTimeInDayEnum.NIGHT_SHIFT]: {
    label: 'common_night',
    color: '#12A3B9',
    backgroundColor: '#DAE4E7',
    textColor: '#12A3B9',
    iconName: 'moon',
    publishShiftConfigKey: 'nightShift',
  },
};
