import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ProfessionalProfile } from '@/services/shifts';
import FavoriteProfessional from './FavoriteProfessional';
import { SPACE_VALUES } from '@/styles/spacing';
import { WHITE } from '@/styles/colors';
import { ShiftModalityEnum } from '@/types';
import { NavigationProp } from '@react-navigation/native';
import { ProtectedStackRoutes } from '@/router/ProtectedStack';

interface FavoriteProfessionalCardProps {
  shiftId?: number;
  claimId?: number;
  modality?: ShiftModalityEnum | null;
  professionalProfile: ProfessionalProfile;
  navigation: NavigationProp<any>;
  style?: StyleProp<ViewStyle>;
  source?: ProtectedStackRoutes;
}

export default function FavoriteProfessionalCard({
  shiftId,
  claimId,
  modality,
  professionalProfile,
  navigation,
  style,
  source,
}: FavoriteProfessionalCardProps) {
  return (
    modality === ShiftModalityEnum.EXTERNAL &&
    professionalProfile.favorite !== undefined && (
      <View style={[styles.cardStyle, style]}>
        <FavoriteProfessional
          professionalId={professionalProfile.id}
          favorite={professionalProfile.favorite}
          navigation={navigation}
          shiftId={shiftId}
          claimId={claimId}
          source={source}
        />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  cardStyle: {
    padding: SPACE_VALUES.large,
    borderRadius: SPACE_VALUES.small,
    backgroundColor: WHITE,
  },
});
