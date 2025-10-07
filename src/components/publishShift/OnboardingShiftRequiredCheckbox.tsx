import { StyleSheet, View } from 'react-native';
import React from 'react';
import CustomCheckBox from '@/components/common/CustomCheckBox';
import { IconSquare, IconSquareCheckFilled } from 'tabler-icons-react-native';
import { useTranslation } from 'react-i18next';
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
      <CustomCheckBox
        option={t('onboarding_shift_required')}
        checked={onboardingShiftsRequired}
        checkedIcon={
          <IconSquareCheckFilled
            size={24}
            color={'#0277C8'}
            stroke={0.3}
            style={{ marginRight: -SPACE_VALUES.small }}
          />
        }
        uncheckedIcon={
          <IconSquare
            size={24}
            color="#B0BEC5"
            style={{ marginRight: -SPACE_VALUES.small }}
          />
        }
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
