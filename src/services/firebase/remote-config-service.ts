import {
  activate,
  FirebaseRemoteConfigTypes,
  fetchAndActivate,
  getBoolean,
  getNumber,
  getRemoteConfig,
  getString,
  getValue,
  onConfigUpdated,
  setDefaults,
} from '@react-native-firebase/remote-config';

class RemoteConfigService {
  module: FirebaseRemoteConfigTypes.Module;

  private static instance: RemoteConfigService;

  private constructor() {
    // Initialize Firebase Remote Config here
    this.module = getRemoteConfig();
  }

  public fetchAndActivate() {
    return fetchAndActivate(this.module);
  }

  public setDefaults(defaults: Record<string, any>) {
    return setDefaults(this.module, defaults);
  }

  public getBoolean(key: string): boolean {
    // Logic to get a boolean value from remote config by key
    return getBoolean(this.module, key);
  }

  public getNumber(key: string): number {
    // Logic to get a number value from remote config by key
    return getNumber(this.module, key);
  }

  public getString(key: string): string {
    // Logic to get a string value from remote config by key
    return getString(this.module, key);
  }

  public getValue(key: string) {
    return getValue(this.module, key);
  }

  public activate() {
    return activate(this.module);
  }

  public onConfigUpdated(
    callback: (config: { updatedKeys: string[] }, error?: Error) => void
  ) {
    // @ts-ignore
    return onConfigUpdated(this.module, callback);
  }

  public static getInstance(): RemoteConfigService {
    if (!RemoteConfigService.instance) {
      RemoteConfigService.instance = new RemoteConfigService();
    }
    return RemoteConfigService.instance;
  }

  public static fetchAndActivate() {
    return RemoteConfigService.getInstance().fetchAndActivate();
  }

  public static setDefaults(defaults: Record<string, any>) {
    return RemoteConfigService.getInstance().setDefaults(defaults);
  }

  public static getBoolean(key: string): boolean {
    return RemoteConfigService.getInstance().getBoolean(key);
  }

  public static getNumber(key: string): number {
    return RemoteConfigService.getInstance().getNumber(key);
  }

  public static getString(key: string): string {
    return RemoteConfigService.getInstance().getString(key);
  }

  public static getValue(key: string) {
    return RemoteConfigService.getInstance().getValue(key);
  }

  public static activate() {
    return RemoteConfigService.getInstance().activate();
  }

  public static onConfigUpdated(
    callback: (config: { updatedKeys: string[] }, error?: Error) => void
  ) {
    return RemoteConfigService.getInstance().onConfigUpdated(callback);
  }
}

export default RemoteConfigService;
