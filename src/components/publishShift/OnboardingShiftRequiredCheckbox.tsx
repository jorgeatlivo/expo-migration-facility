import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import LabeledCheckbox from '@/components/common/LabeledCheckbox';

import { SPACE_VALUES } from '@/styles/spacing';

const OnboardingShiftRequiredCheckbox = ({
  onboardingShiftsRequired,
  setOnboardingShiftsRequired,
}: {
  onboardingShiftsRequired: boolean;
  setOnboardingShiftsRequired: (value: boolean) => void;
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <LabeledCheckbox
        option={t('onboarding_shift_required')}
        checked={onboardingShiftsRequired}
        onPress={() => {
          setOnboardingShiftsRequired(!onboardingShiftsRequired);
        }}
        textStyle={styles.textStyle}
        rowStyle={styles.rowStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACE_VALUES.large,
  },
  textStyle: {
    fontSize: 16,
  },
  rowStyle: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  checkedIcon: {
    color: '#0277C8',
  },
  uncheckedIcon: {
    color: '#B0BEC5',
  },
});

export default OnboardingShiftRequiredCheckbox;
