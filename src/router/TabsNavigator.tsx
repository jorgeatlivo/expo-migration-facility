import React, { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import AnalyticsService from '@/services/analytics/analytics.service';
import RemoteConfigService from '@/services/firebase/remote-config-service';
import {
  setAppState,
  setLastActiveTime,
} from '@/store/actions/configurationActions';
import { fetchFacilityProfileAction } from '@/store/actions/profileActions';
import { AppDispatch } from '@/store/configureStore';

import { CalendarScreen } from '@/screens/CalendarScreen/CalendarScreen';
import { ProfessionalAgendaStack } from '@/screens/ProfessionalAgenda/ProfessionalAgendaStack';
import { SettingsScreen } from '@/screens/Settings/SettingsScreen';
import { ShiftsListScreen } from '@/screens/ShiftListScreen/ShiftsListScreen';

import { EmptyScreen } from '@/components/common/EmptyScreen';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { LivoTabBar } from '@/components/layout/LivoTabBar';

import ENV from '@/constants/env';
import { useEffectOnce } from '@/hooks/useEffectOnce';
import { GRAY, PRIMARY_BLUE } from '@/styles/colors';

import LivoIcon from '@/assets/icons/LivoIcon';
import { TabRoutes, TabsParamsList } from '@/router/TabNavigator.types';
import { RootState } from '@/types';

const ICON_SIZE = 36;
const Tab = createBottomTabNavigator<TabsParamsList>();
type RouteProps = {
  route: { name: string };
};

const screenOptions = ({ route }: RouteProps): BottomTabNavigationOptions => ({
  tabBarStyle: { display: 'flex' },
  tabBarIcon: ({ color }: { color: string }) => {
    let iconName;

    if (route.name === TabRoutes.ShiftsList) {
      iconName = 'report-medical';
    } else if (route.name === TabRoutes.ShiftsCalendar) {
      iconName = 'calendar';
    } else if (route.name === TabRoutes.ProAgenda) {
      iconName = 'users-group';
    } else if (route.name === TabRoutes.Settings) {
      iconName = 'settings';
    }

    // @ts-ignore
    return <LivoIcon name={iconName} size={ICON_SIZE} color={color} />;
  },
  tabBarActiveTintColor: PRIMARY_BLUE,
  tabBarInactiveTintColor: GRAY,
  tabBarIconStyle: { marginTop: 5 },
});

export const TabNavigation = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const appState = React.useRef(AppState.currentState);
  const [initializing, setInitializing] = React.useState(true);
  const { userId } = useSelector((state: RootState) => state.configurationData);
  const { facilityProfile } = useSelector(
    (state: RootState) => state.profileData
  );

  const logAnalyticAndFetch = useCallback(async () => {
    await AnalyticsService.identifyUser(userId);
    await RemoteConfigService.setDefaults({
      auto_refresh_interval: '120000',
      faster_shift_version: false,
      can_publish_unit: false,
      auto_reload_translations_interval_ms: Number(
        ENV.AUTO_RELOAD_TRANSLATIONS_INTERVAL_MS
      ),
    })
      .then(() => RemoteConfigService.fetchAndActivate())
      .then((fetchedRemotely) => {
        console.log(
          fetchedRemotely
            ? 'Configs were retrieved from the backend and activated.'
            : 'No configs were fetched from the backend, and the local configs were already activated'
        );
        if (fetchedRemotely) {
          AnalyticsService.initPostHogFromRemoteConfig();
        }
      });
    // @ts-ignore
    await dispatch(fetchFacilityProfileAction());
    setInitializing(false);
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId) {
      setInitializing(true);
      logAnalyticAndFetch();
    }
  }, [logAnalyticAndFetch, userId]);

  useEffectOnce(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        dispatch(setLastActiveTime(Date.now().toString()));
      }
      dispatch(setAppState(nextAppState));
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  });

  useEffect(() => {
    let remoteConfigListenerUnsubscriber = RemoteConfigService.onConfigUpdated(
      (event, error) => {
        if (error) {
          console.log(
            'remote-config listener subscription error: ' +
              JSON.stringify(error)
          );
          console.log(error);
        } else {
          // Updated keys are keys that are added, removed, or changed value, metadata, or source
          // Note: A key is considered updated if it is different then the activated config.
          //       If the new config is never activated, the same keys will remain in the set of
          //       of updated keys passed to the callback on every config update
          console.log('remote-config updated keys: ' + JSON.stringify(event));

          // If you use realtime updates, the SDK fetches the new config for you.
          // However, you must activate the new config so it is in effect
          RemoteConfigService.activate();
          console.log('JORGITO', event);
          if (event?.updatedKeys.includes('facility_app_posthog_api_key')) {
            AnalyticsService.initPostHogFromRemoteConfig();
          }
        }
      }
    );

    // unsubscribe the listener when no longer needed - remote config will close the network socket if there
    // are no active listeners, potentially minimizing application user data and battery usage.
    // Make sure to unsubscribe when the component unmounts
    return () => {
      remoteConfigListenerUnsubscriber();
    };
  }, []);

  const insets = useSafeAreaInsets();

  return initializing ? (
    <LoadingScreen />
  ) : facilityProfile ? (
    <Tab.Navigator
      tabBar={(props) => <LivoTabBar {...props} />}
      screenOptions={screenOptions}
      initialRouteName={
        facilityProfile.visibleTabMenu.includes(TabRoutes.ShiftsList)
          ? TabRoutes.ShiftsList
          : TabRoutes.ShiftsCalendar
      }
    >
      {facilityProfile.visibleTabMenu.includes(TabRoutes.ShiftsList) ? (
        <Tab.Screen
          name={TabRoutes.ShiftsList}
          component={ShiftsListScreen}
          options={{
            title: t('shift_list_published_shifts_title'),
            tabBarLabel: () => null,
            headerShown: false,
          }}
        />
      ) : null}
      {facilityProfile.visibleTabMenu.includes(TabRoutes.ShiftsCalendar) ? (
        <Tab.Screen
          name={TabRoutes.ShiftsCalendar}
          component={CalendarScreen}
          options={{
            title: t('calendar_screen_title'),
            tabBarLabel: () => null,
            headerShown: false,
          }}
        />
      ) : null}
      {facilityProfile.visibleTabMenu.includes(TabRoutes.ProAgenda) ? (
        <Tab.Screen
          name={TabRoutes.ProAgenda}
          component={ProfessionalAgendaStack}
          options={{
            tabBarLabel: () => null,
            headerShown: false,
          }}
        />
      ) : null}
      <Tab.Screen
        name={TabRoutes.Settings}
        component={SettingsScreen}
        options={() => ({
          title: t('shift_list_settings_title'),
          tabBarLabel: () => null,
          headerShown: false,
        })}
      />
    </Tab.Navigator>
  ) : (
    <EmptyScreen
      style={{ paddingBottom: insets.bottom }}
      onPress={() => {
        // @ts-ignore
        dispatch(fetchFacilityProfileAction());
      }}
    />
  );
};

export default TabNavigation;
