import React, { useCallback, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useHeaderHeight } from '@react-navigation/elements';
import { StackScreenProps } from '@react-navigation/stack';

import { ApiApplicationError, setApiToken } from '@/services/api';
import { signInRequest, storeUserSession } from '@/services/authentication';
import { signInAction } from '@/store/actions/authenticationActions';
import { loadUserId } from '@/store/actions/configurationActions';

import {
  AuthenticationStackParamslist,
  AuthStackRoutes,
} from '@/screens/Authentication/AuthenticationStack.types';

import Col from '@/components/atoms/Col';
import ActionButton from '@/components/buttons/ActionButton';
import CustomTextInput from '@/components/common/CustomTextInput';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import StyledText from '@/components/StyledText';

import { ACTION_BLUE, BLUE_FADED, WHITE } from '@/styles/colors';
import { fontSize, fontWeight, LayoutTextEnum } from '@/styles/fonts';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { decodeJWT } from '@/utils/utils';

import LivoTwoColorLogo from '@/assets/icons/LivoTwoColorLogo';
import { handleLinkPress } from '@/common/utils';
import { RootState } from '@/types';

type SignInScreenProps = StackScreenProps<
  AuthenticationStackParamslist,
  AuthStackRoutes.SignIn
>;

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const contactInformation = useSelector(
    (state: RootState) => state.configurationData.livoContact
  );
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  const setUserId = useCallback(
    (userToken: string) => {
      const token = userToken.split(' ')[1];
      const decoded = decodeJWT(token);
      dispatch(loadUserId(decoded.sub.toString()));
    },
    [dispatch]
  );

  const setSignInConfiguration = useCallback(
    async (email: string, userToken: string) => {
      await storeUserSession(userToken, email);
      setUserId(userToken);
      setApiToken(userToken);
    },
    [setUserId]
  );

  const signIn = useCallback(() => {
    setIsLoading(true);
    signInRequest({ userName: email, password })
      .then(async (userToken) => {
        if (userToken!.mfaEnabled) {
          navigation.navigate(AuthStackRoutes.VerifyMFA, {
            email,
            password,
          });
        } else {
          await setSignInConfiguration(email, userToken!.userToken);
          dispatch(signInAction(userToken!.userToken));
        }

        setIsLoading(false);
        setPassword('');
      })
      .catch((error: any) => {
        console.log('error', error);
        if (error instanceof ApiApplicationError) {
          if (error.name === 'TIMEOUT_ERROR') {
            Alert.alert('Error', error.message);
          } else {
            setErrorMessage(error.message);
          }
        }
        setPassword('');
        setIsLoading(false);
      });
  }, [dispatch, email, navigation, password, setSignInConfiguration]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: WHITE }}>
        <LoadingScreen />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.backdrop}>
          <LivoTwoColorLogo />
        </View>
        <View style={styles.whiteSheet}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
            style={styles.flex}
          >
            <View style={styles.body}>
              <Col gap={SPACE_VALUES.large}>
                <View>
                  <StyledText style={typographyStyles.body.small}>
                    {t('forgot_password_email_placeholder')}
                  </StyledText>
                </View>
                <CustomTextInput
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={setEmail}
                />
                <View>
                  <StyledText style={typographyStyles.body.small}>
                    {t('signin_password_label')}
                  </StyledText>
                </View>
                <CustomTextInput
                  value={password}
                  secureTextEntry
                  onChangeText={setPassword}
                  errorMessage={errorMessage}
                />

                {/* Sign In Button */}
                <View style={styles.actionCol}>
                  <ActionButton
                    disabled={password === ''}
                    title={t('forgot_password_signin_button_title')}
                    textStyle={[
                      styles.signInButton,
                      password === '' && styles.inactiveButton,
                    ]}
                    style={[password === '' && styles.noPassword]}
                    onPress={signIn}
                  />
                </View>
                <StyledText
                  type={LayoutTextEnum.link}
                  style={styles.forgotPassword}
                  onPress={() =>
                    navigation.navigate(AuthStackRoutes.ForgotPassword)
                  }
                >
                  {t('signin_forgot_password_label')}
                </StyledText>
              </Col>
            </View>
          </KeyboardAvoidingView>

          <View style={styles.footer}>
            <StyledText style={styles.linkRow}>
              <StyledText
                style={styles.link}
                onPress={() =>
                  handleLinkPress(
                    contactInformation.privacyPolicyLink ||
                      t('signin_privacy_policy_link')
                  )
                }
              >
                {t('signin_privacy_policy_link_text')} {' | '}
              </StyledText>
              <StyledText
                style={styles.link}
                onPress={() =>
                  handleLinkPress(
                    contactInformation.termsAndConditionsLink ||
                      t('signin_terms_and_conditions_link')
                  )
                }
              >
                {t('signin_terms_and_conditions_link_text')} {' | '}
              </StyledText>
              <StyledText
                style={styles.link}
                onPress={() =>
                  handleLinkPress(
                    contactInformation.cookiesPolicyLink ||
                      t('signin_cookies_policy_link')
                  )
                }
              >
                {t('signin_cookies_policy_link_text')}
              </StyledText>
            </StyledText>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#375D68',
  },
  flex: {
    flex: 1,
  },
  backdrop: {
    paddingTop: SPACE_VALUES.large,
    paddingBottom: SPACE_VALUES.xLarge,
    alignItems: 'center',
    justifyContent: 'center',
    height: 96,
  },
  whiteSheet: {
    paddingTop: SPACE_VALUES.large,
    borderTopLeftRadius: SPACE_VALUES.large,
    borderTopRightRadius: SPACE_VALUES.large,
    backgroundColor: WHITE,
    flex: 1,
  },
  body: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 21,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  actionCol: {
    marginBottom: 16,
    marginHorizontal: 0,
  },
  signInButton: {
    fontSize: fontSize.small,
  },
  inactiveButton: {
    color: '#8C95A7',
  },
  noPassword: {
    backgroundColor: '#EFF0F2',
    borderColor: '#EFF0F2',
  },
  forgotPassword: {
    marginVertical: 8,
    fontSize: fontSize.small,
    fontFamily: fontWeight.bold,
    lineHeight: 16,
    textAlign: 'center',
  },
  footer: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  linkRow: {
    color: BLUE_FADED,
    marginBottom: SPACE_VALUES.large,
    ...typographyStyles.info.caption,
    textAlign: 'center',
  },
  link: {
    ...typographyStyles.action.small,
    color: ACTION_BLUE,
  },
});
