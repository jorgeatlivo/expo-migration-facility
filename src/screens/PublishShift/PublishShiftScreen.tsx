import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack';
import { TabRoutes } from '@/router/TabsNavigator';
import { PublishShiftScreenComponent } from '@/components/publishShift/PublishShiftScreenComponent';

type PublishShiftScreenProps = StackScreenProps<
  ProtectedStackParamsList,
  ProtectedStackRoutes.PublishShift
>;

export const PublishShiftScreen: React.FC<PublishShiftScreenProps> = ({
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
          screen: TabRoutes.ShiftsList,
        })
      }
    />
  );
};
