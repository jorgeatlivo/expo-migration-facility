import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import AnalyticsService from '@/services/analytics/analytics.service';
import { AnalyticEvents } from '@/services/analytics/events';

import StyledText from '@/components/StyledText';
import { renderProfessionalProfileCardByOverviewDTO } from '@/components/widgets/professionals/ProfessionalProfileCard';

import {
  ACTION_BLACK,
  ACTION_BLUE,
  BACKGROUND_BLUE,
  BLACK,
  BLUE_FADED,
} from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { ProfessionalOverviewDTO } from '@/types/professionals';

import LivoIcon from '@/assets/icons/LivoIcon';
import { ProtectedStackRoutes } from '@/router/ProtectedStack';

interface ProfessionalsSelectorComponentProps {
  title: string;
  description: string;
  capacity: number;
  addButtonLabel: string;
  selectedProfessionals: ProfessionalOverviewDTO[];
  setSelectedProfessionals: (
    professionalIds: ProfessionalOverviewDTO[]
  ) => void;
  onAddProfessional: () => any;
  source?: ProtectedStackRoutes;
}

export const ProfessionalsSelectorComponent = ({
  title,
  description,
  addButtonLabel,
  capacity,
  setSelectedProfessionals,
  selectedProfessionals,
  onAddProfessional,
  source,
}: ProfessionalsSelectorComponentProps) => {
  const slots = useMemo(
    () => Array.from({ length: capacity }, (_, i) => i),
    [capacity]
  );

  const addProfessional = () => {
    if (source === ProtectedStackRoutes.EditShift) {
      AnalyticsService.trackEvent(
        AnalyticEvents.SHIFT_DETAILS_ADD_INVITATION_SLOT
      );
    }
    onAddProfessional();
  };

  const removeProfessional = (professionalId: number) => {
    if (source === ProtectedStackRoutes.PublishShift) {
      AnalyticsService.trackEvent(AnalyticEvents.ASSIGN_CANDIDATES_DELETE, {
        professionalId,
      });
    } else if (source === ProtectedStackRoutes.EditShift) {
      AnalyticsService.trackEvent(
        AnalyticEvents.SHIFT_DETAILS_DELETE_INVITATION_SLOT,
        {
          professionalId,
        }
      );
    }
    setSelectedProfessionals(
      selectedProfessionals.filter((pro) => pro.id !== professionalId)
    );
  };

  return (
    <View style={styles.container}>
      <StyledText style={styles.title}>{title}</StyledText>
      <StyledText style={styles.description}>{description}</StyledText>

      {slots.map((index) => {
        const selectedPro = selectedProfessionals?.[index] ?? null;
        const renderRemoveButton = () => (
          <TouchableOpacity
            style={{ alignSelf: 'center' }}
            onPress={() => removeProfessional(selectedPro.id)}
          >
            <LivoIcon name="trash" size={24} color="#ACBBCB" />
          </TouchableOpacity>
        );
        return (
          <View key={`professional-slot-${index}`} style={styles.slotContainer}>
            {selectedPro ? (
              renderProfessionalProfileCardByOverviewDTO(selectedPro, {
                renderRightComponent: !selectedPro.readOnly
                  ? renderRemoveButton
                  : undefined,
              })
            ) : (
              <TouchableOpacity
                style={styles.addContainer}
                onPress={addProfessional}
              >
                <View style={styles.plusIcon}>
                  <LivoIcon name="plus" size={24} color={ACTION_BLUE} />
                </View>
                <StyledText style={styles.addLabel}>
                  {addButtonLabel}
                </StyledText>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACE_VALUES.large,
  },
  title: {
    ...typographyStyles.heading.small,
    color: BLACK,
    marginBottom: SPACE_VALUES.medium,
  },
  description: {
    ...typographyStyles.body.small,
    color: BLUE_FADED,
    marginBottom: SPACE_VALUES.large,
  },
  slotContainer: {
    marginBottom: SPACE_VALUES.large,
  },
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusIcon: {
    marginBottom: SPACE_VALUES.tiny,
    padding: SPACE_VALUES.medium,
    borderRadius: 8,
    backgroundColor: BACKGROUND_BLUE,
  },
  addLabel: {
    ...typographyStyles.body.regular,
    marginLeft: SPACE_VALUES.small,
    color: ACTION_BLACK,
  },
});
