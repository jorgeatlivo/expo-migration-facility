import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { SpecializationDTO, fetchShiftCancelReasons } from '@/services/shifts';
import { CORAL, GRAY, NOTIFICATION_RED, WHITE } from '@/styles/colors';
import { LayoutTextEnum, fontWeight } from '@/styles/fonts';
import CommonButton from './buttons/CommonButton';
import UndoButton from './buttons/UndoButton';
import CustomCheckBox from './common/CustomCheckBox';
import CustomTextInput from './common/CustomTextInput';
import StyledText from './StyledText';

interface Props {
  cancelShift: (cancelReason: string, reasonDetails: string) => void;
  goBack: () => void;
  modalVisible: boolean;
  title: string;
  subtitle: string;
  buttonTitle: string;
}

export const CancelShiftPopUp: React.FC<Props> = ({
  cancelShift,
  goBack,
  modalVisible,
  title,
  subtitle,
  buttonTitle,
}) => {
  const [cancelReason, setCancelReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [options, setOptions] = useState<SpecializationDTO[]>([]);
  const [reasonDetails, setReasonDetails] = useState<string>('');

  const { t } = useTranslation();

  const handleCancelShift = () => {
    console.log(cancelReason);
    const validCancelReason =
      cancelReason !== 'OTHER' || reasonDetails.length > 0;
    if (validCancelReason) {
      cancelShift(cancelReason, reasonDetails);
    } else {
      setErrorMessage(t('shift_detail_cancel_shift_invalid_reason_message'));
    }
  };

  const handleInputChange = (input: string) => {
    setReasonDetails(input);
    setErrorMessage('');
  };

  const handleGoBack = () => {
    setCancelReason('');
    setErrorMessage('');
    goBack();
  };

  useEffect(() => {
    if (modalVisible) {
      fetchShiftCancelReasons()
        .then((response) => {
          console.log(response);
          setOptions(response);
        })
        .catch((error) => {
          Alert.alert(t('loading_configuration_error_title'));
          goBack();
        });
    }
  }, [modalVisible]);

  return (
    <ReactNativeModal
      isVisible={modalVisible}
      onDismiss={() => handleGoBack()}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={300}
      useNativeDriver={true}
      onBackdropPress={() => handleGoBack()}
      hideModalContentWhileAnimating={true}
    >
      <View style={styles.container}>
        <StyledText type={LayoutTextEnum.header} style={styles.headerStyle}>
          {title}
        </StyledText>
        <StyledText
          type={LayoutTextEnum.subHeader}
          style={styles.subHeaderStyle}
        >
          {subtitle}
        </StyledText>
        {options.map((option) => {
          return (
            <View key={option.name}>
              <CustomCheckBox
                option={
                  option?.displayText ?? option.translations?.es ?? option.name
                }
                onPress={() => {
                  console.log(option.name);
                  setCancelReason(option.name);
                  setErrorMessage('');
                }}
                checked={cancelReason === option.name}
              />
              {cancelReason === option.name && option.name === 'OTHER' && (
                <CustomTextInput
                  style={styles.input}
                  onChangeText={handleInputChange}
                  placeholder={t(
                    'shift_detail_cancel_shift_reason_placeholder'
                  )}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={reasonDetails}
                />
              )}
            </View>
          );
        })}
        {!!errorMessage && (
          <StyledText type={LayoutTextEnum.body} style={styles.errorMessage}>
            {errorMessage}
          </StyledText>
        )}
        <View style={styles.buttonRow}>
          <CommonButton
            color={CORAL}
            backgroundColor={WHITE}
            borderColor={CORAL}
            title={buttonTitle}
            onPress={handleCancelShift}
            disabled={cancelReason.length === 0}
            style={[
              styles.buttonStyle,
              cancelReason.length === 0 && { opacity: 0.5 },
            ]}
          />
          <UndoButton
            title={t('shift_detail_go_back_button')}
            onPress={handleGoBack}
            style={styles.buttonStyle}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  transparentBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: WHITE,
    padding: 30,
    borderRadius: 16,
    margin: 16,
  },
  headerStyle: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeaderStyle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonStyle: {
    marginVertical: 5,
  },
  errorMessage: {
    color: NOTIFICATION_RED,
    marginBottom: 12,
    marginTop: 10,
  },
  buttonRow: {
    marginTop: 15,
  },
  filterLabel: {
    marginBottom: 10,
    fontFamily: fontWeight.bold,
  },
  input: {
    borderColor: GRAY + 80,
    marginTop: 10,
  },
});
