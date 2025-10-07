import crashlytics from '@react-native-firebase/crashlytics';
export async function attachSessionToCrashReporting(userEmail: string) {
  await crashlytics().setUserId(userEmail);
}
