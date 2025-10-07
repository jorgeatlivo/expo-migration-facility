import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';
import {
  SpecializationDTO,
  fetchShiftClaimRejectReasons,
} from '@/services/shifts';
import LivoTextInput from '../common/LivoTextInput';
import SingleSelect from '../common/SingleSelect';
import { BottomModal } from '../modals/BottomModal';
import StyledText from '../StyledText';
import { typographyStyles } from '@/styles/livoFonts';
import { ACTION_BLUE, BLACK, CORAL, WHITE } from '@/styles/colors';
import CommonButton from '@/components/buttons/CommonButton';
import { SPACE_VALUES } from '@/styles/spacing';
import Col from '@/components/atoms/Col';
import CancelButton from '@/components/buttons/CancelButton';

interface RejectProfessionalModalProps
  extends React.ComponentProps<typeof BottomModal> {
  rejectShift: (reason: string, reasonDetails: string) => void;
}

export const RejectProfessionalModal: React.FC<
  RejectProfessionalModalProps
> = ({ rejectShift, isVisible, dismissModal, ...props }) => {
  const { t } = useTranslation();

  const [rejectReason, setRejectReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [options, setOptions] = useState<SpecializationDTO[]>([]);
  const [reasonDetails, setReasonDetails] = useState<string>('');

  const handleRejectClaim = () => {
    const validRejectReason =
      rejectReason !== 'OTHER' || reasonDetails.length > 0;
    if (validRejectReason) {
      dismissModal();
      rejectShift(rejectReason, reasonDetails);
    } else {
      setErrorMessage(
        t('shift_detail_cancel_shift_invalid_reason_message_reject')
      );
    }
  };

  const handleInputChange = (input: string) => {
    setReasonDetails(input);
    setErrorMessage('');
  };

  const handleGoBack = () => {
    setRejectReason('');
    setErrorMessage('');
    dismissModal();
  };

  useEffect(() => {
    if (isVisible) {
      fetchShiftClaimRejectReasons()
        .then((response) => {
          setOptions(response);
        })
        .catch(() => {
          Alert.alert(t('loading_configuration_error_title'));
          dismissModal();
        });
    }
  }, [isVisible, dismissModal, t]);

  return (
    <BottomModal
      {...props}
      isVisible={isVisible}
      dismissModal={() => handleGoBack()}
    >
      <Col gap={SPACE_VALUES.medium}>
        <StyledText style={styles.title}>
          {t('shift_detail_reject_claim_popup_title')}
        </StyledText>
        <StyledText /* Label/Medium */ style={styles.subtitle}>
          {t('shift_detail_reject_claim_popup_subtitle')}
        </StyledText>
        {options.map((reasonOption) => (
          <View key={reasonOption.name}>
            <SingleSelect
              key={reasonOption.name}
              option={
                reasonOption?.displayText ??
                reasonOption.translations?.es ??
                reasonOption.name
              }
              checked={reasonOption.name === rejectReason}
              onPress={() => setRejectReason(reasonOption.name)}
            />
            {rejectReason === reasonOption.name &&
              reasonOption.name === 'OTHER' && (
                <LivoTextInput
                  style={styles.otherReasonTextInput}
                  errorMessage={errorMessage}
                  onChangeText={handleInputChange}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={reasonDetails}
                  placeholder={t(
                    'shift_detail_cancel_shift_reason_placeholder'
                  )}
                />
              )}
          </View>
        ))}
      </Col>
      <CancelButton
        {...props}
        onPress={() => handleRejectClaim()}
        undoAction={() => handleGoBack()}
        undoColor={ACTION_BLUE}
        style={styles.actionButtons}
        undoTitle={t('common_dismiss')}
        title={t('shift_detail_reject_pending_claim')}
      />
    </BottomModal>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typographyStyles.body.large,
    marginBottom: SPACE_VALUES.medium,
    color: BLACK,
  },
  subtitle: {
    ...typographyStyles.body.regular,
    color: '#616673',
    marginBottom: SPACE_VALUES.small,
  },
  otherReasonTextInput: {
    marginTop: SPACE_VALUES.medium,
  },
  actionButtons: {
    marginTop: SPACE_VALUES.xLarge,
  },
});
