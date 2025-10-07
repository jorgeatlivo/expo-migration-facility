import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ProfessionalProfile } from '@/services/shifts';
import StyledText from '@/components/StyledText';
import { typographyStyles } from '@/styles/livoFonts';
import { FirstShifterTag } from './FirstShifterTag';
import { SPACE_VALUES } from '@/styles/spacing';
import { SquareProfilePicture } from '@/components//claimReviews/SquareProfileImage';
import { CategoryTag } from '@/components//shiftDetails/CategoryTag';
import { FacilityStaffProfile, ShiftModalityEnum } from '@/types';
import { commonStyles } from '@/styles/commonStyles';
import FavoriteTag from './FavoriteTag';
import { ModalityTag } from '@/components//shiftList/ModalityTag';
import LivoIcon from '@/assets/icons/LivoIcon';
import { ACTION_BLACK, NOTIFICATION_RED } from '@/styles/colors';

export interface ProfileHeaderProps {
  modality: ShiftModalityEnum | null;
  professionalProfile: ProfessionalProfile;
  facilityProfile: FacilityStaffProfile;
  subtitleComponent?: React.ReactNode;
  note?: string | null;
}
export const ProfileHeaderComponent: React.FC<ProfileHeaderProps> = ({
  modality,
  professionalProfile,
  facilityProfile,
  subtitleComponent,
  note,
}) => {
  const isFavorite = !!professionalProfile.favorite;
  const shouldShowModalityTag =
    modality &&
    facilityProfile.livoPoolOnboarded &&
    facilityProfile.livoInternalOnboarded;

  return (
    <View style={{ alignItems: 'center' }}>
      <SquareProfilePicture
        size={92}
        profilePictureUrl={professionalProfile.profilePictureUrl}
        modality={modality}
      />
      <View style={{ marginTop: SPACE_VALUES.medium, alignItems: 'center' }}>
        <StyledText
          style={{
            ...typographyStyles.heading.small,
            marginBottom: SPACE_VALUES.tiny,
            textAlign: 'center',
            flexShrink: 1,
          }}
        >
          {professionalProfile.firstName} {professionalProfile.lastName}
        </StyledText>

        {(isFavorite || shouldShowModalityTag) && (
          <View
            style={[
              commonStyles.row,
              { justifyContent: 'center', marginBottom: SPACE_VALUES.tiny },
            ]}
          >
            {isFavorite && (
              <FavoriteTag outline size="small" style={styles.tag} />
            )}
            {shouldShowModalityTag && (
              <ModalityTag outline modality={modality!} />
            )}
          </View>
        )}

        {professionalProfile.category && (
          <CategoryTag
            category={professionalProfile.category}
            showLabel={true}
          />
        )}

        {professionalProfile.firstShifterForFacility && (
          <View
            style={{
              marginBottom: SPACE_VALUES.tiny,
            }}
          >
            <FirstShifterTag />
          </View>
        )}

        {subtitleComponent}

        {!!note ? (
          <View style={styles.noteRow}>
            <LivoIcon
              name="alert-triangle"
              size={16}
              color={NOTIFICATION_RED}
            />
            <StyledText
              ellipsizeMode="tail"
              numberOfLines={1}
              style={styles.noteText}
            >
              {note}
            </StyledText>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    marginHorizontal: SPACE_VALUES.small,
  },
  noteRow: {
    flexDirection: 'row',
    marginTop: SPACE_VALUES.small
  },
  noteText: {
    ...typographyStyles.body.small,
    color: ACTION_BLACK,
    marginLeft: SPACE_VALUES.tiny,
  },
});
