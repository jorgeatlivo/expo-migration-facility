import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ClaimRequest } from '@/services/shifts';

import { ProfileImage } from '@/components/claimReviews/ProfileImage';
import CustomTextInput from '@/components/common/CustomTextInput';
import { Divider } from '@/components/common/Divider';
import StyledText from '@/components/StyledText';

import { CORAL } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

import { Shift } from '@/types';
import { ConfirmationModal } from './ConfirmationModal';
import { ShiftSummary } from './ShiftSummary';

type CancelClaimModalProps = {
  shift: Shift;
  hideModal: () => void;
  title: string;
  subtitle: string;
  removeClaim: (cancellationReason?: string) => void;
  cancellationReasonNeeded?: boolean;
  claimRequest: ClaimRequest;
};

export const CancelClaimModal: React.FC<CancelClaimModalProps> = ({
  shift,
  hideModal,
  removeClaim,
  cancellationReasonNeeded,
  title,
  subtitle,
  claimRequest,
}) => {
  const [cancellationReason, setCancellationReason] =
    React.useState<string>('');
  const { t } = useTranslation();

  const modalContent = (
    <View>
      <View
        style={{
          marginBottom: 12,
          padding: 12,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: '#8C95A7',
        }}
      >
        <ShiftSummary shift={shift} />

        <View
          style={{
            paddingVertical: SPACE_VALUES.small,
          }}
        >
          <Divider />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <ProfileImage
            profileImage={claimRequest.professionalProfile.profilePictureUrl}
            imageSize={32}
          />
          <StyledText
            style={{
              ...typographyStyles.subtitle.regular,
              marginLeft: SPACE_VALUES.small,
            }}
          >
            {claimRequest.professionalProfile.firstName}{' '}
            {claimRequest.professionalProfile.lastName}
          </StyledText>
        </View>
      </View>

      {subtitle && (
        <StyledText
          style={{
            ...typographyStyles.body.regular,
            marginBottom: 12,
          }}
        >
          {subtitle}
        </StyledText>
      )}

      {cancellationReasonNeeded && (
        <View
          style={{
            marginBottom: SPACE_VALUES.medium,
          }}
        >
          <StyledText
            style={{
              ...typographyStyles.subtitle.small,
              marginBottom: SPACE_VALUES.small,
            }}
          >
            {t('cancel_claim_reason_title')}
          </StyledText>
          <CustomTextInput
            value={cancellationReason}
            onChangeText={setCancellationReason}
            placeholder={t('cancel_claim_reason_placeholder')}
          />
        </View>
      )}
    </View>
  );

  return (
    <ConfirmationModal
      title={title}
      buttonTitle={t('shift_claim_cancel_button_title')}
      dismissTitle={t('common_dismiss')}
      buttonColor={CORAL}
      buttonDisabled={cancellationReasonNeeded && !cancellationReason}
      onDismiss={() => hideModal()}
      onPress={() => removeClaim(cancellationReason)}
    >
      {modalContent}
    </ConfirmationModal>
  );
};
