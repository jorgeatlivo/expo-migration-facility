import React from 'react';
import { useTranslation } from 'react-i18next';

import StyledText from '@/components/StyledText';

import { CORAL } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

import { ConfirmationModal } from './ConfirmationModal';

type RemoveFavoriteProfessionalModalProps = {
  professionalId: number;
  hideModal: () => void;
  unfavoriteProfessional: (professionalId: number) => void;
};

export default function RemoveFavoriteProfessionalModal({
  professionalId,
  hideModal,
  unfavoriteProfessional,
}: RemoveFavoriteProfessionalModalProps) {
  const { t } = useTranslation();

  return (
    <ConfirmationModal
      title={t('remove_favorite_professional_title')}
      dismissTitle={t('remove_favorite_professional_dismiss_title')}
      buttonTitle={t('remove_favorite_professional_button_title')}
      onDismiss={() => hideModal()}
      onPress={() => unfavoriteProfessional(professionalId)}
      buttonColor={CORAL}
    >
      <StyledText
        style={{
          ...typographyStyles.body.regular,
          marginBottom: SPACE_VALUES.medium,
        }}
      >
        {t('remove_favorite_professional_description_1')}
      </StyledText>

      <StyledText
        style={{
          ...typographyStyles.body.regular,
        }}
      >
        {t('remove_favorite_professional_description_2')}
      </StyledText>
    </ConfirmationModal>
  );
}
