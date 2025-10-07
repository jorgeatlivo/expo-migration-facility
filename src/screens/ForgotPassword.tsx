import React from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { resetPasswordRequest } from '@/services/authentication';

import ActionButton from '@/components/buttons/ActionButton';
import CustomTextInput from '@/components/common/CustomTextInput';
import LivoText from '@/components/common/LivoText';
import StyledText from '@/components/StyledText';

import {
  GRAY,
  LIVO_PRIMARY_DARK,
  LIVO_SECONDARY,
  LIVO_SECONDARY_LIGHT,
} from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

import { RootStackParamList } from '@/router/AuthenticationProvider';
import { AuthStackRoutes } from './Authentication/AuthenticationStack';

type ForgotPasswordScreenProps = StackScreenProps<
  RootStackParamList,
  'ForgotPassword'
>;
export const ForgotPassword: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();

  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const onResetPassword = async () => {
    const isValidEmail = email.length > 0;
    if (isValidEmail) {
      resetPassword();
    } else {
      setErrorMessage(t('forgot_password_email_invalid_error_msg'));
    }
  };

  const resetPassword = () => {
    setIsLoading(true);
    resetPasswordRequest(email)
      .then(() => {
        setIsLoading(false);
        Alert.alert(
          t('forgot_password_reset_password_title'),
          t('forgot_password_reset_password_message')
        );
        navigation.navigate(AuthStackRoutes.SignIn);
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert(t('shift_list_error_title'), error.message);
      });
  };

  const handleChangeEmail = (newEmail: string) => {
    setEmail(newEmail);
    setErrorMessage('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.form}>
            <View style={styles.logoContainer}>
              <StyledText
                style={{
                  ...typographyStyles.heading.medium,
                  color: LIVO_SECONDARY,
                  marginBottom: SPACE_VALUES.medium,
                }}
              >
                {t('forgot_password_reset_password_title')}
              </StyledText>
            </View>
            <CustomTextInput
              style={styles.input}
              onChangeText={handleChangeEmail}
              placeholder={t('forgot_password_email_placeholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errorMessage && (
              <LivoText style={styles.errorMessage}>{errorMessage}</LivoText>
            )}
            <ActionButton
              title={t('forgot_password_reset_password_button_title')}
              onPress={() => onResetPassword()}
              style={styles.forgotPasswordButton}
              disabled={isLoading}
              textStyle={styles.forgotPasswordButtonText}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: LIVO_PRIMARY_DARK,
  },
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 50,
  },
  labelStyle: {
    marginBottom: 6,
    opacity: 0.7,
    color: LIVO_SECONDARY_LIGHT,
  },
  logoContainer: {
    justifyContent: 'center',
  },

  forgotPasswordButton: {
    marginVertical: 5,
    backgroundColor: LIVO_SECONDARY,
    borderColor: LIVO_SECONDARY,
  },
  forgotPasswordButtonText: {
    color: LIVO_PRIMARY_DARK,
  },
  footerText: {
    color: GRAY,
    margin: 0,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  body: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    marginBottom: 12,
  },
  linkStyle: {
    color: LIVO_SECONDARY,
  },
  contactUsLink: {
    color: LIVO_SECONDARY,
    margin: 0,
    padding: 0,
    fontWeight: 'bold',
  },
  headerStyle: {
    backgroundColor: '#FFF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    width: '100%',
  },
  headerContainer: {
    width: '80%',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 12,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledStyle: {
    opacity: 0.5,
  },
});
