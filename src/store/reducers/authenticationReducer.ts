import {
  RESTORE_TOKEN,
  SIGN_IN,
  SIGN_OUT,
  TOGGLE_SIGNING_IN,
  TOGGLE_SIGNING_UP,
} from '@/store/actions/actionTypes';

const initialState = {
  token: null,
  isSigningOut: false,
  isLoading: true,
  isSigningUp: false,
  isSigningIn: false,
};

export type AuthenticationAction =
  | { type: 'SIGN_IN'; payload: string | null }
  | { type: 'SIGN_OUT' }
  | { type: 'RESTORE_TOKEN'; payload: string | null }
  | { type: 'TOGGLE_SIGNING_UP'; payload: boolean }
  | { type: 'TOGGLE_SIGNING_IN'; payload: boolean };

const authenticationReducer = (
  state = initialState,
  action: AuthenticationAction
) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        token: action.payload,
        isSigningOut: false,
        isLoading: false,
        isSigningIn: true,
      };
    case TOGGLE_SIGNING_IN:
      return {
        ...state,
        isSigningIn: action.payload,
      };
    case TOGGLE_SIGNING_UP:
      return {
        ...state,
        isSigningUp: action.payload,
      };
    case SIGN_OUT:
      return { ...state, token: null, isSigningOut: true, isLoading: false };
    case RESTORE_TOKEN:
      return {
        ...state,
        token: action.payload,
        isLoading: false,
        isSigningOut: false,
      };
    default:
      return state;
  }
};

export default authenticationReducer;
