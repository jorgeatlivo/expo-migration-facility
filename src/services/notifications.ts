import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import i18next from 'i18next';
import { Alert } from 'react-native';
import { newNotificationToggleAction } from '@/store/actions/shiftActions';
import store from '@/store/configureStore';
import { navigate } from '@/utils/navigation';
import api from './api';
import { retrieveUserSession } from './authentication';
import { ProtectedStackRoutes } from '@/router/ProtectedStack';

let FCM_TOKEN_STORAGE_KEY = 'FCMToken';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

async function setFCMToken(FCMToken: string) {
  return AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, FCMToken);
}

export async function removeFCMToken() {
  return AsyncStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
}

async function updateStoredFCMToken(assignedFCMToken: string) {
  const storedFCMToken = await getFCMToken();
  if (assignedFCMToken === storedFCMToken) {
    return;
  }

  retrieveUserSession().then((authenticationToken) => {
    if (authenticationToken) {
      sendDeviceToken(assignedFCMToken);
      setFCMToken(assignedFCMToken);
    }
  });
}

export async function syncFCMToken() {
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages();
  }

  setTimeout(async () => {
    const assignedFCMToken = await messaging().getToken();
    await updateStoredFCMToken(assignedFCMToken);
  }, 1000);
}

export async function getFCMToken() {
  return await AsyncStorage.getItem(FCM_TOKEN_STORAGE_KEY);
}

export function registerForegroundNotification() {
  messaging().onMessage(async (remoteMessage) => {
    notificationHandler(remoteMessage);
    console.log(
      'Foreground: A new FCM message arrived!',
      JSON.stringify(remoteMessage)
    );
  });
}

function registerOnNotificationOpenedApp() {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    notificationHandler(remoteMessage);
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification
    );
  });
}

const navigateToShiftDetails = (shiftId: string) => {
  navigate(ProtectedStackRoutes.ShiftDetails, {
    shiftId: shiftId,
  });
};

function notificationHandler(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
) {
  store.dispatch(newNotificationToggleAction(true));
  Alert.alert(
    remoteMessage.notification?.title ?? 'Undefined title',
    remoteMessage.notification?.body,
    [
      {
        text: i18next.t('shift_list_check_shiftclaim'),
        onPress: () => {
          store.dispatch(newNotificationToggleAction(false));
          if (remoteMessage.data) {
            switch (remoteMessage.data.type) {
              case 'NEW_SHIFT_CLAIM':
                navigateToShiftDetails(remoteMessage.data.shiftId as string);
                break;
            }
          }
        },
      },
      {
        text: i18next.t('shift_list_check_later'),
        onPress: () => {
          store.dispatch(newNotificationToggleAction(false));
        },
      },
    ]
  );
}

function registerOnInitialNotification() {
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        notificationHandler(remoteMessage);
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification
        );
      }
    });
}

function registerOnTokenRefresh() {
  messaging().onTokenRefresh(syncFCMToken);
}

export function initialiseNotifications() {
  requestUserPermission();
  syncFCMToken();
  registerOnTokenRefresh();
  registerForegroundNotification();
  registerOnNotificationOpenedApp();
  registerOnInitialNotification();
}

function sendDeviceToken(FCMToken: string) {
  const url = '/facility/account/update-device-token';

  return api
    .post(url, { deviceToken: FCMToken })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error sending FCM Token', error);
      throw error;
    });
}
