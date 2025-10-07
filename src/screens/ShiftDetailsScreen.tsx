import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { IconPencil } from 'tabler-icons-react-native';
import { formatDate } from '@/common/utils';
import NoClaimsPlaceholder from '@/components/claims/NoClaimsPlaceholder';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { TagComponent } from '@/components/profile/TagComponent';
import { ConfirmedProfessionalsComponent } from '@/components/shiftDetails/claims/ConfirmedProfessionals';
import { MultiplePendingClaimsComponent } from '@/components/shiftDetails/claims/MultiplePendingClaimsComponent';
import { PendingProfessionalClaimItem } from '@/components/shiftDetails/claims/PendingProfessionalClaimItem';
import { DetailsComponent } from '@/components/shiftDetails/DetailsComponent';
import { ExternalShiftIdComponent } from '@/components/shiftDetails/ExternalShiftIdComponent';
import { ShiftInfo } from '@/components/shiftDetails/ShiftInfo';
import { ModalityTag } from '@/components/shiftList/ModalityTag';
import StyledText from '@/components/StyledText';
import { ClaimRequest, ShiftClaimStatus } from '@/services/shifts';
import { fetchShiftInfoDataAction } from '@/store/actions/shiftActions';
import { AppDispatch } from '@/store/configureStore';
import {
  ACTION_BLUE,
  BADGE_GRAY,
  BLUE_FADED,
  BORDER_GRAY,
  NEW_LIGHT_GRAY,
  PURPLE,
  WHITE,
} from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { BORDER, SPACE_VALUES } from '@/styles/spacing';
import { RootState, ShiftModalityEnum, UserFeatureEnum } from '@/types';
import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack';
import Row from '@/components/atoms/Row';
import { useFetchFacility } from '@/hooks/useFetchFacility';
import { professionalProfileToOverviewDTO } from '@/types/professionals';

type ShiftDetailsScreen = StackScreenProps<
  ProtectedStackParamsList,
  ProtectedStackRoutes.ShiftDetails
>;

export const ShiftDetailsScreen: React.FC<ShiftDetailsScreen> = ({
  navigation,
  ...props
}) => {
  const { t } = useTranslation();
  const { data: facilityProfile } = useFetchFacility();

  const areNewFieldsAndUnitsActive = useMemo(
    () =>
      facilityProfile?.userFeatures.includes(
        UserFeatureEnum.SHIFT_UNIT_AND_PROFESSIONAL_FIELDS
      ),
    [facilityProfile?.userFeatures]
  );

  const { shiftInfoData } = useSelector((state: RootState) => state.shiftData);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const { shiftId } = props.route.params;
  const claimRequests = shiftInfoData.claimRequests || [];
  const shiftInfo = shiftInfoData.shiftInfo;

  const pendingClaimRequests = claimRequests.filter((request) =>
    [
      ShiftClaimStatus.PENDING_APPROVAL,
      ShiftClaimStatus.PENDING_PRO_ACCEPT,
      ShiftClaimStatus.INVITATION_EXPIRED,
      ShiftClaimStatus.REJECTED_BY_PRO,
      ShiftClaimStatus.PRO_NOT_AVAILABLE,
    ].includes(request.status as ShiftClaimStatus)
  );

  const acceptedRequests = claimRequests.filter(
    (request) => request.status === ShiftClaimStatus.APPROVED
  );

  useEffect(() => {
    if (!shiftInfoData.isLoading && shiftInfo) {
      const headerTitle = () => (
        <Row>
          <StyledText style={styles.headerTitleText}>
            {formatDate(new Date(shiftInfo?.startTime), true)}
          </StyledText>
          {shiftInfo.holiday && (
            <TagComponent
              text={t('common_holiday')}
              color={'#52377C'}
              backgroundColor={WHITE}
              style={styles.holidayTag}
            />
          )}
        </Row>
      );

      const isActionNotAllowed = !shiftInfoData?.shiftInfo?.shiftActionsAllow;
      const headerRight = () => (
        <TouchableOpacity
          disabled={isActionNotAllowed}
          onPress={() => {
            navigation.navigate(ProtectedStackRoutes.EditShift, {
              shiftInfo: {
                ...shiftInfo,
                invitedProfessionals: claimRequests
                  .filter(
                    (claim) =>
                      !!claim.invitation &&
                      claim.status === ShiftClaimStatus.PENDING_PRO_ACCEPT
                  )
                  .map((claim) =>
                    professionalProfileToOverviewDTO(
                      claim.professionalProfile,
                      claim.status === ShiftClaimStatus.APPROVED
                    )
                  ),
                selectedCompensationOptions: shiftInfo.compensationOptions?.map(
                  (compensation) => compensation.value
                ),
              },
            });
          }}
        >
          <Row alignItems={'center'}>
            <StyledText
              style={[
                styles.headerRightText,
                isActionNotAllowed && styles.headerRightTextDisabled,
              ]}
            >
              {t('common_edit')}
            </StyledText>
            <IconPencil
              size={24}
              color={isActionNotAllowed ? BADGE_GRAY : ACTION_BLUE}
              style={styles.headerRightIcon}
            />
          </Row>
        </TouchableOpacity>
      );

      navigation.setOptions({
        headerTitleAlign: 'center',
        headerShown: true,
        headerRight,
        ...(areNewFieldsAndUnitsActive ? {} : { headerTitle }),
      });
    } else if (!areNewFieldsAndUnitsActive) {
      const headerTitle = () => (
        <View>
          <StyledText style={typographyStyles.subtitle.regular}>
            {t('shift_detail_loading_title')}
          </StyledText>
        </View>
      );

      navigation.setOptions({
        headerTitle,
      });
    }
  }, [
    navigation,
    shiftInfo,
    areNewFieldsAndUnitsActive,
    shiftInfoData.isLoading,
    shiftInfoData?.shiftInfo?.shiftActionsAllow,
    claimRequests,
  ]);

  const refreshData = useCallback(() => {
    dispatch(fetchShiftInfoDataAction(shiftId));
  }, [dispatch, shiftId]);

  useEffect(() => refreshData(), []);

  const navigateToProfile = useCallback(
    (request: ClaimRequest) => {
      navigation.navigate(ProtectedStackRoutes.ProfessionalProfile, {
        shiftId: shiftId,
        claimId: request.id,
      });
    },
    [navigation, shiftId]
  );

  const navigateToReviews = useCallback(
    (claimRequest: ClaimRequest) => {
      navigation.navigate(ProtectedStackRoutes.ProfessionalReviews, {
        reviewInfo: claimRequest.professionalProfile.professionalReview,
      });
    },
    [navigation]
  );

  const handleOpenCV = useCallback(
    (claimRequest: ClaimRequest) => {
      const fileURL = claimRequest.professionalProfile.professionalCV;
      navigation.navigate(ProtectedStackRoutes.PdfViewer, { uri: fileURL });
    },
    [navigation]
  );

  const navigateToLivoCV = useCallback(
    (claimRequest: ClaimRequest) => {
      navigation.navigate(ProtectedStackRoutes.LivoCV, {
        professionalId: claimRequest.professionalProfile.id,
      });
    },
    [navigation]
  );

  const divider = <View style={styles.divider} />;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {shiftInfoData.isLoading || isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingScreen />
        </View>
      ) : (
        shiftInfo && (
          <>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={refreshData}
                />
              }
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
            >
              <>
                <ShiftInfo shift={shiftInfo} />
                {divider}
              </>

              {shiftInfo.livoPoolOnboarded &&
                shiftInfo.livoInternalOnboarded && (
                  <>
                    <View style={styles.visibilityContainer}>
                      <StyledText style={styles.visibilityTitle}>
                        {t('shift_list_visibility_label')}
                      </StyledText>
                      <StyledText style={styles.visibilitySubtitle}>
                        {t('shift_detail_visibility_subtitle')}
                      </StyledText>
                      <Row gap={SPACE_VALUES.tiny}>
                        {shiftInfo.externalVisible && (
                          <ModalityTag
                            modality={ShiftModalityEnum.EXTERNAL}
                            style={styles.modalityTag}
                          />
                        )}
                        {shiftInfo.internalVisible && (
                          <ModalityTag modality={ShiftModalityEnum.INTERNAL} />
                        )}
                      </Row>
                    </View>
                    {divider}
                  </>
                )}
              {!!shiftInfo?.details && (
                <>
                  <DetailsComponent details={shiftInfo.details} />
                  {divider}
                </>
              )}
              <ConfirmedProfessionalsComponent
                confirmedProfessionals={acceptedRequests}
                capacity={shiftInfo.capacity}
                navigateToProfile={navigateToProfile}
                shouldShowSlotReasonList={shiftInfo.shouldShowSlotReasonList}
              />
              {!!shiftInfo?.externalId && (
                <>
                  {divider}
                  <ExternalShiftIdComponent
                    externalShiftId={shiftInfo.externalId}
                  />
                </>
              )}
            </ScrollView>
            {shiftInfo.capacity > acceptedRequests.length && (
              <View style={styles.pendingClaimsContainer}>
                {pendingClaimRequests?.length > 0 ? (
                  shiftInfo.multipleClaimsEnabled ? (
                    <MultiplePendingClaimsComponent
                      shiftId={shiftId}
                      pendingClaims={pendingClaimRequests}
                      onHandleClaim={refreshData}
                      setLoading={setIsLoading}
                      navigateToReviews={navigateToReviews}
                      navigateToCV={handleOpenCV}
                      navigateToLivoCV={navigateToLivoCV}
                    />
                  ) : (
                    <PendingProfessionalClaimItem
                      shiftId={shiftId}
                      claimRequest={pendingClaimRequests[0]}
                      navigateToCV={handleOpenCV}
                      navigateToReviews={navigateToReviews}
                      navigateToLivoCV={navigateToLivoCV}
                      onHandleClaim={refreshData}
                      setLoading={setIsLoading}
                    />
                  )
                ) : (
                  <NoClaimsPlaceholder navigation={navigation} />
                )}
              </View>
            )}
          </>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  holidayTag: {
    borderWidth: BORDER.medium,
    borderColor: PURPLE,
    paddingHorizontal: 2,
    paddingVertical: SPACE_VALUES.none,
  },
  headerTitleText: {
    ...typographyStyles.subtitle.regular,
    paddingRight: SPACE_VALUES.tiny,
  },
  headerRightText: {
    ...typographyStyles.body.regular,
    color: ACTION_BLUE,
  },
  headerRightTextDisabled: {
    color: BADGE_GRAY,
  },
  headerRightIcon: {
    marginLeft: SPACE_VALUES.tiny,
    marginRight: SPACE_VALUES.medium,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: NEW_LIGHT_GRAY,
    marginHorizontal: SPACE_VALUES.medium,
    marginVertical: SPACE_VALUES.small,
  },
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  visibilityContainer: {
    paddingHorizontal: SPACE_VALUES.medium,
    paddingVertical: SPACE_VALUES.medium,
  },
  visibilityTitle: {
    ...typographyStyles.heading.small,
    marginBottom: SPACE_VALUES.medium,
  },
  visibilitySubtitle: {
    ...typographyStyles.body.regular,
    marginBottom: SPACE_VALUES.medium,
    color: BLUE_FADED,
  },
  modalityTag: {
    marginRight: SPACE_VALUES.tiny,
  },
  pendingClaimsContainer: {
    padding: SPACE_VALUES.medium,
    borderTopColor: BORDER_GRAY,
    borderTopWidth: 1,
  },
});

export default ShiftDetailsScreen;
