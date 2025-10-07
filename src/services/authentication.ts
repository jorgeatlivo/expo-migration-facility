import { Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { StorageKeys } from '@/services/storage/storage.keys';
import { StorageService } from '@/services/storage/storage.service';

import i18n, { isSupportedLanguage } from '@/locale/i18n';
import { FacilityStaffProfile, LivoContact } from '@/types';
import api, { handleApiError, removeApiToken } from './api';
import { syncFCMToken } from './notifications';

export interface SignInRequestData {
  userName: string;
  password: string;
}

export const getEmailKey = async (): Promise<string | undefined> => {
  return StorageService.get<string>(StorageKeys.EMAIL_KEY);
};
export interface SignInResponseData {
  errorMessage: string;
  userToken: string;
  mfaEnabled: boolean;
}

export const signInRequest = (signInData: SignInRequestData) => {
  const url = '/facility/account/sign-in';

  return api
    .post(url, signInData, {
      headers: {
        accept: '*/*',
      },
    })
    .then((response) => {
      const { accessToken, tokenType, mfaEnabled } = response.data;

      return {
        userToken: `${tokenType} ${accessToken}`,
        errorMessage: '',
        mfaEnabled: mfaEnabled,
      };
    })
    .catch(handleApiError);
};

export async function signOutRequest() {
  const url = '/facility/account/sign-out';

  const userToken = await retrieveUserSession();

  return api
    .post(url)
    .then((response) => response.status === 200)
    .catch((error) => {
      console.error('Error signing out:', error);
      throw error;
    });
}

export const storeUserSession = async (userToken: string, email: string) => {
  try {
    StorageService.set(StorageKeys.EMAIL_KEY, email);
    StorageService.set(StorageKeys.USER_TOKEN_KEY, userToken);
    await syncFCMToken();
  } catch (error: any) {
    Alert.alert(error.message);
    console.error('Error storing user session:', error);
  }
};

export const retrieveUserSession = async () => {
  try {
    return (await StorageService.get(StorageKeys.USER_TOKEN_KEY)) as string;
  } catch (error) {}
};

export const removeUserSession = async () => {
  try {
    StorageService.remove(StorageKeys.USER_TOKEN_KEY);
    removeApiToken();
  } catch (error) {}
};

export const fetchFacilityProfile = (): Promise<FacilityStaffProfile> => {
  const uri = '/facility/account/profile';
  return api
    .get(uri)
    .then((res) => {
      const profile = res.data as FacilityStaffProfile;
      if (
        profile &&
        profile.locale &&
        i18n.language !== profile.locale &&
        isSupportedLanguage(profile.locale)
      ) {
        console.log('[i18n] use profile locale from BE: ' + profile.locale);
        i18n.changeLanguage(profile.locale);
        AsyncStorage.setItem(StorageKeys.LAST_PROFILE_LOCALE, profile.locale);
      }

      return res.data;
    })
    .catch(handleApiError);
};

export const fetchLivoContact = (): Promise<LivoContact> => {
  const uri = '/common/contact-information';
  return api
    .get(uri)
    .then((res) => res.data)
    .catch(handleApiError);
};

export const resetPasswordRequest = (email: string) => {
  const url = '/facility/account/forgotten-password/request-reset-password';
  const body = { email: email };

  return api
    .post(url, body)
    .then((response) => response.status === 200)
    .catch(handleApiError);
};

export interface ChangePasswordResponse {
  errorMessage: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export const changePasswordRequest = async (
  changePasswordData: ChangePasswordData
): Promise<boolean | void> => {
  const url = '/facility/account/change-password';

  return api
    .post(url, changePasswordData)
    .then((response) => response.status === 200)
    .catch(handleApiError);
};

export const verifyMFARequest = (email: string, code: string) => {
  const url = '/facility/account/verify-login-mfa';
  const body = { email: email, mfaCode: code };

  return api
    .post(url, body)
    .then(
      (response) => `${response.data.tokenType} ${response.data.accessToken}`
    )
    .catch(handleApiError);
};
