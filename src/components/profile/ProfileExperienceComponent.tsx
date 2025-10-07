import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ClaimRequest, CVType } from '@/services/shifts';

import StyledText from '@/components/StyledText';

import { ACTION_BLUE } from '@/styles/colors';
import { commonStyles } from '@/styles/commonStyles';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

import { DownloadCVButton } from './DownloadCVButton';
import { InformationRow } from './InformationRow';

export interface ProfileExperienceComponentProps {
  claimRequest: ClaimRequest;
  navigateToCV: (claimRequest: ClaimRequest) => void;
  navigateToLivoCV: (claimRequest: ClaimRequest) => void;
  style?: any;
}

export const ProfileExperienceComponent: React.FC<
  ProfileExperienceComponentProps
> = ({ claimRequest, navigateToCV, navigateToLivoCV, style }) => {
  const { t } = useTranslation();

  return (
    <View style={[style, styles.container]}>
      {claimRequest.professionalProfile.totalPerformedShifts ? (
        <InformationRow
          label={t('shift_list_total_performed_shifts')}
          value={claimRequest.professionalProfile.totalPerformedShifts.toString()}
        />
      ) : null}
      {claimRequest.professionalProfile.licenseNumber !== null ? (
        <InformationRow
          label={t('shift_list_license_number_label')}
          value={claimRequest.professionalProfile.licenseNumber}
        />
      ) : null}
      <View
        style={{
          ...commonStyles.spaceBetweenContainer,
          marginTop: SPACE_VALUES.large,
        }}
      >
        {claimRequest.professionalProfile.availableCVTypes.includes(
          CVType.LIVO_CV
        ) && (
          <TouchableOpacity onPress={() => navigateToLivoCV(claimRequest)}>
            <StyledText
              style={{
                ...typographyStyles.subtitle.regular,
                color: ACTION_BLUE,
              }}
            >
              {t('shift_list_view_experience_text')}
            </StyledText>
          </TouchableOpacity>
        )}
        {claimRequest.professionalProfile.availableCVTypes.includes(
          CVType.PDF_UPLOAD
        ) && <DownloadCVButton onPress={() => navigateToCV(claimRequest)} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'flex-end' },
});
