import {
  deleteToken,
  FirebaseMessagingTypes,
  getAPNSToken,
  getInitialNotification,
  getMessaging,
  getToken,
  hasPermission,
  isDeviceRegisteredForRemoteMessages,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

class MessagingService {
  module: FirebaseMessagingTypes.Module;

  private static instance: MessagingService;

  private constructor() {
    this.module = getMessaging();
  }

  /**
   * Request user permission for notifications
   */
  public requestPermission(): Promise<FirebaseMessagingTypes.AuthorizationStatus> {
    return requestPermission(this.module);
  }

  /**
   * Get the FCM token for this device
   */
  public getToken() {
    return getToken(this.module);
  }

  /**
   * Listen for foreground messages
   */
  public onMessage(
    listener: (message: FirebaseMessagingTypes.RemoteMessage) => void
  ) {
    return onMessage(this.module, listener);
  }

  /**
   * Listen for background/quit state messages
   */
  public setBackgroundMessageHandler(
    handler: (message: FirebaseMessagingTypes.RemoteMessage) => Promise<void>
  ) {
    return setBackgroundMessageHandler(this.module, handler);
  }

  /**
   * Listen for when a notification is opened from a quit state
   */
  public onNotificationOpenedApp(
    listener: (message: FirebaseMessagingTypes.RemoteMessage) => void
  ) {
    return onNotificationOpenedApp(this.module, listener);
  }

  /**
   * Get the initial notification if app was opened by a notification
   */
  public getInitialNotification() {
    return getInitialNotification(this.module);
  }

  /**
   * Delete the current FCM token
   */
  public deleteToken() {
    return deleteToken(this.module);
  }

  public hasPermission() {
    return hasPermission(this.module);
  }

  public isDeviceRegisteredForRemoteMessages(): boolean {
    return isDeviceRegisteredForRemoteMessages(this.module);
  }

  public getAPNSToken() {
    return getAPNSToken(this.module);
  }

  public registerDeviceForRemoteMessages() {
    registerDeviceForRemoteMessages(this.module);
  }

  public onTokenRefresh(listener: (token: string) => void) {
    return onTokenRefresh(this.module, listener);
  }

  /* ----------------------------- STATIC METHODS ----------------------------- */

  public static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService();
    }
    return MessagingService.instance;
  }

  public static requestPermission() {
    return MessagingService.getInstance().requestPermission();
  }

  public static getToken() {
    return MessagingService.getInstance().getToken();
  }

  public static onMessage(
    listener: (message: FirebaseMessagingTypes.RemoteMessage) => void
  ) {
    return MessagingService.getInstance().onMessage(listener);
  }

  public static setBackgroundMessageHandler(
    handler: (message: FirebaseMessagingTypes.RemoteMessage) => Promise<void>
  ) {
    return MessagingService.getInstance().setBackgroundMessageHandler(handler);
  }

  public static onNotificationOpenedApp(
    listener: (message: FirebaseMessagingTypes.RemoteMessage) => void
  ) {
    return MessagingService.getInstance().onNotificationOpenedApp(listener);
  }

  public static getInitialNotification() {
    return MessagingService.getInstance().getInitialNotification();
  }

  public static deleteToken() {
    return MessagingService.getInstance().deleteToken();
  }

  public static hasPermission() {
    return MessagingService.getInstance().hasPermission();
  }

  public static getAPNSToken() {
    return MessagingService.getInstance().getAPNSToken();
  }

  public static registerDeviceForRemoteMessages() {
    return MessagingService.getInstance().registerDeviceForRemoteMessages();
  }

  public static onTokenRefresh(listener: (token: string) => void) {
    return MessagingService.getInstance().onTokenRefresh(listener);
  }

  public static isDeviceRegisteredForRemoteMessages() {
    return MessagingService.getInstance().isDeviceRegisteredForRemoteMessages();
  }
}

export default MessagingService;
