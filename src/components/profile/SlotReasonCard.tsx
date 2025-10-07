import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import LivoIcon from '@/assets/icons/LivoIcon';
import {useModal} from '@/hooks/ModalContext';
import {ApiApplicationError} from '@/services/api';
import {
  shiftClaimUpdateReason,
  SlotReason,
  SlotReasonOption,
} from '@/services/shifts';
import {fetchShiftInfoDataAction} from '@/store/actions/shiftActions';
import {AppDispatch} from '@/store/configureStore';
import {ACTION_BLUE, BADGE_GRAY, WHITE} from '@/styles/colors';
import {typographyStyles} from '@/styles/livoFonts';
import {SPACE_VALUES} from '@/styles/spacing';
import SelectAttributeModal from '@/components/common/SelectOptionWithDescriptionModal';
import StyledText from '@/components/StyledText';

interface SlotReasonCardProps {
  slotReason: SlotReason;
  slotReasonOptions?: SlotReasonOption[];
  slotReasonCommentDisplayed: boolean;
  facilityShiftId: number;
  claimRequestId: number;
  style?: StyleProp<ViewStyle>;
}

export default function SlotReasonCard({
  slotReason,
  slotReasonOptions,
  slotReasonCommentDisplayed,
  facilityShiftId,
  claimRequestId,
  style,
}: SlotReasonCardProps) {
  const {hideModal, configureBottomModal} = useModal();
  const {t} = useTranslation();

  const [reason, setReason] = useState({
    displayText: slotReason.displayText,
    value: slotReason.value,
  });
  const [reasonComment, setReasonComment] = useState(slotReason.comment);

  function updateReason(option: SlotReasonOption, comment: string) {
    setReason(option);
    setReasonComment(comment);
  }

  const dispatch = useDispatch<AppDispatch>();
  const handleUpdateClaimReason = async (
    reason: SlotReasonOption,
    comment: string,
  ) => {
    await shiftClaimUpdateReason(
      facilityShiftId,
      claimRequestId,
      reason.value,
      comment,
    )
      .then(() => {
        Alert.alert(
          t('shift_list_claim_reason_updated_title'),
          t('shift_list_claim_reason_updated_message'),
          [{text: t('shift_list_accept_claim_button')}],
        );
      })
      .catch(error => {
        const errorMessage =
          error instanceof ApiApplicationError
            ? error.message
            : t('shift_list_error_server_message');
        Alert.alert('Error', errorMessage);
      });
    dispatch(fetchShiftInfoDataAction(facilityShiftId));
  };

  function openSelectReasonModal() {
    if (slotReasonOptions) {
      const modalContent = (
        <SelectAttributeModal<SlotReasonOption>
          label={t('shift_list_reason_label')}
          initialOption={reason}
          allOptions={slotReasonOptions}
          description={reasonComment}
          optionPlaceholder={t('shift_list_select_reason_placeholder')}
          descriptionPlaceholder={t('shift_list_add_comment_placeholder')}
          buttonText={t('shift_list_accept_button')}
          showDescription={slotReasonCommentDisplayed}
          updateValues={updateReason}
          optionToString={reason => (reason as SlotReason).displayText}
          onDismiss={hideModal}
          onButtonPress={handleUpdateClaimReason}
        />
      );
      configureBottomModal(
        modalContent,
        'relationship-modal',
        false,
        false,
        'pageSheet',
      );
    }
  }

  return (
    <View style={[styles.cardStyle, style]}>
      <View style={styles.row}>
        <StyledText
          style={
            reason.displayText
              ? styles.textBox
              : {
                  ...styles.textBox,
                  color: BADGE_GRAY,
                }
          }>
          {reason.displayText
            ? reason.displayText
            : t('shift_list_no_reason_placeholder')}
        </StyledText>
        <TouchableOpacity onPress={openSelectReasonModal}>
          <LivoIcon name="pencil" size={24} color={ACTION_BLUE} />
        </TouchableOpacity>
      </View>
      {slotReasonCommentDisplayed && reasonComment && (
        <TouchableOpacity onPress={openSelectReasonModal}>
          <StyledText
            style={{
              ...styles.textBox,
              marginTop: SPACE_VALUES.small,
              maxHeight: 80,
            }}>
            {reasonComment}
          </StyledText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardStyle: {
    padding: SPACE_VALUES.large,
    borderRadius: SPACE_VALUES.small,
    backgroundColor: WHITE,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textBox: {
    ...typographyStyles.body.regular,
  },
});
