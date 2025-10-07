import {
  RESTORE_TOKEN,
  SIGN_IN,
  SIGN_OUT,
  TOGGLE_SIGNING_IN,
  TOGGLE_SIGNING_UP,
} from './actionTypes';

export const signInAction = (token: string | null) => ({
  type: SIGN_IN,
  payload: token,
});

export const signOutAction = () => ({
  type: SIGN_OUT,
});

export const restoreTokenAction = (token: string | null) => ({
  type: RESTORE_TOKEN,
  payload: token,
});

export const toggleSigningUp = (isSigningUp: boolean) => ({
  type: TOGGLE_SIGNING_UP,
  payload: isSigningUp,
});

export const toggleSigningIn = (isSigningIn: boolean) => ({
  type: TOGGLE_SIGNING_IN,
  payload: isSigningIn,
});
