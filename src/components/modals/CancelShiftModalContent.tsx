import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconX } from 'tabler-icons-react-native';
import { SpecializationDTO, fetchShiftCancelReasons } from '@/services/shifts';
import { WHITE } from '@/styles/colors';
import { FontWeightEnum, typographyStyles } from '@/styles/livoFonts';
import CommonButton from '../buttons/CommonButton';
import CustomTextInput from '../common/CustomTextInput';
import { SingleSelectSimple } from '../filter/SingleSelectSimple';
import StyledText from '../StyledText';

interface Props {
  cancelShift: (cancelReason: string, reasonDetails: string) => void;
  goBack: () => void;
  title: string;
  buttonTitle: string;
}

export const CancelShiftModalContent: React.FC<Props> = ({
  cancelShift,
  goBack,
  title,
  buttonTitle,
}) => {
  const [cancelReason, setCancelReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [options, setOptions] = useState<SpecializationDTO[]>([]);
  const [reasonDetails, setReasonDetails] = useState<string>('');

  const { t } = useTranslation();

  const handleCancelShift = () => {
    const validCancelReason =
      cancelReason !== 'OTHER' || reasonDetails.length > 0;
    if (validCancelReason) {
      cancelShift(cancelReason, reasonDetails);
    } else {
      setErrorMessage(
        t('shift_detail_cancel_shift_invalid_reason_message_cancel')
      );
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
    fetchShiftCancelReasons()
      .then((response) => {
        setOptions(response);
      })
      .catch((error) => {
        Alert.alert(t('loading_configuration_error_title'));
        goBack();
      });
  }, []);

  return (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginBottom: 12,
        }}
        onPress={() => {
          handleGoBack();
        }}
      >
        <IconX size={24} color={'#303136'} />
      </TouchableOpacity>
      <StyledText
        style={{
          ...typographyStyles.heading.medium,
          marginBottom: 12,
        }}
      >
        {title}
      </StyledText>
      {options.map((option) => {
        return (
          <View key={option.name}>
            <SingleSelectSimple
              option={option?.displayText ?? option.translations?.es ?? option.name}
              onPress={() => {
                setCancelReason(option.name);
                setErrorMessage('');
              }}
              checked={cancelReason === option.name}
            />
            {cancelReason === option.name && option.name === 'OTHER' && (
              <CustomTextInput
                style={styles.input}
                onChangeText={handleInputChange}
                placeholder={t('shift_detail_cancel_shift_reason_placeholder')}
                keyboardType="default"
                value={reasonDetails}
                errorMessage={errorMessage}
              />
            )}
          </View>
        );
      })}
      <View
        style={{
          paddingVertical: 12,
        }}
      >
        <CommonButton
          color={WHITE}
          backgroundColor={'#FA3D3B'}
          borderColor={'#FA3D3B'}
          title={buttonTitle}
          undoAction={handleGoBack}
          undoTitle={t('common_dismiss')}
          onPress={handleCancelShift}
          disabled={cancelReason.length === 0}
        />
      </View>
    </View>
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
    backgroundColor: 'white',
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
  errorMessage: {
    color: 'red',
    marginBottom: 12,
    marginTop: 10,
  },
  buttonRow: {
    marginTop: 15,
  },
  filterLabel: {
    marginBottom: 10,
    fontFamily: FontWeightEnum.strong,
  },
  input: {
    marginTop: 10,
  },
});
