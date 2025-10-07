import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ClaimRequest, ProfessionalProfile} from '@/services/shifts';
import {SPACE_VALUES} from '@/styles/spacing';
import {FacilityStaffProfile, ShiftModalityEnum} from '@/types';
import SectionHeader from '@/components/common/SectionHeader';
import CancellationRequestCard from './CancellationRequestCard';
import CompensationOptionCard from './CompensationOptionCard';
import {CVSummaryCard} from './CVSummaryCard';
import FavoriteProfessionalCard from './FavoriteProfessionalCard';
import ProfileHeader from './ProfileHeader';
import ProfileInformation from './ProfileInformation';
import ReviewsCard from './ReviewsCard';
import SlotReasonCard from './SlotReasonCard';
import {TotalShiftsInFacilityCard} from './TotalShiftsInFacilityCard';
import { NavigationProp } from '@react-navigation/native';
import { ProtectedStackRoutes } from '@/router/ProtectedStack';

export interface ProfileComponentProps {
  shiftId?: number;
  claimRequest?: ClaimRequest;
  modality: ShiftModalityEnum | null;
  professionalProfile: ProfessionalProfile;
  facilityProfile: FacilityStaffProfile;
  navigateToReviews: () => void;
  navigateToCV: () => void;
  navigateToLivoCV: () => void;
  navigation: NavigationProp<any>;
  note?: string | null;
  source?: ProtectedStackRoutes;
}

export const ProfileComponent: React.FC<ProfileComponentProps> = ({
  shiftId,
  claimRequest,
  modality,
  professionalProfile,
  facilityProfile,
  navigateToReviews,
  navigateToCV,
  navigateToLivoCV,
  navigation,
  note,
  source,
}) => {
  const {t} = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View style={styles.section}>
          <ProfileHeader
            modality={modality}
            professionalProfile={professionalProfile}
            facilityProfile={facilityProfile}
            navigateToReviews={navigateToReviews}
            note={note}
          />
        </View>

        <SectionHeader
          icon="id-badge"
          title={t('professional_details_title')}
          style={[styles.section, {marginTop: SPACE_VALUES.large}]}
        />

        <ProfileInformation
          modality={modality}
          professionalProfile={professionalProfile}
          navigateToCV={navigateToCV}
          navigateToLivoCV={navigateToLivoCV}
          style={styles.section}
        />

        {typeof professionalProfile.cvSummary === 'string' && (
          <>
            <SectionHeader
              icon="sparkles"
              title={t('cv_summary_title')}
              style={[styles.section, styles.sectionHeader]}
            />

            <CVSummaryCard
              cvSummary={professionalProfile.cvSummary}
            />
          </>
        )}

        <SectionHeader
          icon="report-medical"
          title={t('experience_in_facility_title')}
          style={[styles.section, styles.sectionHeader]}
        />

        {typeof professionalProfile.totalShiftsInFacility ===
          'number' && (
          <TotalShiftsInFacilityCard
            totalShiftsInFacility={
              professionalProfile.totalShiftsInFacility
            }
            facilityName={facilityProfile.facility.name}
            style={{marginBottom: SPACE_VALUES.medium}}
          />
        )}

        <FavoriteProfessionalCard
          shiftId={shiftId}
          claimId={claimRequest?.id}
          modality={modality}
          professionalProfile={professionalProfile}
          navigation={navigation}
          style={styles.section}
          source={source}
        />

        {modality === ShiftModalityEnum.EXTERNAL && (
          <View>
            <SectionHeader
              icon="star"
              title={t('experience_in_livo_title')}
              style={[styles.section, styles.sectionHeader]}
            />

            <ReviewsCard
              professionalProfile={professionalProfile}
              navigation={navigation}
              style={styles.section}
            />
          </View>
        )}

        {claimRequest?.slotReasonOptions &&
          claimRequest.slotReasonOptions.length > 0 &&
          !!shiftId && (
            <View style={styles.section}>
              <SectionHeader
                icon="replace"
                title={t('replacement_reason_title')}
                style={[styles.section, styles.sectionHeader]}
              />

              <SlotReasonCard
                slotReason={
                  claimRequest.slotReason || {
                    value: '',
                    displayText: '',
                    comment: '',
                  }
                }
                slotReasonOptions={claimRequest.slotReasonOptions}
                slotReasonCommentDisplayed={
                  claimRequest.slotReasonCommentDisplayed
                }
                facilityShiftId={shiftId}
                claimRequestId={claimRequest.id}
              />
            </View>
          )}

        {claimRequest?.compensationOption && (
          <View>
            <SectionHeader
              icon="report-medical"
              title={t('compensation_type_title')}
              style={styles.section}
            />
            <CompensationOptionCard claimRequest={claimRequest} />
          </View>
        )}

        {claimRequest?.cancellationRequest && (
          <View>
            <SectionHeader
              icon="circle-minus"
              title={t('cancel_claim_reason_title')}
              style={styles.section}
            />
            <CancellationRequestCard claimRequest={claimRequest} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: SPACE_VALUES.medium,
  },
  sectionHeader: {
    marginTop: 20,
  },
});
