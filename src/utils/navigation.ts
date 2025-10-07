import {
  CommonActions,
  NavigationContainerRef,
} from '@react-navigation/native';

let _navigator: NavigationContainerRef<ReactNavigation.RootParamList> | null =
  null;

export function setTopLevelNavigator(
  navigatorRef: NavigationContainerRef<ReactNavigation.RootParamList> | null
) {
  _navigator = navigatorRef;
}

export function navigate(routeName: string, params?: any) {
  if (_navigator) {
    _navigator.dispatch(
      CommonActions.navigate({
        name: routeName,
        params,
      })
    );
  }
}
