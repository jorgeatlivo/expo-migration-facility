import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { PublishShiftScreenComponent } from '@/components/publishShift/PublishShiftScreenComponent';

import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack.types';
import { TabRoutes } from '@/router/TabNavigator.types';

type PublishShiftScreenProps = StackScreenProps<
  ProtectedStackParamsList,
  ProtectedStackRoutes.PublishShift
>;

export const PublishShiftCalendar: React.FC<PublishShiftScreenProps> = ({
  navigation,
  route,
}) => {
  const defaultDate = route.params.date;
  return (
    <PublishShiftScreenComponent
      defaultDate={defaultDate}
      timeInDay={route.params.timeInDay}
      goBack={() =>
        navigation.navigate(ProtectedStackRoutes.Home, {
          screen: TabRoutes.ShiftsCalendar,
        })
      }
    />
  );
};
