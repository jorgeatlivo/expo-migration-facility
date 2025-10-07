import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { fetchProfessionalAgendaThunk } from '@/store/actions/professionalAgendaActions';
import { AppDispatch } from '@/store/configureStore';

import { ACTION_BLUE, DIVIDER_GRAY, WHITE } from '@/styles/colors';
import { SPACE_VALUES } from '@/styles/spacing';

import LivoIcon from '@/assets/icons/LivoIcon';
import { TabRoutes } from '@/router/TabsNavigator';

interface LivoTabBarProps extends BottomTabBarProps {}

// TODO: improve the tab bar test it and add it to the bottom tab navigator
export const LivoTabBar: React.FC<LivoTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();

  const initialNotifications = {
    [TabRoutes.ShiftsList]: false,
    [TabRoutes.ShiftsCalendar]: false,
    [TabRoutes.Settings]: false,
    [TabRoutes.ProAgenda]: false,
  };
  // TODO - repair notifications
  const [notificationDots, setNotificationDots] =
    useState(initialNotifications);

  return (
    <View
      style={[
        styles.tabRow,
        { paddingBottom: insets.bottom + SPACE_VALUES.small },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        let iconName;
        if (route.name === TabRoutes.ShiftsList) {
          iconName = 'report-medical';
        } else if (route.name === TabRoutes.ShiftsCalendar) {
          iconName = 'calendar';
        } else if (route.name === TabRoutes.ProAgenda) {
          iconName = 'users-group';
        } else if (route.name === TabRoutes.Settings) {
          iconName = 'settings';
        } else {
          iconName = 'report-medical';
        }
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          } else {
            if (route.name === TabRoutes.ProAgenda) {
              dispatch(fetchProfessionalAgendaThunk());
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={iconName}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >
            <View>
              <LivoIcon
                name={iconName}
                size={36}
                color={isFocused ? ACTION_BLUE : DIVIDER_GRAY}
              />
              {notificationDots[route.name as keyof typeof notificationDots] ? (
                <View style={styles.notification} />
              ) : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACE_VALUES.large,
    paddingTop: SPACE_VALUES.large,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    backgroundColor: WHITE,
    borderTopColor: '#C6D0DB',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notification: {
    backgroundColor: '#FA3D3B',
    width: SPACE_VALUES.small,
    height: SPACE_VALUES.small,
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: SPACE_VALUES.small,
  },
});
