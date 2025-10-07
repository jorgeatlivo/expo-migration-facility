import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CustomHeaderBackIcon } from '@/components/common/CustomHeaderBackIcon';
import { BLACK } from '@/styles/colors';
import { useSelector } from 'react-redux';
import { RootState } from '@/types';
import { VerifyMFAScreen } from '@/screens/VerifyMFAScreen';
import { ForgotPasswordScreen } from './ForgotPassword';
import { SignInScreen } from './SignIn';

export enum AuthStackRoutes {
  SignIn = 'SignIn',
  VerifyMFA = 'VerifyMFA',
  ForgotPassword = 'ForgotPassword',
}

export type AuthenticationStackParamslist = {
  [AuthStackRoutes.VerifyMFA]: {
    email: string;
    password: string;
  };
  [AuthStackRoutes.SignIn]: undefined;
  [AuthStackRoutes.ForgotPassword]: undefined;
};

const Stack = createStackNavigator<AuthenticationStackParamslist>();

const commonOptions = (navigation: any) => ({
  headerShown: false,
  headerLeft: () => <CustomHeaderBackIcon goBack={() => navigation.goBack()} />,
});

export const AuthenticationStack = () => {
  const authenticationData = useSelector((state: RootState) => state.authData);
  const { isSigningOut } = authenticationData;

  return (
    <Stack.Navigator
      screenOptions={{ headerTitleAlign: 'center' }}
      initialRouteName={AuthStackRoutes.SignIn}
    >
      <Stack.Screen
        name={AuthStackRoutes.SignIn}
        component={SignInScreen}
        options={({ navigation }) => ({
          ...commonOptions,
          title: '',
          animationTypeForReplace: isSigningOut ? 'pop' : 'push',
          headerShown: false,
          headerLeft: () => {
            return <CustomHeaderBackIcon goBack={() => navigation.goBack()} />;
          },
        })}
      />
      <Stack.Screen
        name={AuthStackRoutes.VerifyMFA}
        component={VerifyMFAScreen}
        options={({ navigation }) => ({
          headerBackTitleVisible: false,
          title: '',
          headerTintColor: BLACK,
          headerLeft: () => (
            <CustomHeaderBackIcon goBack={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name={AuthStackRoutes.ForgotPassword}
        component={ForgotPasswordScreen}
        options={({ navigation }) => ({
          headerBackTitleVisible: false,
          title: '',
          headerTintColor: BLACK,
          headerLeft: () => (
            <CustomHeaderBackIcon goBack={() => navigation.goBack()} />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
