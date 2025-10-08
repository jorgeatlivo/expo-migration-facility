import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import moment from 'moment';

import { ApiApplicationError } from '@/services/api';
import {
  CompensationOptionsConfig,
  checkEligibleProfessionalsForShift,
  OnboardingShiftsConfig,
  ShiftConfigDTO,
  ShiftTimeConfigDTO,
} from '@/services/shifts';

import ActionButton from '@/components/buttons/ActionButton';
import { DropDownInput } from '@/components/common/DropDownInput';
import EditShiftTimeDetails from '@/components/editShift/EditShiftTimeDetails';
import { useFetchFillRatePrediction } from '@/components/publishShift/hooks/useFetchFillRatePrediction';
import StyledText from '@/components/StyledText';
import { CategoryTag } from '@/components/shiftDetails/CategoryTag';
import { VisibilityComponent } from '@/components/shiftDetails/VisibilityComponent';
import { ProfessionalsSelectorComponent } from '@/components/widgets/professionals/ProfessionalsSelectorComponent';

import { useFetchFacility } from '@/hooks/useFetchFacility';
import { DIVIDER_GRAY, WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { ProfessionalOverviewDTO } from '@/types/professionals';
import { buildShiftDateTime } from '@/utils/utils';

import i18n from '@/locale/i18n';
import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack.types';
import { Category, UserFeatureEnum, ValueDisplayPair } from '@/types';
import { CapacitySelectorComponent } from './CapacitySelectorComponent';
import { CompensationSelector } from './CompensationSelector';
import { EditDetailsComponent } from './EditDetailsComponent';
import { EditPriceComponent } from './EditPriceComponent';
import { FillRateBanner } from './FillRateBanner';
import OnboardingShiftRequiredCheckbox from './OnboardingShiftRequiredCheckbox';
import { SelectAndTextInput } from './SelectAndTextInput';

export type PublishShiftConfig = {
  unit: string;
  professionalField?: string;
  details: string;
  capacity: string;
  totalPay: string;
  shiftDate: Date;
  shiftStartTime: Date;
  shiftEndTime: Date;
  isInternalVisible: boolean;
  isExternalVisible: boolean;
  minimumCapacity?: number;
  onboardingShiftsRequired?: boolean;
  invitedProfessionals?: ProfessionalOverviewDTO[];
  unitConfigurable: boolean;
  selectedCompensationOptions?: string[];
  shiftId?: number;
  temporalId?: string;
};

interface PublishShiftComponentProps {
  initialValues: PublishShiftConfig;
  onboardingShiftsEnabled?: boolean;
  livoPoolOnboarded: boolean;
  livoInternalOnboarded: boolean;
  timeInDay: string;
  shiftTimeConfig: ShiftTimeConfigDTO;
  professionalFields: ValueDisplayPair[];
  units: string[] | null;
  onPublish: (shiftConfiguration: PublishShiftConfig) => Promise<void>;
  isEditing?: boolean;
  undoAction?: () => void;
  undoTitle?: string;
  category?: Category | null;
  onSetCategory?: (category: Category) => any;
  onboardingShifts?: OnboardingShiftsConfig;
  compensationOptions?: CompensationOptionsConfig;
  source?: ProtectedStackRoutes;
}

const priceVariantItems = [
  {
    label: i18n.t('total'),
    value: 'totalPrice',
  },
  {
    label: i18n.t('per_hour'),
    value: 'pricePerHour',
  },
];

const PublishShiftComponent: React.FC<PublishShiftComponentProps> = ({
  initialValues,
  livoPoolOnboarded,
  livoInternalOnboarded,
  onboardingShiftsEnabled,
  timeInDay,
  shiftTimeConfig,
  onPublish,
  isEditing,
  undoTitle,
  undoAction,
  units,
  professionalFields,
  category,
  onSetCategory,
  compensationOptions,
  onboardingShifts,
  source,
}) => {
  const navigation =
    useNavigation<StackNavigationProp<ProtectedStackParamsList>>();
  const { data: facilityProfile } = useFetchFacility();

  const isShiftInvitationEnabled = useMemo(
    () =>
      facilityProfile?.userFeatures.includes(
        UserFeatureEnum.FACILITY_PROFESSIONAL_INVITE_ENABLED
      ),
    [facilityProfile?.userFeatures]
  );

  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const [details, setDetails] = useState<string>(initialValues.details);
  const [professionalField, setProfessionalField] = useState<
    string | undefined
  >(initialValues.professionalField);

  const [capacity, setCapacity] = useState<string>(initialValues.capacity);
  const [price, setPrice] = useState<string>(initialValues.totalPay);
  const [shiftDate, setShiftDate] = useState(initialValues.shiftDate);
  const [shiftStartTime, setShiftStartTime] = useState(
    initialValues.shiftStartTime
  );
  const [onboardingShiftsRequired, setOnboardingShiftsRequired] =
    useState<boolean>(initialValues.onboardingShiftsRequired ?? false);
  const [shiftEndTime, setShiftEndTime] = useState(initialValues.shiftEndTime);
  const [unit, setUnit] = useState<string>(initialValues.unit);

  const [priceVariant, setPriceVariant] = useState<string>('totalPrice');
  const [isInternalVisible, setIsInternalVisible] = useState(
    initialValues.isInternalVisible
  );
  const [isExternalVisible, setIsExternalVisible] = useState(
    initialValues.isExternalVisible
  );
  const [entriesCheck, setEntriesCheck] = useState(false);
  const [invitedProfessionals, setInvitedProfessionals] = useState<
    ProfessionalOverviewDTO[]
  >(initialValues.invitedProfessionals ?? []);
  const [selectedCompensationOptions, setSelectedCompensationOptions] =
    useState<string[]>(() => {
      return (
        initialValues.selectedCompensationOptions ??
        compensationOptions?.options
          .filter((o) => !!o.enabledByDefault)
          .map((o) => o.value) ??
        []
      );
    });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const poolAndInternalOnboarded = livoPoolOnboarded && livoInternalOnboarded;

  const { t } = useTranslation();

  const publishShiftButtonText = useMemo(() => {
    if (isEditing) {
      return t('save_changes');
    }

    if (!livoPoolOnboarded && livoInternalOnboarded) {
      return t('shift_list_publish_shift_button');
    }

    if (isInternalVisible && isExternalVisible) {
      return t('publish_livo_and_internal_shift');
    }

    return t(
      isInternalVisible ? 'publish_internal_shift' : 'publish_livo_shift'
    );
  }, [
    isEditing,
    isExternalVisible,
    isInternalVisible,
    livoInternalOnboarded,
    livoPoolOnboarded,
    t,
  ]);

  const parsedProFields = useMemo(
    () =>
      professionalFields?.map((field) => ({
        label: field.displayText,
        value: field.value,
      })) ?? null,
    [professionalFields]
  );

  const parsedUnits = useMemo(
    () =>
      units?.map((internalUnit) => ({
        label: internalUnit,
        value: internalUnit,
      })) ?? null,
    [units]
  );

  const startTime = moment(shiftStartTime);
  const endTime = moment(shiftEndTime);

  const durationInMilliseconds = endTime.diff(startTime); // Get the duration in milliseconds
  let durationInHours = moment.duration(durationInMilliseconds).asHours(); // Convert milliseconds to hours
  if (durationInHours < 0) {
    durationInHours += 24;
  }

  const parsedPrice = price.replace(',', '.');

  const totalPay = useMemo(
    () =>
      +(parsedPrice || '0') *
      (priceVariant === 'pricePerHour' ? durationInHours : 1),
    [priceVariant, parsedPrice, durationInHours]
  );

  const isInvalidPrice = useMemo(
    () => isExternalVisible && (Number.isNaN(totalPay) || totalPay <= 0),
    [isExternalVisible, totalPay]
  );

  const invalidPriceMessage = isInvalidPrice ? t('invalid_price_message') : '';
  const invalidVisibilityMessage =
    !isInternalVisible && !isExternalVisible
      ? t('require_one_visible_group_to_publish')
      : '';

  const memoPredictionParams = useMemo(() => {
    return {
      startTime: shiftStartTime.toISOString(),
      endTime: shiftEndTime.toISOString(),
      onboardingShiftsRequired,
      category: category?.code ?? '',
      recurrentDates: [shiftDate.toISOString().split('T')[0]],
      capacity: +capacity,
      details,
      externalVisible: isExternalVisible,
      internalVisible: isInternalVisible,
      unit,
      totalPay,
      professionalField,
      shiftId: initialValues.shiftId,
    };
  }, [
    capacity,
    category?.code,
    details,
    initialValues.shiftId,
    isExternalVisible,
    isInternalVisible,
    onboardingShiftsRequired,
    professionalField,
    shiftDate,
    shiftEndTime,
    shiftStartTime,
    totalPay,
    unit,
  ]);

  /**
   * use memo params to avoid infinite rerender in debounce hooks
   */
  const fillRatePrediction = useFetchFillRatePrediction(memoPredictionParams);

  const validEntries = useMemo(
    () =>
      !isInvalidPrice &&
      (isInternalVisible || isExternalVisible) &&
      (unit || !units || units?.length === 0),
    [isExternalVisible, isInternalVisible, isInvalidPrice, unit, units]
  );

  const shiftConfigDTO = useMemo(() => {
    const startTimeMoment = buildShiftDateTime(shiftDate, shiftStartTime);
    const endTimeMoment = buildShiftDateTime(shiftDate, shiftEndTime);

    if (endTimeMoment.isBefore(startTimeMoment)) {
      endTimeMoment.add(1, 'day');
    }

    return {
      category: category?.code,
      unit: unit,
      professionalField: professionalField,
      startTime: startTimeMoment.toDate(),
      endTime: endTimeMoment.toDate(),
      externalVisible: isExternalVisible,
      internalVisible: isInternalVisible,
    } as ShiftConfigDTO;
  }, [
    category?.code,
    unit,
    professionalField,
    shiftDate,
    shiftStartTime,
    shiftEndTime,
    isExternalVisible,
    isInternalVisible,
  ]);

  const isShiftInvitationActive = useMemo(() => {
    return (
      isShiftInvitationEnabled &&
      !!shiftConfigDTO.category &&
      !!shiftConfigDTO.startTime &&
      !!shiftConfigDTO.endTime &&
      shiftConfigDTO.externalVisible &&
      (!units?.length || !!unit) &&
      Number(capacity) > 0
    );
  }, [isShiftInvitationEnabled, shiftConfigDTO, units, unit, capacity]);

  useEffect(() => {
    // whenever capacity changed, update the invited pro list accordingly
    const capacityNum = Number(capacity);
    setInvitedProfessionals((currentList) => {
      if (currentList.length > capacityNum) {
        return currentList.slice(0, capacityNum);
      }
      return currentList;
    });
  }, [capacity]);

  useEffect(() => {
    // whenever the shift configuration changed, check if the current invited pro is still eligible for the shift
    if (invitedProfessionalIdsRef.current.length > 0) {
      checkEligibleProfessionalsForShift(
        shiftConfigDTO,
        invitedProfessionalIdsRef.current
      )
        .then((res) =>
          setInvitedProfessionals((currentList) =>
            currentList.filter(
              (pro) =>
                !!pro.readOnly || res.eligibleProfessionalIds.includes(pro.id)
            )
          )
        )
        .catch((error) => {
          console.error(
            'Failed to check eligible professionals for shift',
            shiftConfigDTO,
            error
          );
          setInvitedProfessionals([]);
        });
    }
  }, [shiftConfigDTO]);

  const invitedProfessionalIdsRef = useRef<number[]>([]);
  useEffect(() => {
    invitedProfessionalIdsRef.current = invitedProfessionals.map(
      (pro) => pro.id
    );
  }, [invitedProfessionals]);

  const onSetExternalVisible = useCallback(
    (externalVisible: boolean) => {
      setIsExternalVisible(externalVisible);
      if (externalVisible) {
        setOnboardingShiftsRequired(
          initialValues.onboardingShiftsRequired ?? false
        );
      } else {
        setOnboardingShiftsRequired(false);
      }
    },
    [initialValues.onboardingShiftsRequired]
  );

  const onShiftPublishAction = useCallback(async () => {
    try {
      if (!validEntries) {
        setEntriesCheck(true);
        return;
      }

      setIsSubmitting(true);
      await onPublish({
        onboardingShiftsRequired,
        shiftDate,
        shiftStartTime,
        shiftEndTime,
        capacity,
        details,
        isExternalVisible,
        isInternalVisible,
        unit,
        professionalField,
        totalPay: totalPay.toString(),
        invitedProfessionals: isShiftInvitationActive
          ? invitedProfessionals
          : [],
        unitConfigurable: initialValues.unitConfigurable,
        selectedCompensationOptions,
        temporalId: fillRatePrediction.data?.temporalId,
      });
    } catch (error: any) {
      const errorMessage =
        error instanceof ApiApplicationError
          ? error.message
          : t('shift_list_error_server_message');
      Alert.alert(t('creating_shift_error_title'), errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validEntries,
    onPublish,
    onboardingShiftsRequired,
    shiftDate,
    shiftStartTime,
    shiftEndTime,
    capacity,
    details,
    isExternalVisible,
    isInternalVisible,
    unit,
    professionalField,
    totalPay,
    isShiftInvitationActive,
    invitedProfessionals,
    initialValues.unitConfigurable,
    selectedCompensationOptions,
    fillRatePrediction.data?.temporalId,
    t,
  ]);

  const onSearchProfessionalsForInvitation = useCallback(() => {
    if (!isShiftInvitationActive) {
      return;
    }

    navigation.navigate(
      ProtectedStackRoutes.SearchProfessionalForShiftInvitation,
      {
        shiftConfig: shiftConfigDTO,
        selectedProfessionalIds: invitedProfessionals.map((pro) => pro.id),
        onSelectPro: (pro) => {
          if (pro) {
            setInvitedProfessionals((currentList) => [...currentList, pro]);
          }
        },
        source,
      }
    );
  }, [
    isShiftInvitationActive,
    navigation,
    shiftConfigDTO,
    invitedProfessionals,
    source,
  ]);

  const invitationExpirationHours = useMemo(() => {
    const now = moment();
    const newStartTime = buildShiftDateTime(shiftDate, shiftStartTime);
    return newStartTime.diff(now, 'hours') >= 72 ? 24 : 8;
  }, [shiftDate, shiftStartTime]);

  const navigateToSelectCategory = () => {
    navigation.navigate(ProtectedStackRoutes.SelectCategory, {
      categories: facilityProfile?.facility.categories ?? [],
      onSelectCategory: (newCategory) => {
        if (onSetCategory) {
          onSetCategory(newCategory);
        }
      },
    });
  };

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardAvoidingView}
          >
            {fillRatePrediction.data?.displayBanner && (
              <FillRateBanner
                key="banner"
                bands={fillRatePrediction.data.bands}
                banner={fillRatePrediction.data.banner}
              />
            )}

            <Animated.ScrollView
              layout={LinearTransition.duration(400)}
              contentContainerStyle={[styles.scrollViewContent]}
              keyboardShouldPersistTaps="handled"
            >
              <StyledText style={styles.sectionTitle}>
                {t('publish_shift_details_title')}
              </StyledText>
              <DropDownInput
                placeholderAsLabel
                disabled={isEditing}
                placeholder={t('publish_shift_select_category_label')}
                selectedLabel={
                  category ? <CategoryTag category={category} showLabel /> : ''
                }
                navigateToOptions={navigateToSelectCategory}
                style={{
                  marginBottom: SPACE_VALUES.large,
                }}
              />
              {livoInternalOnboarded || initialValues.unitConfigurable ? (
                <SelectAndTextInput
                  enableTextInput
                  value={unit}
                  setValue={setUnit}
                  disabled={isEditing}
                  iconName="patient-in-bed"
                  label={t('publish_shift_edit_unit_label')}
                  placeholder={t('publish_shift_select_unit_label')}
                  textPlaceholder={t('publish_shift_edit_unit_placeholder')}
                  options={parsedUnits}
                  errorMessage={
                    entriesCheck && !unit
                      ? t('publish_shift_select_unit_error')
                      : undefined
                  }
                />
              ) : null}
              {professionalFields?.length ? (
                <SelectAndTextInput
                  optional
                  disabled={isEditing}
                  value={professionalField}
                  options={parsedProFields}
                  setValue={setProfessionalField}
                  iconName="heartbeat"
                  label={`${t('shift_list_professional_field_title')} (${t(
                    'common_optional'
                  )})`}
                  placeholder={t('shift_list_select_professional_field')}
                />
              ) : null}

              <StyledText style={styles.sectionTitle}>
                {t('calendar_screen_title')}
              </StyledText>
              <EditShiftTimeDetails
                shiftDate={shiftDate}
                setShiftDate={setShiftDate}
                shiftEndTime={shiftEndTime}
                setShiftEndTime={setShiftEndTime}
                shiftStartTime={shiftStartTime}
                setShiftStartTime={setShiftStartTime}
                shiftTimeConfig={shiftTimeConfig}
                timeInDay={timeInDay}
              />
              {poolAndInternalOnboarded && (
                <VisibilityComponent
                  isExternalVisible={isExternalVisible}
                  isInternalVisible={isInternalVisible}
                  setIsInternalVisible={setIsInternalVisible}
                  setIsExternalVisible={onSetExternalVisible}
                  textInfo={t('select_audience_for_visible_shift')}
                  errorMessage={invalidVisibilityMessage}
                />
              )}

              {onboardingShiftsEnabled && isExternalVisible && (
                <OnboardingShiftRequiredCheckbox
                  onboardingShiftsRequired={onboardingShiftsRequired}
                  setOnboardingShiftsRequired={setOnboardingShiftsRequired}
                />
              )}

              {isInternalVisible && compensationOptions?.configurable && (
                <>
                  <StyledText style={styles.sectionTitle}>
                    {t('publish_shift_compensation_label')}
                  </StyledText>
                  <CompensationSelector
                    options={compensationOptions.options}
                    selectedValues={selectedCompensationOptions}
                    onChange={setSelectedCompensationOptions}
                  />
                </>
              )}

              {isExternalVisible && (
                <>
                  <StyledText style={styles.sectionTitle}>
                    {t('publish_shift_price_title')}
                  </StyledText>
                  <EditPriceComponent
                    price={price}
                    setPrice={setPrice}
                    disabled={!isExternalVisible}
                    errorMessage={entriesCheck ? invalidPriceMessage : ''}
                    priceVariantItems={priceVariantItems}
                    setPriceVariant={setPriceVariant}
                    priceVariant={priceVariant}
                    onboardingShiftPrice={
                      onboardingShiftsRequired
                        ? onboardingShifts?.pricing
                        : undefined
                    }
                  />
                </>
              )}

              <StyledText style={styles.sectionTitle}>
                {t('publish_shift_additional_informations_label')}
              </StyledText>
              <EditDetailsComponent details={details} setDetails={setDetails} />

              <StyledText style={styles.sectionTitle}>
                {t('publish_shift_capacity_label')}
              </StyledText>
              <CapacitySelectorComponent
                capacity={capacity}
                setCapacity={setCapacity}
                minimumCapacity={initialValues.minimumCapacity}
              />

              {isShiftInvitationActive && (
                <ProfessionalsSelectorComponent
                  title={t('assign_professionals_title')}
                  description={t('professionals_selector_description', {
                    expirationHours: invitationExpirationHours,
                  })}
                  addButtonLabel={t('add_professional_label')}
                  capacity={Number(capacity)}
                  selectedProfessionals={invitedProfessionals}
                  setSelectedProfessionals={setInvitedProfessionals}
                  onAddProfessional={onSearchProfessionalsForInvitation}
                />
              )}
            </Animated.ScrollView>
            <View style={styles.actionButtonContainer}>
              <ActionButton
                loading={isSubmitting}
                title={publishShiftButtonText}
                onPress={() => onShiftPublishAction()}
                undoAction={undoAction}
                undoTitle={undoTitle}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
};

export default PublishShiftComponent;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollView: {
    flexGrow: 1,
    paddingVertical: SPACE_VALUES.large,
    paddingHorizontal: SPACE_VALUES.medium,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: WHITE,
  },
  modalContent: {
    flex: 1,
    backgroundColor: WHITE,
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: SPACE_VALUES.large,
    paddingHorizontal: SPACE_VALUES.medium,
    paddingTop: SPACE_VALUES.large,
  },
  actionButtonContainer: {
    paddingVertical: SPACE_VALUES.medium,
    paddingHorizontal: SPACE_VALUES.medium,
    borderTopColor: DIVIDER_GRAY,
    borderTopWidth: 1,
  },
  sectionTitle: {
    ...typographyStyles.heading.small,
    marginBottom: SPACE_VALUES.large,
  },
  disabled: {
    color: DIVIDER_GRAY,
  },
});
