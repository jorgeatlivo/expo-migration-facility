import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import moment from 'moment';

import { Typography } from '@/components/atoms/Typography';
import CancelButton from '@/components/buttons/CancelButton';
import { CancellationFormData } from '@/components/modals/ShiftCancellationModal/configs/form';

import { PRIMARY_BLUE } from '@/styles/colors';

import { getCurrentLocale } from '@/locale/i18n';
import CheckboxView from './CheckboxView';

const screenHeight = Dimensions.get('window').height;

interface RecurrentShift {
  shiftId: number;
  startTime: string;
}

interface RecurrentShiftSelectorProps {
  recurrentShifts: Array<RecurrentShift>;
  control: Control<CancellationFormData>;
  onBack: () => void;
  onProceed: () => void;
}

export function formatDate(date: string, shorten?: boolean) {
  let parsedDate = moment(date).toDate();

  const options: Intl.DateTimeFormatOptions = {
    weekday: shorten ? 'short' : 'long',
    day: 'numeric',
    month: shorten ? 'short' : 'long',
  };
  const currentLocale = getCurrentLocale();
  let formattedDate = parsedDate.toLocaleDateString(currentLocale, options);
  formattedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return formattedDate;
}

function RecurrentShiftSelector({
  recurrentShifts,
  control,
  onBack,
  onProceed,
}: RecurrentShiftSelectorProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Typography variant="heading/medium">
        {t('recurrent_shift_selector_header')}
      </Typography>
      {/* Current shift section */}
      <CheckboxView
        label={t('recurrent_shift_selector_current_shift')}
        checked={true}
        disabled={true}
        onChange={() => {}}
      />

      {/* Related shifts section */}
      {recurrentShifts.length > 0 && (
        <View style={styles.relatedShiftsSection}>
          <Typography variant="subtitle/small">
            {t('recurrent_shift_selector_related_shifts')}
          </Typography>

          <Controller
            control={control}
            name="recurrentShifts"
            render={({ field }) => (
              <ScrollView style={styles.scrollView}>
                {recurrentShifts.map((shift) => {
                  const shiftId = String(shift.shiftId);
                  const isChecked = field.value?.includes(shiftId) ?? false;

                  const handleToggle = () => {
                    const currentValue = field.value ?? [];
                    if (isChecked) {
                      field.onChange(
                        currentValue.filter((id: string) => id !== shiftId)
                      );
                    } else {
                      field.onChange([...currentValue, shiftId]);
                    }
                  };

                  return (
                    <CheckboxView
                      key={shift.shiftId}
                      label={formatDate(shift.startTime)}
                      checked={isChecked}
                      onChange={handleToggle}
                    />
                  );
                })}
              </ScrollView>
            )}
          />
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <CancelButton
          title={t('recurrent_shift_selector_cancel_button')}
          onPress={onProceed}
          style={styles.button}
        />
        <Pressable onPress={onBack} style={styles.secondaryButton}>
          <Typography color={PRIMARY_BLUE} variant="action/regular">
            {t('recurrent_shift_selector_back_button')}
          </Typography>
        </Pressable>
      </View>
    </View>
  );
}

export default RecurrentShiftSelector;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 12,
  },
  relatedShiftsSection: {
    marginTop: 16,
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
  button: {},
});
