import { useHeaderHeight } from '@react-navigation/elements';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import ActionButton from '@/components/buttons/ActionButton';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import StyledText from '@/components/StyledText';
import { ApiApplicationError, setApiToken } from '@/services/api';
import {
  signInRequest,
  storeUserSession,
  verifyMFARequest,
} from '@/services/authentication';
import { signInAction } from '@/store/actions/authenticationActions';
import { loadUserId } from '@/store/actions/configurationActions';
import {
  ACTION_BLUE,
  BADGE_GRAY,
  NOTIFICATION_RED,
  SLATE_GRAY,
  WHITE,
} from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { decodeJWT } from '@/utils/utils';
import {
  AuthenticationStackParamslist,
  AuthStackRoutes,
} from './Authentication/AuthenticationStack';
import Row from '@/components/atoms/Row';

type VerifyMFAScreenProps = StackScreenProps<
  AuthenticationStackParamslist,
  AuthStackRoutes.VerifyMFA
>;

export const VerifyMFAScreen: React.FC<VerifyMFAScreenProps> = ({ route }) => {
  const { t } = useTranslation();

  const [OTP, setOTP] = useState(['', '', '', '']); // Create a state for the OTP
  const focusedIndex = OTP.findIndex((digit) => digit === '');
  const [errorMessage, setErrorMessage] = useState(''); // Create a state for the error message
  const { email, password } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const setUserId = (userToken: string) => {
    const token = userToken.split(' ')[1];
    const decoded = decodeJWT(token);
    dispatch(loadUserId(decoded.sub.toString()));
  };

  const setSignInConfiguration = async (userToken: string) => {
    await storeUserSession(userToken, email);
    setUserId(userToken);
    setApiToken(userToken);
  };
  const hiddenInputRef = useRef<TextInput>(null); // Create a ref for the hidden TextInput
  const verifyOTP = () => {
    setIsLoading(true);
    verifyMFARequest(email, OTP.join(''))
      .then(async (token) => {
        setIsLoading(false);
        await setSignInConfiguration(token!!);
        dispatch(signInAction(token!!));
      })
      .catch((error) => {
        setIsLoading(false);
        if (error instanceof ApiApplicationError) {
          if (error.name === 'TIMEOUT_ERROR') {
            Alert.alert('Error', error.message);
          } else {
            setErrorMessage(error.message);
          }
        }
      });
  };

  const resend = () => {
    setIsLoading(true);
    signInRequest({ userName: email, password })
      .then(() => {
        setIsLoading(false);
        Alert.alert(t('email_sent_success_message'));
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
        setIsLoading(false);
      });
  };

  const headerHeight = useHeaderHeight();
  if (isLoading) {
    return (
      <View style={styles.screen}>
        <LoadingScreen />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight - 10 : 0}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        <View style={styles.body}>
          <View style={styles.form}>
            <StyledText style={styles.verifyCodeTitle}>
              {t('signin_verify_code_title')}
            </StyledText>
            <StyledText style={styles.verifyCodeMessage}>
              {t('signin_verify_code_message')}
            </StyledText>
            <Row alignItems={'center'} style={styles.emailRow}>
              <StyledText style={styles.email}>{email}</StyledText>
            </Row>
            <View style={styles.flex}>
              <View style={styles.flex}>
                <TouchableOpacity
                  onPress={() => {
                    hiddenInputRef.current?.focus();
                  }}
                >
                  <Row>
                    {OTP.map((otpDigit, index) => (
                      <View
                        key={index}
                        style={[
                          styles.otpBox,
                          focusedIndex === index && styles.focusedBox,
                        ]}
                      >
                        <StyledText style={styles.otpDigit}>
                          {otpDigit ? otpDigit : '-'}
                        </StyledText>
                      </View>
                    ))}
                  </Row>
                  <TextInput
                    keyboardType="numeric"
                    blurOnSubmit={false}
                    ref={hiddenInputRef}
                    style={styles.hiddenInput}
                    autoFocus={true}
                    maxLength={4}
                    value={OTP.join('')}
                    onChangeText={(text) => {
                      let newOtp = [];
                      for (let i = 0; i < 4; i++) {
                        newOtp.push(text[i] || '');
                      }
                      setOTP(newOtp);
                    }}
                  />
                </TouchableOpacity>
                {errorMessage ? (
                  <StyledText style={styles.error}>{errorMessage}</StyledText>
                ) : null}
                <StyledText style={styles.notReceived}>
                  {t('signin_verify_code_not_received')}
                </StyledText>
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={() => resend()}
                >
                  <StyledText style={styles.resendLabel}>
                    {t('signin_verify_code_resend')}
                  </StyledText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.actionRow}>
            <ActionButton
              disabled={false}
              title={t('continue')}
              onPress={() => verifyOTP()}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: WHITE,
  },
  body: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 21,
    backgroundColor: WHITE,
    justifyContent: 'space-between',
  },
  form: {
    paddingHorizontal: 20,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  email: {
    ...typographyStyles.heading.medium,
    marginRight: SPACE_VALUES.small,
  },
  emailRow: {
    marginBottom: SPACE_VALUES.large,
  },
  verifyCodeTitle: {
    ...typographyStyles.heading.medium,
    marginBottom: SPACE_VALUES.large,
  },
  verifyCodeMessage: {
    ...typographyStyles.body.regular,
    marginBottom: SPACE_VALUES.small,
  },
  otpBox: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    borderColor: SLATE_GRAY,
    backgroundColor: WHITE,
    overflow: 'visible',
    flex: 1,
  },
  focusedBox: {
    borderWidth: 2,
    borderColor: '#325986',
  },
  otpDigit: {
    ...typographyStyles.body.regular,
    color: '#000000',
    textAlign: 'center',
  },
  hiddenInput: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  error: {
    fontSize: 12,
    marginTop: 8,
    color: NOTIFICATION_RED,
  },
  notReceived: {
    ...typographyStyles.body.regular,
    marginTop: SPACE_VALUES.large,
    color: BADGE_GRAY,
  },
  resendButton: {
    marginTop: SPACE_VALUES.small,
  },
  resendLabel: {
    ...typographyStyles.action.regular,
    color: ACTION_BLUE,
  },
  actionRow: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
});
