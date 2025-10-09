import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';

import moment from 'moment';

import { ApiApplicationError } from '@/services/api';
import {
  ShiftUpdateRequest,
  updateShiftRequest,
  useConfiguration,
} from '@/services/shifts';
import {
  fetchShiftInfoDataAction,
  setDaySelectedAction,
  toggleNewShiftAvailableAction,
} from '@/store/actions/shiftActions';
import { AppDispatch } from '@/store/configureStore';

import { LoadingScreen } from '@/components/common/LoadingScreen';
import { CancelShiftModalContent } from '@/components/modals/CancelShiftModalContent';
import { ShiftCancellationModal } from '@/components/modals/ShiftCancellationModal';
import { ShiftCancellationModalRef } from '@/components/modals/ShiftCancellationModal/ShiftCancellationModal';
import PublishShiftComponent, {
  PublishShiftConfig,
} from '@/components/publishShift/PublishShiftComponent';

import { useModal } from '@/hooks/ModalContext';
import { CANCEL_SHIFT_MODAL } from '@/hooks/modalTypes';
import { WHITE } from '@/styles/colors';
import { getStartAndEndTimeFromDate } from '@/utils/utils';

import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack.types';
import { RootState, ShiftTimeInDayEnum } from '@/types';

type EditShiftScreenProps = StackScreenProps<
  ProtectedStackParamsList,
  ProtectedStackRoutes.EditShift
>;
export const EditShiftScreen: React.FC<EditShiftScreenProps> = ({
  route,
  navigation,
}) => {
  const { t } = useTranslation();

  const shiftInfo = route.params.shiftInfo;
  const shiftId = shiftInfo.id;
  const { livoPoolOnboarded, livoInternalOnboarded } = useSelector(
    (state: RootState) => state.profileData.facilityProfile
  );

  const { isLoading, configuration } = useConfiguration(
    shiftInfo.category.code
  );
  const shiftCancellationRef = React.useRef<ShiftCancellationModalRef>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { configureBottomModal, hideModal } = useModal();

  const [shiftConfiguration, setShiftConfiguration] =
    useState<PublishShiftConfig | null>(null);

  useEffect(() => {
    if (configuration) {
      setShiftConfiguration({
        details: shiftInfo.details || '',
        professionalField: shiftInfo.professionalField?.value,
        capacity: shiftInfo.capacity.toString(),
        totalPay: shiftInfo.totalPay,
        shiftDate: new Date(shiftInfo.startTime),
        shiftStartTime: new Date(shiftInfo.startTime),
        shiftEndTime: new Date(shiftInfo.finishTime),
        unit: shiftInfo.unit ?? '',
        unitConfigurable: configuration.unitConfigurable,
        isInternalVisible: shiftInfo.internalVisible,
        isExternalVisible: shiftInfo.externalVisible,
        minimumCapacity: shiftInfo.totalAcceptedClaims,
        invitedProfessionals: shiftInfo.invitedProfessionals,
        selectedCompensationOptions: shiftInfo.selectedCompensationOptions,
        onboardingShiftsRequired: shiftInfo.onboardingShiftsRequired,
        shiftId,
      });
    }
  }, [configuration, shiftId, shiftInfo]);

  const updateShift = async (
    id: number,
    shiftUpdateRequest: ShiftUpdateRequest,
    newStartTime: moment.Moment
  ) => {
    await updateShiftRequest(id, shiftUpdateRequest)
      .then(() => {
        Alert.alert(t('shift_detail_shift_update_title'));
        dispatch(toggleNewShiftAvailableAction(true));
        dispatch(setDaySelectedAction(newStartTime.format('YYYY-MM-DD')));
        dispatch(fetchShiftInfoDataAction(id));
        navigation.goBack();
      })
      .catch((error) => {
        const errorMessage =
          error instanceof ApiApplicationError
            ? error.message
            : t('shift_list_error_server_message');
        Alert.alert(t('shift_detail_shift_update_error'), errorMessage);
      });
  };

  const onShiftUpdate = async (newShiftConfiguration: PublishShiftConfig) => {
    const { startTime, endTime } = getStartAndEndTimeFromDate(
      newShiftConfiguration.shiftDate,
      newShiftConfiguration.shiftStartTime,
      newShiftConfiguration.shiftEndTime
    );

    let shiftUpdateRequest: ShiftUpdateRequest = {
      startTime: startTime.toDate(),
      endTime: endTime.toDate(),
      totalPay: +newShiftConfiguration.totalPay,
      details: newShiftConfiguration.details,
      capacity: +newShiftConfiguration.capacity,
      internalVisible: newShiftConfiguration.isInternalVisible,
      externalVisible: newShiftConfiguration.isExternalVisible,
      unit: newShiftConfiguration.unit,
      professionalField: newShiftConfiguration.professionalField,
      invitedProfessionalIds: newShiftConfiguration.invitedProfessionals?.map(
        (pro) => pro.id
      ),
      compensationOptions: newShiftConfiguration.selectedCompensationOptions,
      onboardingShiftsRequired: newShiftConfiguration.onboardingShiftsRequired,
    };
    if (+newShiftConfiguration.capacity < shiftInfo.capacity) {
      const modalContent = (
        <CancelShiftModalContent
          title={t('edit_shift_decrease_capacity_modal_title')}
          buttonTitle={t('edit_shift_decrease_capacity_modal_button')}
          cancelShift={(removeReason: string, removeReasonDetails: string) => {
            hideModal();
            updateShift(
              shiftId,
              {
                ...shiftUpdateRequest,
                decreaseCapacityReason: removeReason,
                decreaseCapacityReasonDetails: removeReasonDetails,
              },
              startTime
            );
          }}
          goBack={() => hideModal()}
        />
      );
      configureBottomModal(modalContent, CANCEL_SHIFT_MODAL);
    } else {
      await updateShift(shiftId, shiftUpdateRequest, startTime);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: WHITE,
        }}
      >
        <LoadingScreen />
      </View>
    );
  }
  const mapShiftTimeEnumToConfig = (shiftTimeInDay: string) => {
    switch (shiftTimeInDay) {
      case ShiftTimeInDayEnum.DAY_SHIFT:
        return 'dayShift';
      case ShiftTimeInDayEnum.NIGHT_SHIFT:
        return 'nightShift';
      case ShiftTimeInDayEnum.EVENING_SHIFT:
        return 'eveningShift';
      default:
        return 'dayShift';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: WHITE }}>
      {shiftConfiguration !== null && configuration ? (
        <PublishShiftComponent
          initialValues={shiftConfiguration}
          livoPoolOnboarded={livoPoolOnboarded}
          livoInternalOnboarded={livoInternalOnboarded}
          timeInDay={
            mapShiftTimeEnumToConfig(shiftInfo.shiftTimeInDay) || 'dayShift'
          }
          shiftTimeConfig={configuration.shiftTimeConfig}
          onPublish={onShiftUpdate}
          isEditing
          undoTitle={t('edit_shift_delete_shift_button')}
          undoAction={() => {
            shiftCancellationRef.current?.open();
          }}
          units={configuration.units}
          professionalFields={configuration.professionalFields}
          category={shiftInfo.category}
          compensationOptions={configuration.compensationOptions}
          source={ProtectedStackRoutes.EditShift}
          onboardingShifts={configuration.onboardingShifts}
          onboardingShiftsEnabled={
            configuration.onboardingShifts?.featureEnabled
          }
        />
      ) : null}
      <ShiftCancellationModal
        ref={shiftCancellationRef}
        shiftId={shiftInfo?.id}
        onCompleteFlow={() => {
          navigation.popToTop();
        }}
      />
    </View>
  );
};
