import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { ProfessionalProfile } from '@/services/shifts';

import { WHITE } from '@/styles/colors';
import { SPACE_VALUES } from '@/styles/spacing';

import { ShiftModalityEnum } from '@/types';
import { InternalExperienceComponent } from './InternalExperienceComponent';
import { LicenseNumberCard } from './LicenseNumberCard';
import { ProfileExperienceCard } from './ProfileExperienceCard';

type ProfileInformationProps = {
  modality: ShiftModalityEnum | null;
  professionalProfile: ProfessionalProfile;
  navigateToCV: () => void;
  navigateToLivoCV: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function ProfileInformation({
  modality,
  professionalProfile,
  navigateToCV,
  navigateToLivoCV,
  style,
}: ProfileInformationProps) {
  return modality === ShiftModalityEnum.INTERNAL ? (
    <View style={[styles.cardStyle, style]}>
      <InternalExperienceComponent
        employeeNumber={professionalProfile.internal?.employeeNumber}
        contractType={professionalProfile.internal?.contractType}
        unit={professionalProfile.internal?.unit}
        datafields={professionalProfile.internal?.dataFields}
      />
    </View>
  ) : (
    <>
      {professionalProfile.licenseNumber !== null ? (
        <LicenseNumberCard
          licenseNumber={professionalProfile.licenseNumber}
          style={{ marginBottom: SPACE_VALUES.medium }}
        />
      ) : null}

      <ProfileExperienceCard
        professionalProfile={professionalProfile}
        navigateToCV={navigateToCV}
        navigateToLivoCV={navigateToLivoCV}
      />
    </>
  );
}

const styles = StyleSheet.create({
  cardStyle: {
    padding: SPACE_VALUES.large,
    borderRadius: SPACE_VALUES.small,
    backgroundColor: WHITE,
  },
});
