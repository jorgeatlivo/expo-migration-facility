import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';

import { ApiApplicationError } from '@/services/api';
import { changePasswordRequest } from '@/services/authentication';

import ActionButton from '@/components/buttons/ActionButton';
import CustomTextInput from '@/components/common/CustomTextInput';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import KeyboardAwareScrollView from '@/components/layout/KeyboardAwareScrollView';
import StyledText from '@/components/StyledText';

import { DARK_BLUE, WHITE } from '@/styles/colors';
import { commonStyles } from '@/styles/commonStyles';
import { LayoutTextEnum } from '@/styles/fonts';

import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack';

type ChangePasswordProps = StackScreenProps<
  ProtectedStackParamsList,
  ProtectedStackRoutes.ChangePassword
>;

export const ChangePassword: React.FC<ChangePasswordProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [invalidNewPassword, setInvalidNewPassword] = useState('');
  const [invalidOldPassword, setInvalidOldPassword] = useState('');
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    setPassword('');
    setNewPassword('');
    setPasswordConfirmation('');
  }, []);

  const handleSaveNewPassword = async () => {
    const validOldPassword = password.length > 0;
    const passwordsMatch = newPassword === passwordConfirmation;
    const passwordLength = newPassword.length > 0;
    if (!validOldPassword) {
      setInvalidOldPassword(t('setting_password_invalid'));
    } else if (!passwordsMatch) {
      setInvalidNewPassword(t('setting_error_password_not_match'));
    } else if (!passwordLength) {
      setInvalidNewPassword(t('setting_password_invalid'));
    } else {
      setIsLoading(true);
      await changePasswordRequest({
        oldPassword: password,
        newPassword,
      })
        .then(() => {
          Alert.alert(
            t('setting_password_changed_successful_title'),
            t('setting_password_changed_successful_message')
          );
          navigation.goBack();
          setPassword('');
          setNewPassword('');
          setPasswordConfirmation('');
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
          if (error instanceof ApiApplicationError) {
            Alert.alert(t('common_error'), error.message);
          } else {
            Alert.alert(
              t('common_error'),
              t('setting_password_error_change_password')
            );
          }
        });
    }
  };
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setInvalidOldPassword('');
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    setInvalidNewPassword('');
  };

  const handlePasswordConfirmationChange = (text: string) => {
    setPasswordConfirmation(text);
    setInvalidNewPassword('');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <KeyboardAwareScrollView style={styles.keyboardAvoiding}>
          <View style={styles.editingField}>
            <StyledText type={LayoutTextEnum.header} style={styles.fieldHeader}>
              {t('setting_change_password_subheader')}
            </StyledText>
            <CustomTextInput
              value={password}
              onChangeText={handlePasswordChange}
              placeholder={t('setting_change_password_subheader')}
              secureTextEntry={true}
            />
            {invalidOldPassword.length > 0 && (
              <StyledText
                type={LayoutTextEnum.subHeader}
                style={styles.errorMessage}
              >
                {invalidOldPassword}
              </StyledText>
            )}
          </View>
          <View style={styles.editingField}>
            <StyledText type={LayoutTextEnum.header} style={styles.fieldHeader}>
              {t('setting_change_password_new')}
            </StyledText>
            <CustomTextInput
              value={newPassword}
              onChangeText={handleNewPasswordChange}
              placeholder={t('new_password_label')}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.editingField}>
            <CustomTextInput
              value={passwordConfirmation}
              onChangeText={handlePasswordConfirmationChange}
              placeholder={t('setting_change_password_confirm')}
              secureTextEntry={true}
            />
            {invalidNewPassword.length > 0 && (
              <StyledText
                type={LayoutTextEnum.subHeader}
                style={styles.errorMessage}
              >
                {invalidNewPassword}
              </StyledText>
            )}
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.saveButtonContainer}>
          <ActionButton
            title={t('setting_change_password')}
            onPress={() => handleSaveNewPassword()}
            style={styles.saveButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ...commonStyles,
  container: {
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  errorMessage: {
    color: 'red',
    marginVertical: 10,
  },
  saveButtonContainer: {},
  saveButton: {
    backgroundColor: DARK_BLUE,
  },
  keyboardAvoiding: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 20,
  },
  editingField: {
    marginBottom: 20,
  },
  fieldHeader: {
    marginBottom: 10,
  },
});
