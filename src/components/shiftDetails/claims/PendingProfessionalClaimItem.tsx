import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LivoIcon from '@/assets/icons/LivoIcon';
import { useModal } from '@/hooks/ModalContext';
import { ApiApplicationError } from '@/services/api';
import {
  ClaimRequest,
  shiftClaimAccept,
  shiftClaimReject,
  SlotReason,
  SlotReasonOption,
} from '@/services/shifts';
import { fetchShiftInfoDataAction } from '@/store/actions/shiftActions';
import { AppDispatch } from '@/store/configureStore';
import { commonStyles } from '@/styles/commonStyles';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { modalityTags } from '@/styles/utils';
import { RootState, ShiftModalityEnum } from '@/types';
import ActionButton from '@/components/buttons/ActionButton';
import SelectAttributeModal from '@/components/common/SelectOptionWithDescriptionModal';
import { ProfileExperienceComponent } from '@/components/profile/ProfileExperienceComponent';
import StyledText from '@/components/StyledText';
import { RejectProfessionalModal } from '@/components/shiftDetails/RejectProfessionalReasonModal';
import { InternalPendingClaimBody } from './InternalPendingClaimBody';
import { InternalProfileHeaderComponent } from './InternalProfileHeader';
import { ProfileHeaderComponent } from './ProfileHeaderComponent';
import { ACTION_BLACK, BORDER_GRAY, NOTIFICATION_RED } from '@/styles/colors';

interface PendingProfessionalClaimItemProps {
  shiftId: number;
  claimRequest: ClaimRequest;
  navigateToReviews: (claimRequest: ClaimRequest) => void;
  navigateToCV: (claimRequest: ClaimRequest) => void;
  navigateToLivoCV: (claimRequest: ClaimRequest) => void;
  onHandleClaim: () => void;
  setLoading: (loading: boolean) => void;
  goBack?: () => void;
}

export const PendingProfessionalClaimItem: React.FC<
  PendingProfessionalClaimItemProps
> = ({
  shiftId,
  claimRequest,
  navigateToCV,
  navigateToReviews,
  navigateToLivoCV,
  onHandleClaim,
  setLoading,
  goBack,
}) => {
  const { t } = useTranslation();

  const [showRejectProfessionalModal, setShowRejectProfessionalModal] =
    useState(false);
  const { livoPoolOnboarded, livoInternalOnboarded } = useSelector(
    (state: RootState) => state.profileData.facilityProfile
  );
  const poolAndInternalOnboarded = livoPoolOnboarded && livoInternalOnboarded;

  const { hideModal, configureBottomModal } = useModal();

  const reasonsPresent =
    claimRequest.slotReasonOptions && claimRequest.slotReasonOptions.length > 0;
  const initialReason = { displayText: '', value: '' };

  const dispatch = useDispatch<AppDispatch>();
  const handleAcceptClaim = async (
    reason?: SlotReasonOption,
    reasonDetail?: string
  ) => {
    setLoading(true);
    const slotReason = reason ? reason.value : '';
    const slotReasonComment = reasonsPresent ? reasonDetail : '';
    await shiftClaimAccept(
      shiftId,
      claimRequest.id,
      slotReason,
      slotReasonComment
    )
      .then(() => {
        setLoading(false);
        Alert.alert(
          t('shift_list_claim_accepted_title'),
          t('shift_list_claim_accepted_message'),
          [
            {
              text: t('shift_list_accept_button'),
              onPress: () => onHandleClaim(),
            },
          ]
        );
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage =
          error instanceof ApiApplicationError
            ? error.message
            : t('shift_list_error_server_message');
        Alert.alert('Error', errorMessage);
      });
    dispatch(fetchShiftInfoDataAction(shiftId));
  };
  const handleRejectClaim = async (reason: string, reasonDetail: string) => {
    setLoading(true);
    await shiftClaimReject(shiftId, claimRequest.id, reason, reasonDetail)
      .then(() => {
        setLoading(false);
        Alert.alert(
          t('shift_list_claim_rejected_title'),
          t('shift_list_claim_rejected_message'),
          [
            {
              text: t('shift_list_accept_button'),
              onPress: () => onHandleClaim(),
            },
          ]
        );
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage =
          error instanceof ApiApplicationError
            ? error.message
            : t('shift_list_error_server_message');
        Alert.alert('Error', errorMessage);
      });
    dispatch(fetchShiftInfoDataAction(shiftId));
  };

  function openSelectReasonModal() {
    if (claimRequest.slotReasonOptions) {
      const modalContent = (
        <SelectAttributeModal<SlotReasonOption>
          label={t('shift_list_reason_label')}
          initialOption={initialReason}
          allOptions={claimRequest.slotReasonOptions}
          description={''}
          optionPlaceholder={t('shift_list_select_reason_placeholder')}
          descriptionPlaceholder={t('shift_list_add_comment_placeholder')}
          buttonText={t('shift_list_accept_button')}
          showDescription={claimRequest.slotReasonCommentDisplayed}
          optionToString={(reason) => (reason as SlotReason).displayText}
          updateValues={() => {}}
          onDismiss={hideModal}
          onButtonPress={handleAcceptClaim}
        />
      );
      configureBottomModal(
        modalContent,
        'relationship-modal',
        false,
        false,
        'pageSheet'
      );
    }
  }

  return (
    <>
      <View
        style={[commonStyles.spaceBetweenContainer, styles.headerContainer]}
      >
        {goBack ? (
          <TouchableOpacity onPress={goBack}>
            <LivoIcon name="chevron-left" size={24} color="#2C3038" />
          </TouchableOpacity>
        ) : (
          <StyledText style={styles.headerTitle}>
            {t('shift_detail_pending_claims_label')}
          </StyledText>
        )}
        {!claimRequest.invitation && (
          <StyledText
            style={styles.rejectText}
            onPress={() => setShowRejectProfessionalModal(true)}
          >
            {t('shift_detail_reject_pending_claim')}
          </StyledText>
        )}
      </View>

      <View
        style={[
          styles.claimContainerBase,
          poolAndInternalOnboarded
            ? styles.onboardedClaimContainerBorder
            : styles.defaultClaimContainerBorder,
          poolAndInternalOnboarded &&
            claimRequest.modality && {
              borderColor: modalityTags[claimRequest.modality].color,
            },
        ]}
      >
        {claimRequest.modality === ShiftModalityEnum.INTERNAL ? (
          <View>
            <InternalProfileHeaderComponent claimRequest={claimRequest} />
            <InternalPendingClaimBody claimRequest={claimRequest} />
          </View>
        ) : (
          <View>
            <ProfileHeaderComponent
              claimRequest={claimRequest}
              navigateToReviews={navigateToReviews}
            />
            <ProfileExperienceComponent
              claimRequest={claimRequest}
              navigateToCV={navigateToCV}
              navigateToLivoCV={navigateToLivoCV}
              style={styles.profileExperienceComponent}
            />
          </View>
        )}
      </View>
      {!claimRequest.invitation && (
        <ActionButton
          title={t('shift_list_accept_claim_button')}
          onPress={
            reasonsPresent ? openSelectReasonModal : () => handleAcceptClaim()
          }
        />
      )}
      <RejectProfessionalModal
        isVisible={showRejectProfessionalModal}
        dismissModal={() => setShowRejectProfessionalModal(false)}
        rejectShift={handleRejectClaim}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: SPACE_VALUES.medium,
  },
  headerTitle: {
    ...typographyStyles.heading.small,
    color: ACTION_BLACK,
  },
  rejectText: {
    ...typographyStyles.action.regular,
    color: NOTIFICATION_RED,
  },
  claimContainerBase: {
    padding: SPACE_VALUES.medium,
    borderRadius: 12,
    borderStyle: 'solid',
    marginBottom: SPACE_VALUES.huge,
  },
  defaultClaimContainerBorder: {
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  onboardedClaimContainerBorder: {
    borderWidth: 2,
    borderColor: BORDER_GRAY,
  },
  profileExperienceComponent: {
    marginTop: SPACE_VALUES.xLarge,
  },
});
