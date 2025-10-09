import moment from 'moment';

import {
  LOAD_DAY_SHIFTS,
  LOAD_DAY_SHIFTS_SUCCESS,
  LOAD_PAST_SHIFT_DAYS,
  LOAD_PAST_SHIFT_DAYS_SUCCESS,
  LOAD_SHIFT_INFO,
  LOAD_SHIFT_INFO_SUCCESS,
  NEW_NOTIFICATION_TOGGLE,
  SET_DAY_SELECTED,
  TOGGLE_NEW_SHIFT_AVAILABLE,
} from '@/store/actions/actionTypes';

import { ShiftAction, ShiftState } from '@/types';

const initialState: ShiftState = {
  dayShiftsData: {
    isLoading: false,
    dayShifts: [],
    newShiftAvailable: false,
  },
  pastDayShiftsData: {
    isLoading: false,
    pastDayShifts: [],
  },
  shiftInfoData: {
    isLoading: false,
    shiftInfo: null,
    claimRequests: [],
  },
  calendarData: {
    daySelected: moment().format('YYYY-MM-DD'),
  },
  newNotificationToggle: false,
};

const shiftReducer = (state = initialState, action: ShiftAction) => {
  switch (action.type) {
    case LOAD_DAY_SHIFTS:
      return {
        ...state,
        dayShiftsData: {
          ...state.dayShiftsData,
          isLoading: true,
        },
      };
    case LOAD_DAY_SHIFTS_SUCCESS:
      return {
        ...state,
        dayShiftsData: {
          ...state.dayShiftsData,
          dayShifts: action.payload,
          isLoading: false,
        },
      };
    case LOAD_PAST_SHIFT_DAYS:
      return {
        ...state,
        pastDayShiftsData: {
          ...state.pastDayShiftsData,
          isLoading: true,
        },
      };
    case LOAD_PAST_SHIFT_DAYS_SUCCESS:
      return {
        ...state,
        pastDayShiftsData: {
          pastDayShifts: action.payload,
          isLoading: false,
        },
      };
    case LOAD_SHIFT_INFO:
      return {
        ...state,
        shiftInfoData: {
          ...state.shiftInfoData,
          isLoading: true,
        },
      };
    case LOAD_SHIFT_INFO_SUCCESS:
      return {
        ...state,
        shiftInfoData: {
          isLoading: false,
          shiftInfo: action.payload.shiftInfo,
          claimRequests: action.payload.claimRequests,
        },
      };
    case TOGGLE_NEW_SHIFT_AVAILABLE:
      return {
        ...state,
        dayShiftsData: {
          ...state.dayShiftsData,
          newShiftAvailable: action.payload,
        },
      };
    case NEW_NOTIFICATION_TOGGLE:
      return {
        ...state,
        newNotificationToggle: action.payload,
      };
    case SET_DAY_SELECTED:
      return {
        ...state,
        calendarData: {
          daySelected: action.payload,
        },
      };
    default:
      return state;
  }
};

export default shiftReducer;
