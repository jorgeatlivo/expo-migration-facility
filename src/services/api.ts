import DeviceInfo from 'react-native-device-info';

import axios, { AxiosError } from 'axios';
import i18next from 'i18next';

import ENV from '@/constants/env';
import { configureErrorModal } from '@/hooks/ModalContext';
import {
  NETWORK_ERROR_MODAL,
  SERVER_ERROR_MODAL,
  SERVER_TIMEOUT_MODAL,
} from '@/hooks/modalTypes';

import i18n from '@/locale/i18n';

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 30000,
  headers: {
    accept: '*/*',
    'X-App-Version': DeviceInfo.getVersion().split('-')[0],
    'X-App-OS': DeviceInfo.getSystemName(),
    'X-PLATFORM': 'FACILITY_APP',
  },
});

export class ApiApplicationError extends Error {
  errorCode?: string;
  errorMessage?: string;

  constructor(message: string, errorCode?: string) {
    super(message);
    this.errorMessage = message;
    this.errorCode = errorCode;
    this.name = 'ApiApplicationError';
  }
}

export function setApiToken(token: string) {
  api.defaults.headers.common.Authorization = token;
}

export function removeApiToken() {
  delete api.defaults.headers.common.Authorization;
}

type InterceptorEjectionCallback = () => void;

if (__DEV__) {
  const isLogVerbose = ENV.LOG_VERBOSE === 'true';

  api.interceptors.request.use((config) => {
    const locale = i18next.language ?? 'es';
    config.headers.set('X-Locale', locale);

    console.log(
      `API Request: ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`
    );

    if (isLogVerbose) {
      console.log(config.data ? JSON.stringify(config.data) : '(empty)');
    }

    return config;
  });

  api.interceptors.response.use((response) => {
    console.log(
      `API Response: [${
        response.status
      }] ${response.config.method?.toUpperCase()} ${response.config.baseURL}${
        response.config.url
      }`
    );

    if (isLogVerbose) {
      console.log(response.data ? JSON.stringify(response.data) : '(empty)');
    }

    return response;
  });
}

export function configureUnauthorizedApi(
  logoutDispatch: () => void
): InterceptorEjectionCallback {
  console.log('Unauthorized Api Interceptor Configured');
  let onFulfilled = (response: any) => response;
  let getOnRejected = (error: any) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.log(
        `Response with ${error.response.status} status, dispatching logout action`
      );
      logoutDispatch();
      error.response.data = {
        errorMessage: i18n.t('login_session_expired_error_message'),
      };
    }

    return Promise.reject(error);
  };

  let interceptor = api.interceptors.response.use(onFulfilled, getOnRejected);
  return () => api.interceptors.response.eject(interceptor);
}

export function handleApiError(error: AxiosError): never | void {
  if (error.response && error.response.status % 400 < 100) {
    const responseData = error.response.data;
    // @ts-ignore
    const message = responseData?.errorMessage;
    // @ts-ignore
    const errorCode = responseData?.errorCode;
    if (message) {
      throw new ApiApplicationError(message, errorCode);
    } else {
      throw new ApiApplicationError(
        i18n.t('common_connecting_to_server_error_message')
      );
    }
    // @ts-ignore
  } else if (error.message === 'Network Error') {
    configureErrorModal(
      i18next.t('common_no_internet_connection_title'),
      i18next.t('common_no_internet_connection_subtitle'),
      NETWORK_ERROR_MODAL
    );
  } else if (error.request) {
    configureErrorModal(
      i18next.t('common_server_timeout_title'),
      i18next.t('common_server_timeout_subtitle'),
      SERVER_TIMEOUT_MODAL
    );
  } else {
    configureErrorModal(
      i18next.t('common_server_error_title'),
      i18next.t('common_server_error_subtitle'),
      SERVER_ERROR_MODAL
    );
  }
}

export default api;
