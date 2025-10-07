import { ApiApplicationError } from '@/services/api';
import {
  useConfiguration,
  publishShift,
  OnboardingShiftsConfig,
} from '@/services/shifts';
import {
  setDaySelectedAction,
  toggleNewShiftAvailableAction,
} from '@/store/actions/shiftActions';
import { WHITE } from '@/styles/colors';
import { Category, RootState } from '@/types';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { buildShiftDateTime } from '@/utils/utils';
import {
  PublishShiftComponent,
  PublishShiftConfig,
} from './PublishShiftComponent';
import { ProtectedStackRoutes } from '@/router/ProtectedStack';

interface PublishShiftComponentProps {
  goBack: (selectedDay?: string) => void;
  timeInDay: string;
  defaultDate: string;
}

export const PublishShiftScreenComponent: React.FC<
  PublishShiftComponentProps
> = ({ goBack, timeInDay, defaultDate }) => {
  const { t } = useTranslation();

  const { facilityProfile } = useSelector(
    (state: RootState) => state.profileData
  );
  const { livoPoolOnboarded, livoInternalOnboarded } = facilityProfile;
  const [category, setCategory] = useState(() => {
    if (facilityProfile.facility.categories.length > 0) {
      return facilityProfile.facility.categories[0];
    }
    return undefined;
  });

  const { error, isLoading, configuration } = useConfiguration(category?.code);
  const { onboardingShifts } = configuration || {};
  const shiftTimeConfig = configuration?.shiftTimeConfig;
  const defaultSchedule = shiftTimeConfig
    ? shiftTimeConfig[timeInDay as keyof typeof shiftTimeConfig]
    : {
        startTime: { hour: 7, minute: 30 },
        endTime: { hour: 14, minute: 30 },
      };
  const defaultStart = moment({
    hour: defaultSchedule.startTime.hour,
    minute: defaultSchedule.startTime.minute,
  });
  const defaultEnd = moment({
    hour: defaultSchedule.endTime.hour,
    minute: defaultSchedule.endTime.minute,
  });
  const [publishShiftComponentKey, setPublishShiftComponentKey] = useState(1);

  const isExternalVisible = category ? category.visibleForLivoPool : true;
  const isInternalVisible = category ? category.visibleForLivoInternal : true;

  const dispatch = useDispatch();

  const onShiftPublishAction = async (
    newShiftConfiguration: PublishShiftConfig
  ) => {
    const startTime = buildShiftDateTime(
      newShiftConfiguration.shiftDate,
      newShiftConfiguration.shiftStartTime
    );
    const endTime = buildShiftDateTime(
      newShiftConfiguration.shiftDate,
      newShiftConfiguration.shiftEndTime
    );

    if (endTime.isBefore(startTime)) {
      endTime.add(1, 'day');
    }

    await publishShift({
      startTime: startTime.toDate(),
      endTime: endTime.toDate(),
      professionalField: newShiftConfiguration.professionalField,
      totalPay: +newShiftConfiguration.totalPay,
      capacity: Number.parseInt(newShiftConfiguration.capacity, 10),
      details: newShiftConfiguration.details,
      externalVisible: newShiftConfiguration.isExternalVisible,
      internalVisible: newShiftConfiguration.isInternalVisible,
      unit: newShiftConfiguration.unit,
      category: category?.code,
      onboardingShiftsRequired: newShiftConfiguration.onboardingShiftsRequired,
      invitedProfessionalIds: newShiftConfiguration.invitedProfessionals?.map(
        (pro) => pro.id
      ),
      compensationOptions: newShiftConfiguration.selectedCompensationOptions,
      temporalId: newShiftConfiguration.temporalId,
    })
      .then(() => {
        Alert.alert(
          t('shift_list_shift_created_title'),
          t('shift_list_shift_created_message')
        );
        dispatch(
          setDaySelectedAction(moment(startTime.toDate()).format('YYYY-MM-DD'))
        );
        dispatch(toggleNewShiftAvailableAction(true));
        goBack();
      })
      .catch((err: Error) => {
        const errorMessage =
          err instanceof ApiApplicationError
            ? err.message
            : t('shift_list_error_server_message');
        Alert.alert(t('creating_shift_error_title'), errorMessage);
      });
  };

  const onChangeCategory = (category: Category) => {
    setCategory(category);
    setPublishShiftComponentKey((value) => value + 1);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingScreen />
      </View>
    );
  }

  if (error) {
    Alert.alert(t('loading_shift_configuration_error_title'), error);
    goBack();
  }

  return configuration ? (
    <PublishShiftComponent
      key={`PublishShiftComponent-${publishShiftComponentKey}`}
      initialValues={{
        details: '',
        capacity: '1',
        totalPay: '',
        professionalField: '',
        shiftDate: new Date(defaultDate),
        shiftStartTime: defaultStart.toDate(),
        shiftEndTime: defaultEnd.toDate(),
        unit: '',
        isExternalVisible: isExternalVisible,
        isInternalVisible: livoInternalOnboarded ? isInternalVisible : false,
        onboardingShiftsRequired: getOnboardingShiftsConfig(
          isExternalVisible,
          onboardingShifts
        ),
        unitConfigurable: configuration.unitConfigurable,
      }}
      livoPoolOnboarded={livoPoolOnboarded}
      livoInternalOnboarded={livoInternalOnboarded}
      shiftTimeConfig={configuration.shiftTimeConfig}
      timeInDay={timeInDay}
      professionalFields={configuration.professionalFields}
      onboardingShiftsEnabled={onboardingShifts?.featureEnabled}
      units={configuration.units}
      category={category}
      onSetCategory={onChangeCategory}
      onPublish={onShiftPublishAction}
      onboardingShifts={configuration.onboardingShifts}
      compensationOptions={configuration.compensationOptions}
      source={ProtectedStackRoutes.PublishShift}
    />
  ) : null;
};

function getOnboardingShiftsConfig(
  isExternalVisible: boolean,
  onboardingShifts?: OnboardingShiftsConfig
) {
  if (!isExternalVisible || !onboardingShifts?.featureEnabled) return false;

  return onboardingShifts?.defaultValue ?? false;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
});
