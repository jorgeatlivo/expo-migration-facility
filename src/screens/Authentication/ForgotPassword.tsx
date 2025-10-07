import { useHeaderHeight } from '@react-navigation/elements';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ActionButton from '@/components/buttons/ActionButton';
import CustomTextInput from '@/components/common/CustomTextInput';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import StyledText from '@/components/StyledText';
import { resetPasswordRequest } from '@/services/authentication';
import { WHITE } from '@/styles/colors';
import { LayoutTextEnum, fontSize, fontWeight } from '@/styles/fonts';
import {
  AuthenticationStackParamslist,
  AuthStackRoutes,
} from './AuthenticationStack';

type ForgotPasswordScreenProps = StackScreenProps<
  AuthenticationStackParamslist,
  AuthStackRoutes.ForgotPassword
>;

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();

  const headerHeight = useHeaderHeight();
  const [email, setEmail] = useState('');
  const validEmail = email.trim() !== '';
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = () => {
    setIsLoading(true);
    resetPasswordRequest(email)
      .then(() => {
        setIsLoading(false);
        Alert.alert(
          t('signin_reset_password_title'),
          t('signin_reset_password_message')
        );
        navigation.navigate(AuthStackRoutes.SignIn);
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert('Error', error.message);
      });
  };

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', backgroundColor: WHITE }}
      >
        <LoadingScreen />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: WHITE }}
      >
        <View
          style={{
            flex: 1,
            paddingTop: 20,
            paddingBottom: 21,
            backgroundColor: WHITE,
            justifyContent: 'space-between',
          }}
        >
          <View style={{ paddingHorizontal: 20 }}>
            <StyledText
              type={LayoutTextEnum.screenTitle}
              style={{ marginBottom: 16, fontSize: 22 }}
            >
              {t('signin_forgot_password_screen_title')}
            </StyledText>
            <StyledText
              type={LayoutTextEnum.body}
              style={{ opacity: 0.5, marginBottom: 16 }}
            >
              {t('signin_forgot_password_screen_subtitle')}
            </StyledText>
            <StyledText
              type={LayoutTextEnum.body}
              style={{
                marginBottom: 8,
                fontSize: fontSize.medium,
                fontFamily: fontWeight.bold,
              }}
            >
              {t('signin_forgot_password_email_label')}
            </StyledText>
            <CustomTextInput
              placeholder="jose@dominio.com"
              style={{ marginBottom: 16 }}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View
            style={{
              marginHorizontal: 16,
              marginVertical: 12,
            }}
          >
            <ActionButton
              disabled={!validEmail}
              title={t('continue')}
              textStyle={[
                { fontSize: fontSize.small },
                !validEmail && { color: '#8C95A7' },
              ]}
              style={[
                { marginBottom: 8 },
                !validEmail && {
                  backgroundColor: '#EFF0F2',
                  borderColor: '#EFF0F2',
                },
              ]}
              onPress={() => {
                resetPassword();
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
