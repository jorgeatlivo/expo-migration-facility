import React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Control, Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

import { Typography } from '@/components/atoms/Typography';
import CancelButton from '@/components/buttons/CancelButton';
import LabeledCheckbox from '@/components/common/LabeledCheckbox';
import { CancellationFormData } from '@/components/modals/ShiftCancellationModal/configs/form';

import { BLUE_FADED, PRIMARY_BLUE, RED } from '@/styles/colors';
import { SPACE_VALUES } from '@/styles/spacing';

const screenHeight = Dimensions.get('window').height;

interface CancellationReasonProps {
  control: Control<CancellationFormData>;
  reasons: Array<{
    name: string;
    displayText: string;
  }>;
  onBack?: () => void;
  onSubmit: (data: CancellationFormData) => Promise<void>;
}

function CancellationReason({
  control: _control,
  reasons,
  onBack,
  onSubmit,
}: CancellationReasonProps) {
  const { t } = useTranslation();
  const form = useFormContext<CancellationFormData>();

  const onSubmitReason = (data: CancellationFormData) => {
    onSubmit(data);
  };

  const handleSubmit = () => {
    form.handleSubmit(onSubmitReason)();
  };

  const selectedReason = form.watch('cancelReason');
  const cancelReasonError = form.formState.errors.cancelReason;
  const reasonDetailsError = form.formState.errors.reasonDetails;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Typography variant="heading/medium">
        {t('cancellation_reason_header')}
      </Typography>

      {/* Reason selection */}
      <ScrollView
        style={styles.reasonContainer}
        showsVerticalScrollIndicator={false}
      >
        {reasons.map((reason) => {
          const isSelected = selectedReason === reason.name;

          return (
            <LabeledCheckbox
              type={'radiobox'}
              key={reason.name}
              option={reason.displayText}
              checked={isSelected}
              onPress={() => {
                form.setValue('cancelReason', reason.name);
                // Clear reasonDetails when selecting a different reason
                if (reason.name !== 'OTHER') {
                  form.setValue('reasonDetails', '');
                }
              }}
              rowStyle={styles.reasonItem}
            />
          );
        })}

        {/* Error message for cancel reason */}
        {cancelReasonError && (
          <View style={styles.errorContainer}>
            <Typography variant="body/regular" color={RED}>
              {cancelReasonError.message}
            </Typography>
          </View>
        )}

        {/* Other reason details input */}
        {selectedReason === 'OTHER' && (
          <View style={styles.textInputContainer}>
            <Controller
              name="reasonDetails"
              control={form.control}
              render={({ field: { onChange, onBlur, value } }) => (
                <BottomSheetTextInput
                  style={styles.textInput}
                  placeholder={t(
                    'cancellation_reason_details_placeholder' as any
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
            {/* Error message for reason details */}
            {reasonDetailsError && (
              <View style={styles.errorContainer}>
                <Typography variant="body/regular" color={RED}>
                  {reasonDetailsError.message}
                </Typography>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <CancelButton
          title={t('cancellation_reason_cancel_button')}
          onPress={handleSubmit}
        />
        <Pressable onPress={onBack} style={styles.secondaryButton}>
          <Typography color={PRIMARY_BLUE} variant="action/regular">
            {t('cancellation_reason_back_button')}
          </Typography>
        </Pressable>
      </View>
    </View>
  );
}

export default CancellationReason;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 12,
  },
  reasonContainer: {
    marginBottom: 20,
  },
  reasonItem: {
    marginVertical: 4,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
  },
  scrollView: {
    maxHeight: screenHeight * 0.45,
  },
  buttonContainer: {
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
