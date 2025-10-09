import * as React from 'react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';

import { ApiApplicationError } from '@/services/api';
import { Logger } from '@/services/logger.service';

import { Typography } from '@/components/atoms/Typography';

import { interact, wait } from '@/utils/frame';
import { markdown } from '@/utils/markdown';

import LivoIcon from '@/assets/icons/LivoIcon';
import CancellationReason from './CancellationReason';
import {
  CancellationFormData,
  createCancellationFormSchema,
} from './configs/form';
import DialogBox from './DialogBox';
import { useCancelShift } from './hooks/useCancellationMutation';
import { useFetchShiftCancellationMetaData } from './hooks/useFetchShiftCancellationMetaData';
import RecurrentShiftSelector from './RecurrentShiftSelector';

export interface ShiftCancellationModalRef {
  open: () => void;
  close: () => void;
}

interface ShiftCancellationModalProps {
  shiftId?: number;
  onClose?: () => void;
  onCompleteFlow?: () => void; // Callback when the cancellation flow is completed
}

const ShiftCancellationModal = forwardRef<
  ShiftCancellationModalRef,
  ShiftCancellationModalProps
>(({ shiftId, onClose, onCompleteFlow }, ref) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { shiftCancellationMetadata, isLoading, error } =
    useFetchShiftCancellationMetaData(shiftId, isModalOpen);
  const { cancelShiftAsync, error: cancelError, reset } = useCancelShift();

  const [currentStep, setCurrentStep] = useState<'recurrent' | 'reason'>(
    'reason'
  );

  const form = useForm<CancellationFormData>({
    resolver: zodResolver(createCancellationFormSchema(t)),
    mode: 'onSubmit',
    defaultValues: {
      recurrentShifts: [],
      cancelReason: '',
      reasonDetails: '',
    },
  });

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
    bottomSheetRef.current?.dismiss();
    onClose?.();
  };

  const renderHeader = () => <BottomSheetHeader onClose={handleClose} />;

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        setIsModalOpen(true);
        bottomSheetRef.current?.present();
      },
      close: () => {
        setIsModalOpen(false);
        bottomSheetRef.current?.dismiss();
      },
    }),
    []
  );

  useEffect(() => {
    if (!shiftCancellationMetadata) return;

    const hasRecurrentShifts =
      (shiftCancellationMetadata.recurrentShifts?.length ?? 0) > 0;

    if (hasRecurrentShifts) {
      setCurrentStep('recurrent');
    }
  }, [shiftCancellationMetadata]);

  const { control } = form;

  const handleBackToRecurrentSelection = () => {
    setCurrentStep('recurrent');
  };

  const handleProceedToReason = () => {
    setCurrentStep('reason');
  };

  const handleSubmit = async (data: CancellationFormData) => {
    if (!shiftId) {
      return;
    }

    try {
      await cancelShiftAsync({
        shiftId,
        data: {
          reason: data.cancelReason,
          reasonDetails: data.reasonDetails,
          recurrentShiftIds: data.recurrentShifts.map((id) => parseInt(id, 10)),
        },
      });
      handleClose();
      await wait(300);
      await interact();
      onCompleteFlow?.();
    } catch (err) {
      Logger.debug(
        'ShiftCancellationModal',
        'handleSubmit',
        'Error cancelling shift',
        err
      );
    }
  };

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      onPress={handleClose}
    />
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (
      cancelError instanceof ApiApplicationError &&
      cancelError.errorCode === '400062'
    ) {
      return (
        <DialogBox
          title={t('shift_cancellation_modal_team_contact_title')}
          message={
            <Typography variant="body/regular">
              {markdown(cancelError.message)}
            </Typography>
          }
          primaryButtonTitle={t('shift_cancellation_modal_understood')}
          onPrimaryPress={() => {
            handleClose();
            onCompleteFlow?.();
          }}
        />
      );
    }

    if (error instanceof ApiApplicationError && error.errorCode === '50030') {
      return (
        <DialogBox
          title={t('shift_cancellation_modal_send_request_title')}
          message={
            <Typography variant="body/regular">
              {markdown(error.message)}
            </Typography>
          }
          primaryButtonTitle={t('shift_cancellation_modal_yes_send')}
          secondaryButtonTitle={t('shift_cancellation_modal_back')}
          onPrimaryPress={() => {
            cancelShiftAsync({
              shiftId: shiftId!,
              data: {
                reason: 'OTHER',
                reasonDetails: t(
                  'shift_cancellation_modal_accepted_claims_reason'
                ),
                recurrentShiftIds: [],
              },
            });
          }}
          onSecondaryPress={handleClose}
        />
      );
    }

    return (
      <View style={styles.contentContainer}>
        {/* Show recurrent shift selector if there are recurrent shifts and we're on the first step */}
        {currentStep === 'recurrent' && (
          <RecurrentShiftSelector
            recurrentShifts={shiftCancellationMetadata?.recurrentShifts ?? []}
            control={control}
            onBack={handleClose}
            onProceed={handleProceedToReason}
          />
        )}

        {/* Show reason step when we're on the reason step */}
        {currentStep === 'reason' && (
          <CancellationReason
            control={control}
            onSubmit={handleSubmit}
            reasons={shiftCancellationMetadata?.reasons ?? []}
            onBack={
              shiftCancellationMetadata?.recurrentShifts?.length
                ? handleBackToRecurrentSelection
                : handleClose
            }
          />
        )}
      </View>
    );
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetRef}
        enableDynamicSizing // Automatically adjusts height based on content
        enablePanDownToClose
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        onDismiss={() => {
          setIsModalOpen(false);
          onClose?.();
        }}
        backdropComponent={renderBackdrop}
        handleComponent={renderHeader}
      >
        <BottomSheetView style={{ paddingBottom: bottom }}>
          <FormProvider {...form}>{renderContent()}</FormProvider>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});

ShiftCancellationModal.displayName = 'ShiftCancellationModal';

interface BottomSheetHeaderProps {
  onClose: () => void;
}

const BottomSheetHeader: React.FC<BottomSheetHeaderProps> = ({ onClose }) => (
  <View style={styles.handleContainer}>
    <Pressable onPress={onClose} style={styles.closeButton}>
      <LivoIcon name={'close'} size={24} color="#6B7280" />
    </Pressable>
  </View>
);

export default ShiftCancellationModal;

const styles = StyleSheet.create({
  handleContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 44,
  },
  closeButton: {
    position: 'absolute',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    top: 12,
    right: 12,
  },
  contentContainer: {
    backgroundColor: 'white',
    minHeight: 200,
  },
  loadingContainer: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#EF4444',
  },
  retryText: {
    color: '#374151',
  },
});
