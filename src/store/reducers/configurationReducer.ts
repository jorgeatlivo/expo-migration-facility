import { ConfigurationAction } from '@/types';
import {
  LOAD_LIVO_CONTACT,
  LOAD_USER_ID,
  SET_APP_STATE,
  SET_LAST_ACTIVE_TIME,
} from '@/store/actions/actionTypes';

const initialState = {
  livoContact: null,
  lastActiveTime: '',
  appState: '',
  userId: '',
};

const configurationReducer = (
  state = initialState,
  action: ConfigurationAction
) => {
  switch (action.type) {
    case LOAD_LIVO_CONTACT:
      return {
        ...state,
        livoContact: action.payload,
      };
    case SET_LAST_ACTIVE_TIME:
      return {
        ...state,
        lastActiveTime: action.payload,
      };
    case SET_APP_STATE:
      return {
        ...state,
        appState: action.payload,
      };
    case LOAD_USER_ID:
      return {
        ...state,
        userId: action.payload,
      };
    default:
      return state;
  }
};

export default configurationReducer;
