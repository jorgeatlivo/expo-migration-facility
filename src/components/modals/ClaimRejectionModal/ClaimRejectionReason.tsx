import { FC } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Control, Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

import { Typography } from '@/components/atoms/Typography';
import CancelButton from '@/components/buttons/CancelButton';
import LabeledCheckbox from '@/components/common/LabeledCheckbox';

import { BLUE_FADED, PRIMARY_BLUE, RED } from '@/styles/colors';

import { ClaimRejectionFormData } from './configs/form';
import { type RejectionReason } from './hooks/useFetchClaimRejectionReasons';

interface ClaimRejectionReasonProps {
  control: Control<ClaimRejectionFormData>;
  reasons: RejectionReason[];
  onBack?: () => void;
  onSubmit: (data: ClaimRejectionFormData) => Promise<void>;
}

const ClaimRejectionReason: FC<ClaimRejectionReasonProps> = ({
  reasons,
  onBack,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const form = useFormContext<ClaimRejectionFormData>();

  const onSubmitReason = async (data: ClaimRejectionFormData) => {
    await onSubmit(data);
  };

  const handleSubmit = () => {
    form.handleSubmit(onSubmitReason)();
  };

  const selectedReason = form.watch('rejectionReason');
  const rejectionReasonError = form.formState.errors.rejectionReason;
  const reasonDetailError = form.formState.errors.reasonDetail;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Typography variant="heading/medium">
        {t('claim_rejection_reason_header')}
      </Typography>

      {/* Reason selection */}
      <ScrollView
        style={styles.reasonsContainer}
        showsVerticalScrollIndicator={false}
      >
        {reasons.map((reason) => {
          const isSelected = selectedReason === reason.name;

          return (
            <LabeledCheckbox
              key={reason.name}
              option={reason.displayText}
              checked={isSelected}
              onPress={() => {
                form.setValue('rejectionReason', reason.name);
                // Clear reasonDetail when selecting a different reason
                if (reason.name !== 'OTHER') {
                  form.setValue('reasonDetail', '');
                }
              }}
              rowStyle={styles.reasonItem}
            />
          );
        })}

        {/* Error message for rejection reason */}
        {rejectionReasonError && (
          <View style={styles.errorContainer}>
            <Typography variant="body/regular" color={RED}>
              {rejectionReasonError.message}
            </Typography>
          </View>
        )}

        {/* Other reason details input */}
        {selectedReason === 'OTHER' && (
          <View style={styles.textInputContainer}>
            <Controller
              name="reasonDetail"
              control={form.control}
              render={({ field: { onChange, onBlur, value } }) => (
                <BottomSheetTextInput
                  style={styles.textInput}
                  placeholder={t(
                    'claim_rejection_reason_details_placeholder' as any
                  )}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {/* Error message for reason detail */}
            {reasonDetailError && (
              <View style={styles.errorContainer}>
                <Typography variant="body/regular" color={RED}>
                  {reasonDetailError.message}
                </Typography>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <CancelButton
          title={t('claim_rejection_reason_reject_button')}
          onPress={handleSubmit}
        />
        {onBack && (
          <Pressable onPress={onBack} style={styles.secondaryButton}>
            <Typography color={PRIMARY_BLUE} variant="action/regular">
              {t('claim_rejection_reason_back_button')}
            </Typography>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 12,
  },
  reasonsContainer: {
    marginBottom: 20,
  },
  reasonItem: {
    marginVertical: 4,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
  },
  buttonsContainer: {
    gap: 8,
    width: '100%',
  },
  secondaryButton: {
    alignSelf: 'center',
    paddingVertical: 12,
  },
  textInputContainer: {
    marginTop: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: BLUE_FADED,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
});

export default ClaimRejectionReason;
