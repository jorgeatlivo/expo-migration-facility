import React, { useMemo, useState } from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { FacilityProfessionalsDTO } from './types';
import ProfessionalProfileCard from './ProfessionalProfileCard';
import { ProfessionalProfile } from '@/services/shifts';
import { SPACE_VALUES } from '@/styles/spacing';
import { typographyStyles } from '@/styles/livoFonts';
import { WHITE } from '@/styles/colors';
import { ClaimSummary } from '@/types';
import RemoveFavoriteProfessionalModal from '@/components/modals/RemoveFavoriteProfessional';
import { AppDispatch } from '@/store/configureStore';
import { useDispatch } from 'react-redux';
import { useModal } from '@/hooks/ModalContext';
import { updateFavoriteProfessional } from '@/services/professionals';
import { fetchClaimInfoAction } from '@/store/actions/claimActions';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import { SearchProfessionals } from './SearchProfessionals';

interface FavoriteProfessionalsProps extends FacilityProfessionalsDTO {
  isRefreshing: boolean;
  refreshData: () => void;
  origin?: ClaimSummary;
  style?: StyleProp<ViewStyle>;
}

const FavoriteProfessionalCard = ({
  professionalProfile,
  origin,
}: {
  professionalProfile: ProfessionalProfile;
  origin?: ClaimSummary;
}) => {
  const [isFavorite, setIsFavorite] = useState(!!professionalProfile.favorite);
  const { hideModal, configureBottomModal } = useModal();
  const dispatch = useDispatch<AppDispatch>();

  function showRemoveFavoriteProfessionalModal() {
    const modalContent = (
      <RemoveFavoriteProfessionalModal
        professionalId={professionalProfile.id}
        hideModal={hideModal}
        unfavoriteProfessional={() => {
          updateFavoriteProfessional(professionalProfile.id.toString(), false);
          setIsFavorite(false);
          hideModal();
          if (
            origin?.professionalId === professionalProfile.id &&
            origin?.shiftId &&
            origin?.claimId
          ) {
            dispatch(fetchClaimInfoAction(origin.shiftId, origin.claimId));
          }
        }}
      />
    );

    configureBottomModal(modalContent, 'remove-favorite-professional-modal');
  }

  function handleFavoritePress() {
    if (isFavorite) {
      showRemoveFavoriteProfessionalModal();
    } else {
      updateFavoriteProfessional(professionalProfile.id.toString(), true);
      setIsFavorite(true);
      if (
        origin?.professionalId === professionalProfile.id &&
        origin?.shiftId &&
        origin?.claimId
      ) {
        dispatch(fetchClaimInfoAction(origin.shiftId, origin.claimId));
      }
    }
  }

  return (
    <ProfessionalProfileCard
      {...professionalProfile}
      style={styles.professionalCard}
      key={professionalProfile.id} // Add explicit key
      renderRightComponent={() => (
        <ToggleSwitch
          style={{ alignSelf: 'center' }}
          isOn={isFavorite}
          onToggle={handleFavoritePress}
        />
      )}
    />
  );
};

export function FavoriteProfessionals({
  professionals,
  placeholder,
  isRefreshing,
  refreshData,
  origin,
  style,
}: FavoriteProfessionalsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProfessionals = useMemo(() => {
    return professionals.filter((professional) => {
      const fullName =
        `${professional.firstName} ${professional.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
  }, [professionals, searchQuery]);

  return (
    <SearchProfessionals
      professionals={filteredProfessionals}
      emptyListMessage={placeholder.professionalsList}
      onRefresh={refreshData}
      isRefreshing={isRefreshing}
      searchTerm={searchQuery}
      onSearchChange={setSearchQuery}
      onClearSearch={() => setSearchQuery('')}
      renderProfessionalCard={(item) => (
        <FavoriteProfessionalCard
          professionalProfile={item as ProfessionalProfile}
          origin={origin}
        />
      )}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  searchBar: {
    marginTop: SPACE_VALUES.small,
    marginHorizontal: SPACE_VALUES.medium,
    marginBottom: SPACE_VALUES.large,
  },
  emptyContainer: {
    flex: 1,
    padding: SPACE_VALUES.medium,
    justifyContent: 'flex-start',
    marginTop: SPACE_VALUES.medium,
  },
  emptyText: {
    ...typographyStyles.body.medium,
    textAlign: 'center',
  },
  flatList: {
    paddingTop: SPACE_VALUES.large,
    paddingHorizontal: SPACE_VALUES.medium,
  },
  professionalCard: {
    padding: SPACE_VALUES.medium,
  },
});
