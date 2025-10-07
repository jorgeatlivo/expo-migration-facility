import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { SquareProfilePicture } from '@/components/claimReviews/SquareProfileImage';
import FavoriteTag from '@/components/profile/FavoriteTag';
import StyledText from '@/components/StyledText';
import { CategoryTag } from '@/components/shiftDetails/CategoryTag';

import {
  ACTION_BLACK,
  ACTION_BLUE,
  CAPTION_GRAY,
  NOTIFICATION_RED,
} from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { ProfessionalOverviewDTO } from '@/types/professionals';
import { splitName } from '@/utils/utils';

import LivoIcon from '@/assets/icons/LivoIcon';
import { Category, RootState, ShiftModalityEnum } from '@/types';

interface ProfessionalProfileCardProps {
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  totalPerformedShifts: number;
  modality?: ShiftModalityEnum;
  category?: Category | null;
  style?: StyleProp<ViewStyle>;
  favoriteTag?: boolean;
  note?: string | null;
  renderRightComponent?: () => any | null;
  navigateToProfessionalProfile?: () => void;
}

export default function ProfessionalProfileCard({
  firstName,
  lastName,
  profilePictureUrl,
  totalPerformedShifts,
  modality,
  category,
  style,
  favoriteTag,
  note,
  renderRightComponent,
  navigateToProfessionalProfile,
}: ProfessionalProfileCardProps) {
  const { t } = useTranslation();
  const { facilityProfile } = useSelector(
    (state: RootState) => state.profileData
  );
  const facilityName = facilityProfile.facility.name;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <SquareProfilePicture
          size={48}
          profilePictureUrl={profilePictureUrl}
          modality={modality ?? null}
        />
        <View style={[styles.info]}>
          <StyledText
            style={styles.name}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {firstName} {lastName}
          </StyledText>

          {!!favoriteTag ? <FavoriteTag /> : null}

          <View style={styles.rowCenter}>
            {!!category ? (
              <CategoryTag style={styles.tag} category={category} />
            ) : null}

            <StyledText style={styles.shiftsSubtitle}>
              {t('total_shifts_subtitle', {
                shift: totalPerformedShifts,
              })}
            </StyledText>

            <StyledText
              ellipsizeMode="tail"
              numberOfLines={1}
              style={styles.facilitySubtitle}
            >
              {facilityName
                ? `${t('shift_list_in')} ${facilityName}`
                : t('total_shifts_subtitle_in_facility')}
            </StyledText>
          </View>

          {!!note ? (
            <View style={styles.row}>
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

          {navigateToProfessionalProfile ? (
            <TouchableOpacity onPress={navigateToProfessionalProfile}>
              <StyledText style={styles.viewProfileLabel}>
                {t('common_view_more')}
              </StyledText>
            </TouchableOpacity>
          ) : null}
        </View>
        {renderRightComponent ? renderRightComponent() : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: SPACE_VALUES.medium,
    flex: 1,
  },
  name: {
    ...typographyStyles.heading.small,
  },
  tag: {
    backgroundColor: '#dae4e7',
    borderColor: '#dae4e7',
    marginRight: SPACE_VALUES.tiny,
  },
  shiftsSubtitle: {
    ...typographyStyles.subtitle.small,
  },
  facilitySubtitle: {
    ...typographyStyles.info.caption,
    marginLeft: SPACE_VALUES.tiny,
    color: CAPTION_GRAY,
  },
  viewProfileLabel: {
    ...typographyStyles.action.small,
    marginTop: SPACE_VALUES.tiny,
    color: ACTION_BLUE,
  },
  noteText: {
    ...typographyStyles.body.small,
    color: ACTION_BLACK,
    marginLeft: SPACE_VALUES.tiny,
  },
});

const PROFESSIONAL_ROLE_TO_MODALITY_MAP: Record<string, ShiftModalityEnum> = {
  PROFESSIONAL: ShiftModalityEnum.EXTERNAL,
  INTERNAL_PROFESSIONAL: ShiftModalityEnum.INTERNAL,
};

export const renderProfessionalProfileCardByOverviewDTO = (
  pro: ProfessionalOverviewDTO,
  otherProps?: Partial<ProfessionalProfileCardProps>
) => {
  const modality = PROFESSIONAL_ROLE_TO_MODALITY_MAP[pro.role];
  const [firstName, lastName] = splitName(pro.name);

  return (
    <ProfessionalProfileCard
      firstName={firstName}
      lastName={lastName}
      profilePictureUrl={pro.avatarUrl ?? ''}
      favoriteTag={pro.favorite}
      totalPerformedShifts={pro.completedShiftsInFacility ?? 0}
      modality={modality}
      note={pro.note}
      {...otherProps}
    />
  );
};
