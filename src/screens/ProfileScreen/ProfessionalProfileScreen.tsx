import React, { useEffect } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';

import { ApiApplicationError } from '@/services/api';
import {
  shiftCancelApprovedClaim,
  shiftCancellationAccept,
  shiftCancellationResolve,
} from '@/services/claimManagement';
import {
  claimInfoLoadingAction,
  claimInfoNotLoadingAction,
  fetchClaimInfoAction,
} from '@/store/actions/claimActions';
import { fetchShiftInfoDataAction } from '@/store/actions/shiftActions';
import { AppDispatch } from '@/store/configureStore';

import CommonButton from '@/components/buttons/CommonButton';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { CancelClaimModal } from '@/components/modals/CancelClaimModal';
import { ProfileComponent } from '@/components/profile/ProfileComponent';

import { useModal } from '@/hooks/ModalContext';
import {
  ACCEPT_CANCEL_CLAIM_MODAL,
  CANCEL_ACCEPTED_CLAIM_MODAL,
} from '@/hooks/modalTypes';
import { CORAL, LIGHT_GRAY, WHITE } from '@/styles/colors';
import { SPACE_VALUES } from '@/styles/spacing';

import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack.types';
import { RootState, ShiftModalityEnum } from '@/types';

type ProfessionalProfileScreenProps = StackScreenProps<
  ProtectedStackParamsList,
  ProtectedStackRoutes.ProfessionalProfile
>;

export const ProfessionalProfileScreen: React.FC<
  ProfessionalProfileScreenProps
> = ({ navigation, route }) => {
  const { t } = useTranslation();

  const { shiftId, claimId } = route.params;
  const { shiftInfo } = useSelector(
    (state: RootState) => state.shiftData.shiftInfoData
  );
  const { claimRequest } = useSelector((state: RootState) => state.claimData);
  const { isLoading } = useSelector((state: RootState) => state.claimData);

  const dispatch = useDispatch<AppDispatch>();
  const { configureBottomModal, hideModal } = useModal();

  const { facilityProfile } = useSelector(
    (state: RootState) => state.profileData
  );

  useEffect(() => {
    dispatch(fetchClaimInfoAction(shiftId, claimId));
  }, [dispatch, shiftId, claimId]);

  const refreshData = () => {
    dispatch(fetchClaimInfoAction(shiftId, claimId));
  };

  const handleAcceptCancellation = async () => {
    dispatch(claimInfoLoadingAction());
    await shiftCancellationAccept(shiftId, claimId)
      .then(() => {
        dispatch(claimInfoNotLoadingAction());
        Alert.alert(
          t('shift_list_claim_accepted_title'),
          t('shift_list_claim_accepted_message')
        );
      })
      .catch((error) => {
        dispatch(claimInfoNotLoadingAction());
        const errorMessage =
          error instanceof ApiApplicationError
            ? error.message
            : t('shift_list_error_server_message');
        Alert.alert('Error', errorMessage);
      });
    dispatch(fetchShiftInfoDataAction(shiftId));
    navigation.goBack();
  };

  const handleRejectCancellation = async () => {
    dispatch(claimInfoLoadingAction());
    await shiftCancellationResolve(shiftId, claimId)
      .then(() => {
        dispatch(claimInfoNotLoadingAction());
        Alert.alert(
          t('shift_list_claim_rejected_title'),
          t('shift_list_claim_rejected_message')
        );
      })
      .catch((error) => {
        dispatch(claimInfoNotLoadingAction());
        const errorMessage =
          error instanceof ApiApplicationError
            ? error.message
            : t('shift_list_error_server_message');
        Alert.alert('Error', errorMessage);
      });
    dispatch(fetchShiftInfoDataAction(shiftId));
    navigation.goBack();
  };

  const handleCancelApprovedClaim = async (reason?: string) => {
    dispatch(claimInfoLoadingAction());
    await shiftCancelApprovedClaim(shiftId, claimId, reason)
      .then(() => {
        dispatch(claimInfoNotLoadingAction());
      })
      .catch((error) => {
        dispatch(claimInfoNotLoadingAction());
        const errorMessage =
          error instanceof ApiApplicationError
            ? error.message
            : t('shift_list_error_server_message');
        Alert.alert('Error', errorMessage);
      });
    dispatch(fetchShiftInfoDataAction(shiftId));
    navigation.goBack();
  };

  const handleOpenCV = () => {
    const fileURL = claimRequest?.professionalProfile?.professionalCV;
    navigation.navigate(ProtectedStackRoutes.PdfViewer, { uri: fileURL });
  };

  const navigateToProfessionalReviews = () => {
    navigation.navigate(ProtectedStackRoutes.ProfessionalReviews, {
      reviewInfo: claimRequest?.professionalProfile?.professionalReview,
    });
  };

  const navigateToLivoCV = () => {
    navigation.navigate(ProtectedStackRoutes.LivoCV, {
      professionalId: claimRequest.professionalProfile.id,
    });
  };

  const insets = useSafeAreaInsets();
  return isLoading ? (
    <View style={styles.loading}>
      <LoadingScreen />
    </View>
  ) : (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
        }
      >
        <ProfileComponent
          shiftId={shiftId}
          claimRequest={claimRequest}
          modality={claimRequest.modality}
          professionalProfile={claimRequest.professionalProfile}
          facilityProfile={facilityProfile}
          navigateToReviews={navigateToProfessionalReviews}
          navigateToCV={handleOpenCV}
          navigateToLivoCV={navigateToLivoCV}
          navigation={navigation}
        />
        <View style={styles.actions}>
          {claimRequest.modality === ShiftModalityEnum.INTERNAL ? (
            claimRequest.cancellationRequest ? (
              <CommonButton
                undoTitle="Rechazar solicitud"
                undoAction={() => handleRejectCancellation()}
                onPress={() => {
                  shiftInfo !== null
                    ? configureBottomModal(
                        <CancelClaimModal
                          claimRequest={claimRequest}
                          shift={shiftInfo}
                          hideModal={hideModal}
                          title={t('accept_cancel_claim_modal_title')}
                          subtitle={t('accept_cancel_claim_modal_body')}
                          removeClaim={() => {
                            hideModal();
                            handleAcceptCancellation();
                          }}
                          cancellationReasonNeeded={false}
                        />,
                        ACCEPT_CANCEL_CLAIM_MODAL
                      )
                    : null;
                }}
                title={t('accept_cancel_claim_modal_button_title')}
                backgroundColor={CORAL}
                borderColor={CORAL}
                color={WHITE}
              />
            ) : (
              <CommonButton
                title={t('cancel_accepted_claim_modal_button_title')}
                backgroundColor={WHITE}
                borderColor={CORAL}
                color={CORAL}
                onPress={() => {
                  shiftInfo !== null
                    ? configureBottomModal(
                        <CancelClaimModal
                          claimRequest={claimRequest}
                          shift={shiftInfo}
                          hideModal={hideModal}
                          title={t('cancel_accepted_claim_modal_title')}
                          subtitle={t('cancel_accepted_claim_modal_body')}
                          removeClaim={(reason?: string) => {
                            hideModal();
                            handleCancelApprovedClaim(reason);
                          }}
                          cancellationReasonNeeded={true}
                        />,
                        CANCEL_ACCEPTED_CLAIM_MODAL
                      )
                    : null;
                }}
              />
            )
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: WHITE,
  },
  screen: {
    flex: 1,
    backgroundColor: LIGHT_GRAY,
    padding: SPACE_VALUES.large,
    justifyContent: 'space-between',
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: SPACE_VALUES.xLarge,
  },
  actions: {
    padding: SPACE_VALUES.medium,
  },
});
