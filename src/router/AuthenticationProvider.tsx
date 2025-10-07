import React, { useLayoutEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  fetchLivoContact,
  retrieveUserSession,
} from '@/services/authentication';
import { ActivityIndicator, Alert, View , StyleSheet } from 'react-native';
import { GRAY, WHITE } from '@/styles/colors';
import { configureUnauthorizedApi, setApiToken } from '@/services/api';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadLivoContactAction,
  loadUserId,
} from '@/store/actions/configurationActions';
import { LivoContact, RootState } from '@/types';
import { setTopLevelNavigator } from '@/utils/navigation';
import { decodeJWT } from '@/utils/utils';
import { ModalProvider, setModalProviderRef } from '@/hooks/ModalContext';
import { AuthenticationStack } from '@/screens/Authentication/AuthenticationStack';
import {
  restoreTokenAction,
  signOutAction,
} from '@/store/actions/authenticationActions';

import { ProtectedStack } from './ProtectedStack';

import { useEffectOnce } from '@/hooks/useEffectOnce';

export type RootStackParamList = {
  SignIn: undefined;
  Home: undefined;
  Splash: undefined;
  ForgotPassword: undefined;
  VerifyMFA: undefined;
};

const AuthProvider = () => {
  const { token, isLoading } = useSelector(
    (state: RootState) => state.authData
  );
  const dispatch = useDispatch();
  const setUserId = (userToken: string) => {
    const token = userToken.split(' ')[1];
    const decoded = decodeJWT(token);
    dispatch(loadUserId(decoded.sub.toString()));
  };

  useEffectOnce(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      try {
        const userToken = await retrieveUserSession();
        // Configure axios headers
        if (userToken) {
          setUserId(userToken);
          setApiToken(userToken);
          dispatch(restoreTokenAction(userToken));
        } else {
          dispatch(restoreTokenAction(''));
        }
      } catch (e) {
        dispatch(restoreTokenAction(''));
      }
    };

    const fetchConfigurationData = async () => {
      await fetchLivoContact()
        .then((livoContact: LivoContact) => {
          dispatch(loadLivoContactAction(livoContact));
        })
        .catch((error) => {
          Alert.alert('Error', error.message);
        });
    };

    fetchConfigurationData();
    bootstrapAsync();
  });

  useLayoutEffect(() => {
    return configureUnauthorizedApi(() => dispatch(signOutAction()));
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={GRAY} />
      </View>
    );
  }

  return (
    <ModalProvider
      ref={(modalProviderRef) => setModalProviderRef(modalProviderRef)}
    >
      <NavigationContainer
        ref={(navigationRef) => setTopLevelNavigator(navigationRef)}
      >
        {!token ? <AuthenticationStack /> : <ProtectedStack />}
      </NavigationContainer>
    </ModalProvider>
  );
};

export { AuthProvider };

const styles = StyleSheet.create({
  loadingScreen: {
    backgroundColor: WHITE,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
