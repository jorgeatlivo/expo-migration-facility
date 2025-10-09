import * as React from 'react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
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

import { markdown } from '@/utils/markdown';

import LivoIcon from '@/assets/icons/LivoIcon';
import ClaimRejectionReason from './ClaimRejectionReason';
import {
  ClaimRejectionFormData,
  createClaimRejectionFormSchema,
} from './configs/form';
import DialogBox from './DialogBox';
import { useFetchClaimRejectionReasons } from './hooks/useFetchClaimRejectionReasons';
import { ShiftActionSuggestion, useRejectClaim } from './hooks/useRejectClaim';
import {
  useCancelShiftAfterClaimRejection,
  useReduceShiftCapacityAfterClaimRejection,
} from './hooks/useShiftActionsAfterClaimRejection';

export interface ClaimRejectionModalRef {
  open: (claimId: number) => void;
  close: () => void;
}

interface ClaimRejectionModalProps {
  shiftId: number;
  onClose?: () => void;
  onCompleteFlow?: () => void; // Callback when the entire flow is completed
}

const ClaimRejectionModal = forwardRef<
  ClaimRejectionModalRef,
  ClaimRejectionModalProps
>(({ shiftId, onClose, onCompleteFlow }, ref) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [claimId, setClaimId] = useState<number | null>(null);
  const [actionSuggestion, setActionSuggestion] =
    useState<ShiftActionSuggestion | null>(null);

  const { rejectionReasons, isLoading, error } =
    useFetchClaimRejectionReasons(isModalOpen);

  const { cancelShiftAsync, reset: resetCancelShift } =
    useCancelShiftAfterClaimRejection({
      onSuccess: () => {
        setActionSuggestion(null);
        handleClose();
      },
    });

  const { reduceCapacityAsync, reset: resetReduceCapacity } =
    useReduceShiftCapacityAfterClaimRejection({
      onSuccess: () => {
        setActionSuggestion(null);
        handleClose();
      },
    });

  const {
    rejectClaimAsync,
    error: rejectClaimError,
    reset: resetRejectClaim,
  } = useRejectClaim({
    onSuccess: (response) => {
      if (response) {
        handleShiftActionSuggestion(response);
      } else {
        handleClose();
      }
    },
  });

  const handleShiftActionSuggestion = (
    response: { shiftActionSuggestion: ShiftActionSuggestion } | undefined
  ) => {
    if (response?.shiftActionSuggestion) {
      setActionSuggestion(response.shiftActionSuggestion);
    } else {
      handleClose();
      onCompleteFlow?.();
    }
  };

  const handleActionConfirm = async () => {
    if (!actionSuggestion) {
      return;
    }

    switch (actionSuggestion) {
      case 'SHIFT_CANCELLATION':
        await cancelShiftAsync(shiftId);
        break;
      case 'DECREASE_SHIFT_CAPACITY':
      case 'DECREASE_SHIFT_REMAINING_CAPACITIES':
        await reduceCapacityAsync(shiftId);
        break;
      default:
        setActionSuggestion(null);
        handleClose();
        break;
    }

    onCompleteFlow?.();
  };

  const handleActionCancel = () => {
    setActionSuggestion(null);
    handleClose();
  };

  const form = useForm<ClaimRejectionFormData>({
    resolver: zodResolver(createClaimRejectionFormSchema(t)),
    mode: 'onSubmit',
    defaultValues: {
      rejectionReason: '',
      reasonDetail: '',
    },
  });

  const { control } = form;

  const handleClose = () => {
    setIsModalOpen(false);
    setActionSuggestion(null);
    setClaimId(null);
    resetRejectClaim();
    resetReduceCapacity();
    resetCancelShift();
    form.reset();
    bottomSheetRef.current?.dismiss();
    onClose?.();
  };

  const renderHeader = () => <BottomSheetHeader onClose={handleClose} />;

  useImperativeHandle(
    ref,
    () => ({
      open: (newClaimId: number) => {
        setClaimId(newClaimId);
        setIsModalOpen(true);
        bottomSheetRef.current?.present();
      },
      close: () => {
        setIsModalOpen(false);
        setClaimId(null);
        bottomSheetRef.current?.dismiss();
      },
    }),
    []
  );

  const handleSubmit = async (data: ClaimRejectionFormData) => {
    if (!claimId) {
      Logger.debug(
        'ClaimRejectionModal',
        'handleSubmit',
        'No claimId provided'
      );
      return;
    }

    try {
      await rejectClaimAsync({
        shiftId,
        claimId,
        data: {
          reason: data.rejectionReason,
          reasonDetail: data.reasonDetail,
        },
      });
    } catch (err) {
      Logger.debug(
        'ClaimRejectionModal',
        'handleSubmit',
        'Error rejecting claim',
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

  const getActionDialogContent = (suggestion: ShiftActionSuggestion) => {
    switch (suggestion) {
      case 'SHIFT_CANCELLATION':
        return {
          title: t('claim_rejection_modal_cancel_shift_title'),
          message: t('claim_rejection_modal_cancel_shift_message'),
          confirmLabel: t('claim_rejection_modal_cancel_shift_confirm'),
          cancelLabel: t('claim_rejection_modal_keep_shift'),
        };

      case 'DECREASE_SHIFT_CAPACITY':
        return {
          title: t('claim_rejection_modal_cancel_position_title'),
          message: t('claim_rejection_modal_cancel_position_message'),
          confirmLabel: t('claim_rejection_modal_cancel_position_confirm'),
          cancelLabel: t('claim_rejection_modal_keep_shift'),
        };

      case 'DECREASE_SHIFT_REMAINING_CAPACITIES':
        return {
          title: t('claim_rejection_modal_cancel_position_title'),
          message: t('claim_rejection_modal_cancel_position_message'),
          confirmLabel: t('claim_rejection_modal_cancel_position_confirm'),
          cancelLabel: t('claim_rejection_modal_keep_shift'),
        };

      default:
        return {
          title: t('claim_rejection_modal_default_title'),
          message: t('claim_rejection_modal_default_message'),
          confirmLabel: t('claim_rejection_modal_default_confirm'),
        };
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (rejectClaimError instanceof ApiApplicationError) {
      return (
        <DialogBox
          type="alert"
          title={t('claim_rejection_modal_error_rejecting_title')}
          message={
            <Typography variant="body/regular">
              {markdown(rejectClaimError.message)}
            </Typography>
          }
          primaryButtonTitle={t('claim_rejection_modal_understood')}
          onPrimaryPress={handleClose}
        />
      );
    }

    if (error instanceof ApiApplicationError) {
      return (
        <DialogBox
          type="info"
          title={t('claim_rejection_modal_error_loading_title')}
          message={
            <Typography variant="body/regular">
              {markdown(error.message)}
            </Typography>
          }
          primaryButtonTitle={t('claim_rejection_modal_understood')}
          onPrimaryPress={handleClose}
        />
      );
    }

    // If we have an action suggestion, show the confirmation dialog
    if (actionSuggestion) {
      const dialogContent = getActionDialogContent(actionSuggestion);

      return (
        <DialogBox
          type="alert"
          title={dialogContent.title}
          message={dialogContent.message}
          primaryButtonTitle={dialogContent.confirmLabel}
          secondaryButtonTitle={
            dialogContent?.cancelLabel ||
            t('claim_rejection_reason_back_button')
          }
          onPrimaryPress={handleActionConfirm}
          onSecondaryPress={handleActionCancel}
        />
      );
    }

    return (
      <View style={styles.contentContainer}>
        <ClaimRejectionReason
          control={control}
          onSubmit={handleSubmit}
          reasons={rejectionReasons}
          onBack={handleClose}
        />
      </View>
    );
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetRef}
        enableDynamicSizing // Automatically adjusts height based on content
        enablePanDownToClose
        onDismiss={() => {
          setIsModalOpen(false);
          setClaimId(null);
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

ClaimRejectionModal.displayName = 'ClaimRejectionModal';

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

export default ClaimRejectionModal;

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
});
