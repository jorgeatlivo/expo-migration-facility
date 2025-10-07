import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';
import {
  SpecializationDTO,
  fetchShiftCancelReasons,
} from '@/services/shifts';
import { typographyStyles } from '@/styles/livoFonts';
import CancelButton from '../buttons/CancelButton';
import LivoTextInput from '../common/LivoTextInput';
import SingleSelect from '../common/SingleSelect';
import { BottomModal } from '../modals/BottomModal';
import StyledText from '../StyledText';

//Deprecated
interface DecreaseCapacityModalProps
  extends React.ComponentProps<typeof BottomModal> {
  onAction: (reason: string, reasonDetails: string) => void;
  subtitle: string;
}

export const DecreaseCapacityModal: React.FC<DecreaseCapacityModalProps> = ({
  onAction,
  subtitle,
  ...props
}) => {
  const { t } = useTranslation();

  const [reason, setReason] = useState<string>('');
  const [reasonDetails, setReasonDetails] = useState<string>('');
  const [options, setOptions] = useState<SpecializationDTO[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDecreaseCapacity = () => {
    const validrejectReason = reason !== 'OTHER' || reasonDetails.length > 0;
    if (validrejectReason) {
      props.dismissModal();
      onAction(reason, reasonDetails);
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
    setReason('');
    setErrorMessage('');
    props.dismissModal();
  };

  useEffect(() => {
    if (props.isVisible) {
      fetchShiftCancelReasons()
        .then((response) => {
          setOptions(response);
        })
        .catch((error) => {
          Alert.alert(t('loading_configuration_error_title'));
          props.dismissModal();
        });
    }
  }, [props.isVisible]);

  return (
    <BottomModal {...props} dismissModal={() => handleGoBack()}>
      <View style={{ flexGrow: 1 }}>
        <StyledText /* Label/Large */
          style={{
            ...typographyStyles.heading.small,
            marginBottom: 12, // TODO Locales
          }}
        >
          Eliminar puesto(s)
        </StyledText>
        <StyledText /* Label/Medium */
          style={{
            ...typographyStyles.subtitle.regular,
            marginBottom: 12, // TODO Locales
          }}
        >
          {subtitle}
        </StyledText>
        {options.map((reasonOption) => (
          <View key={reasonOption.name} style={{ marginBottom: 12 }}>
            <SingleSelect
              key={reasonOption.name}
              option={
                reasonOption?.displayText ??
                reasonOption.translations?.es ??
                reasonOption.name
              }
              checked={reasonOption.name === reason}
              onPress={() => setReason(reasonOption.name)}
            />
            {reason === reasonOption.name && reasonOption.name === 'OTHER' && (
              <LivoTextInput
                style={{
                  marginTop: 12,
                }}
                errorMessage={errorMessage}
                onChangeText={handleInputChange}
                placeholder={t('shift_detail_cancel_shift_reason_placeholder')}
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                value={reasonDetails}
              />
            )}
          </View>
        ))}
        <StyledText /* Label/Medium */
          onPress={() => handleGoBack()}
          style={{
            ...typographyStyles.action.regular,
            color: '#149EF2', //Action/Regular
            textAlign: 'center',
            margin: 16,
          }}
        >
          Volver
        </StyledText>
        <CancelButton
          title={t('delete_positions_button_title')}
          onPress={() => handleDecreaseCapacity()}
          style={{ marginBottom: 12 }}
        />
      </View>
    </BottomModal>
  );
};
