import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import LivoIcon from '@/assets/icons/LivoIcon';
import { CVType, ProfessionalProfile } from '@/services/shifts';
import { BADGE_GRAY } from '@/styles/colors';
import { commonStyles } from '@/styles/commonStyles';
import { typographyStyles } from '@/styles/livoFonts';
import StyledText from '../StyledText';
import { DownloadCVButton } from './DownloadCVButton';

interface ProfileExperienceCardProps {
  professionalProfile: ProfessionalProfile;
  navigateToCV: () => void;
  navigateToLivoCV: () => void;
  style?: any;
}

export function ProfileExperienceCard({
  professionalProfile,
  navigateToCV,
  navigateToLivoCV,
  style,
}: ProfileExperienceCardProps) {
  const { t } = useTranslation();

  const hasLivoCV = (
    professionalProfile.availableCVTypes || []
  ).includes(CVType.LIVO_CV);
  const hasCVPdf = (
    professionalProfile.availableCVTypes || []
  ).includes(CVType.PDF_UPLOAD);

  const component = (
    <View style={[commonStyles.cardContainer, style]}>
      <View style={commonStyles.spaceBetweenContainer}>
        <StyledText
          numberOfLines={1}
          ellipsizeMode="tail"
          style={hasLivoCV ? styles.boldTitle : styles.regularTitle}
        >
          {t('experience_information_title')}
          {hasLivoCV ? '' : ':'}
        </StyledText>
        {hasLivoCV ? (
          <LivoIcon name="chevron-right" size={24} color={BADGE_GRAY} />
        ) : (
          <DownloadCVButton onPress={() => navigateToCV()} />
        )}
      </View>
      {hasLivoCV && hasCVPdf && (
        <DownloadCVButton onPress={() => navigateToCV()} />
      )}
    </View>
  );

  if (hasLivoCV) {
    return (
      <TouchableOpacity onPress={() => navigateToLivoCV()}>
        {component}
      </TouchableOpacity>
    );
  }

  return component;
}

const styles = StyleSheet.create({
  regularTitle: {
    ...typographyStyles.body.regular,
    color: BADGE_GRAY,
  },
  boldTitle: {
    ...typographyStyles.subtitle.regular,
  },
});
