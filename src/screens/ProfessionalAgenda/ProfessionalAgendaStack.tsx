import React from 'react';
import { useTranslation } from 'react-i18next';
import { createStackNavigator } from '@react-navigation/stack';

import {
  ProfessionalAgendaStackParamList,
  ProfessionalAgendaStackRoutes,
} from '@/screens/ProfessionalAgenda/ProfessionalAgendaStack.types';

import { CustomHeaderBackIcon } from '@/components/common/CustomHeaderBackIcon';

import { ProfessionalAgendaList } from './ProfessionalAgenda';
import { ProfessionalAgendaDetailViewComponent } from './ProfessionalAgendaDetailView';

const Stack = createStackNavigator<ProfessionalAgendaStackParamList>();
const commonOptions = { headerShown: false };

export const ProfessionalAgendaStack = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      initialRouteName={ProfessionalAgendaStackRoutes.ProfessionalAgendaList}
    >
      <Stack.Screen
        name={ProfessionalAgendaStackRoutes.ProfessionalAgendaList}
        component={ProfessionalAgendaList}
        options={{
          ...commonOptions,
          title: '',
          headerBackTitleVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ProfessionalAgendaStackRoutes.ProfessionalAgendaDetail}
        component={ProfessionalAgendaDetailViewComponent}
        options={({ navigation }) => ({
          ...commonOptions,
          title: t('professional_agenda_detail_view'),
          headerBackTitleVisible: false,
          headerShown: true,
          headerLeft: () => (
            <CustomHeaderBackIcon goBack={() => navigation.goBack()} />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
