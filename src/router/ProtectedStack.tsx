import { useTranslation } from 'react-i18next';
import { createStackNavigator } from '@react-navigation/stack';

import { SelectCategoryScreen } from '@/screens/CalendarScreen/SelectCategoryScreen';
import { LivoCVScreen } from '@/screens/Curriculum/LivoCVScreen';
import FavoriteProfessionalsScreen from '@/screens/ProfileScreen/FavoriteProfessionalsScreen';
import PdfViewerScreen from '@/screens/ProfileScreen/PdfViewerScreen';
import { ProfessionalProfileScreen } from '@/screens/ProfileScreen/ProfessionalProfileScreen';
import { ViewProfessionalProfileScreen } from '@/screens/ProfileScreen/ViewProfessionalProfileScreen';
import { PublishShiftScreen } from '@/screens/PublishShift/PublishShiftScreen';
import { SearchProfessionalsForShiftInvitationScreen } from '@/screens/PublishShift/SearchProfessionalsForInvitationScreen';
import { ChangePassword } from '@/screens/Settings/ChangePassword';
import { EditShiftScreen } from '@/screens/ShiftDetails/EditShiftScreen';
import ShiftDetailsScreen from '@/screens/ShiftDetailsScreen';

import { CustomHeaderBackIcon } from '@/components/common/CustomHeaderBackIcon';
import { ProfessionalReviewsScreen } from '@/components/ProfessionalReviewsScreen';

import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack.types';
import TabNavigation from '@/router/TabsNavigator';

const Stack = createStackNavigator<ProtectedStackParamsList>();
const headerBack = (callback: () => void) => (
  <CustomHeaderBackIcon goBack={callback} />
);

export const ProtectedStack = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator initialRouteName={ProtectedStackRoutes.Home}>
      <Stack.Screen
        name={ProtectedStackRoutes.Home}
        component={TabNavigation}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={ProtectedStackRoutes.PublishShift}
        component={PublishShiftScreen}
        options={({ navigation }) => ({
          title: t('shift_list_publish_shift_title'),
          headerBackTitleVisible: false,
          headerShown: true,
          headerLeft: () => headerBack(navigation.goBack),
        })}
      />
      <Stack.Screen
        name={ProtectedStackRoutes.ShiftDetails}
        component={ShiftDetailsScreen}
        options={({ navigation }) => ({
          headerBackTitleVisible: false,
          title: t('shift_list_shift_details_title'),
          headerLeft: () => headerBack(navigation.goBack),
        })}
      />
      <Stack.Screen
        name={ProtectedStackRoutes.EditShift}
        component={EditShiftScreen}
        options={({ navigation, route }) => ({
          title:
            t('shift_list_edit_shift_title') +
            (route.params.shiftInfo.category
              ? ` - ${route.params.shiftInfo.category?.displayText}`
              : ''),
          headerBackTitleVisible: false,
          headerShown: true,
          headerLeft: () => headerBack(navigation.goBack),
        })}
      />
      <Stack.Screen
        name={ProtectedStackRoutes.ProfessionalProfile}
        component={ProfessionalProfileScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerBackTitleVisible: false,
          title: t('professional_profile_title'),
          headerLeft: () => headerBack(navigation.goBack),
        })}
      />
      <Stack.Screen
        name={ProtectedStackRoutes.ViewProfessionalProfile}
        component={ViewProfessionalProfileScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerBackTitleVisible: false,
          title: t('professional_profile_title'),
          headerLeft: () => headerBack(navigation.goBack),
        })}
      />
      <Stack.Screen
        name={ProtectedStackRoutes.ChangePassword}
        component={ChangePassword}
        options={({ navigation }) => ({
          headerShown: true,
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          title: t('setting_change_password'),
          headerLeft: () => headerBack(navigation.goBack),
        })}
      />
      <Stack.Screen
        name={ProtectedStackRoutes.FavoriteProfessionals}
        component={FavoriteProfessionalsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          title: t('favorite_professionals_title'),
          headerLeft: () => headerBack(navigation.goBack),
        })}
      />
      <Stack.Screen
        name={ProtectedStackRoutes.PdfViewer}
        component={PdfViewerScreen}
        options={({ navigation }) => ({
          title: t('shift_list_pdf_viewer_title'),
          headerBackTitleVisible: false,
          headerLeft: () => headerBack(navigation.goBack),
        })}
      />
      <Stack.Screen
        name={ProtectedStackRoutes.LivoCV}
        component={LivoCVScreen}
        options={({ navigation }) => ({
          title: t('shift_list_curriculum_title'),
          headerBackTitleVisible: false,
          headerLeft: () => headerBack(navigation.goBack),
        })}
      />

      <Stack.Screen
        name={ProtectedStackRoutes.ProfessionalReviews}
        component={ProfessionalReviewsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerBackTitleVisible: false,
          title: t('professional_reviews_screen_title'),
          headerLeft: () => headerBack(navigation.goBack),
        })}
      />
      <Stack.Screen
        name={ProtectedStackRoutes.SelectCategory}
        component={SelectCategoryScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerBackTitleVisible: false,
          title: t('select_category_screen_title'),
          headerLeft: () => headerBack(navigation.goBack),
        })}
      />
      <Stack.Screen
        name={ProtectedStackRoutes.SearchProfessionalForShiftInvitation}
        component={SearchProfessionalsForShiftInvitationScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerBackTitleVisible: false,
          title: t('assign_professionals_title'),
          headerLeft: () => headerBack(navigation.goBack),
        })}
      />
    </Stack.Navigator>
  );
};
