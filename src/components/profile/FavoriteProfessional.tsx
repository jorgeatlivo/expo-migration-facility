import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useModal } from '@/hooks/ModalContext';
import { updateFavoriteProfessional } from '@/services/professionals';
import { ACTION_BLUE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import ToggleSwitch from '../common/ToggleSwitch';
import RemoveFavoriteProfessionalModal from '../modals/RemoveFavoriteProfessional';
import { ProtectedStackRoutes } from '@/router/ProtectedStack';
import AnalyticsService from '@/services/analytics/analytics.service';
import { AnalyticEvents } from '@/services/analytics/events';

interface FavoriteProfessionalProps {
  professionalId: number;
  favorite: boolean;
  navigation: NavigationProp<any>;
  shiftId?: number;
  claimId?: number;
  style?: StyleProp<ViewStyle>;
  source?: ProtectedStackRoutes;
}

export default function FavoriteProfessional({
  professionalId,
  favorite,
  navigation,
  shiftId,
  claimId,
  style,
  source,
}: FavoriteProfessionalProps) {
  const [isFavorite, setIsFavorite] = useState(favorite);
  const { hideModal, configureBottomModal } = useModal();

  const { t } = useTranslation();

  function showRemoveFavoriteProfessionalModal() {
    const modalContent = (
      <RemoveFavoriteProfessionalModal
        professionalId={professionalId}
        hideModal={hideModal}
        unfavoriteProfessional={() => {
          if (source === ProtectedStackRoutes.PublishShift) {
            AnalyticsService.trackEvent(
              AnalyticEvents.ASSIGN_CANDIDATES_TOGGLE_OFF_FAVORITE_PROFESSIONAL,
              { professionalId }
            );
          } else if (source === ProtectedStackRoutes.EditShift) {
            AnalyticsService.trackEvent(
              AnalyticEvents.SHIFT_DETAILS_TOGGLE_OFF_FAVORITE_PROFESSIONAL,
              { professionalId }
            );
          }
          updateFavoriteProfessional(professionalId.toString(), false);
          setIsFavorite(false);
          hideModal();
        }}
      />
    );

    configureBottomModal(modalContent, 'remove-favorite-professional-modal');
  }

  function handleFavoritePress() {
    if (isFavorite) {
      showRemoveFavoriteProfessionalModal();
    } else {
      if (source === ProtectedStackRoutes.PublishShift) {
        AnalyticsService.trackEvent(
          AnalyticEvents.ASSIGN_CANDIDATES_TOGGLE_ON_FAVORITE_PROFESSIONAL,
          { professionalId }
        );
      } else if (source === ProtectedStackRoutes.EditShift) {
        AnalyticsService.trackEvent(
          AnalyticEvents.SHIFT_DETAILS_TOGGLE_ON_FAVORITE_PROFESSIONAL,
          { professionalId }
        );
      }
      updateFavoriteProfessional(professionalId.toString(), true);
      setIsFavorite(true);
    }
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.column}>
        <Text style={styles.text}>{t('favorite_professional_label')}</Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(ProtectedStackRoutes.FavoriteProfessionals, {
              origin: { professionalId, shiftId, claimId },
            })
          }
        >
          <Text style={styles.actionText}>
            {t('view_all_favorite_professionals_label')}
          </Text>
        </TouchableOpacity>
      </View>

      <ToggleSwitch isOn={isFavorite} onToggle={handleFavoritePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
  text: {
    ...typographyStyles.subtitle.regular,
    marginBottom: SPACE_VALUES.tiny,
  },
  actionText: {
    ...typographyStyles.action.regular,
    color: ACTION_BLUE,
  },
});
