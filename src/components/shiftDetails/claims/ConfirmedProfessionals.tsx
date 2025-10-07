import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { Toggle } from '../../../common/Toggle';
import { ClaimRequest } from '@/services/shifts';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import StyledText from '../../StyledText';
import { ProfessionalClaimRow } from './ProfessionalClaimRow';
import { SlotReasons } from './SlotReasonList';

interface ConfirmedProfessionalsComponentProps {
  confirmedProfessionals: ClaimRequest[];
  capacity: number;
  navigateToProfile: (claimRequest: ClaimRequest) => void;
  shouldShowSlotReasonList?: boolean;
  // updateCapacity: (capacity: number, cancelReason: string, reasonDetails: string) => void;
}

export const ConfirmedProfessionalsComponent: React.FC<
  ConfirmedProfessionalsComponentProps
> = ({
  confirmedProfessionals,
  capacity,
  navigateToProfile,
  shouldShowSlotReasonList,
}) => {
  const { t } = useTranslation();

  const [selectedOption, setSelectedOption] = useState('professionals');

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.headerContainer,
          shouldShowSlotReasonList
            ? styles.headerContainerMarginSmall
            : styles.headerContainerMarginMedium,
        ]}
      >
        <StyledText style={styles.headerTitle}>
          {t('shift_detail_confirmed_professional_label')}
        </StyledText>

        <StyledText style={styles.capacityText}>
          {confirmedProfessionals.length}/{capacity}
        </StyledText>
      </View>
      {shouldShowSlotReasonList ? (
        <Toggle
          style={styles.toggleStyle}
          option1={{
            label: t('confirmed_label'),
            value: 'professionals',
          }}
          option2={{
            label: t('reasons_label'),
            value: 'reasons',
          }}
          selectedOption={selectedOption}
          setSelectedOption={(newSelection) => {
            setSelectedOption(newSelection);
          }}
          unselectedColor="#EEEFF3"
          unselectedTextColor="#375D68"
          selectedColor="#375D68"
          selectedTextColor="#FFFFFF"
        />
      ) : null}

      {selectedOption === 'professionals' ? (
        confirmedProfessionals.length > 0 ? (
          confirmedProfessionals.map((request, index) => {
            return (
              <View
                key={`accepted-${request.id}`}
                style={[
                  styles.professionalRowContainer,
                  index === confirmedProfessionals.length - 1 &&
                    styles.professionalRowContainerLast,
                ]}
              >
                <ProfessionalClaimRow
                  request={request}
                  onPress={() => navigateToProfile(request)}
                />
              </View>
            );
          })
        ) : (
          <StyledText style={styles.noProfessionalsText}>
            {t('shift_list_no_confirmed_professionals')}
          </StyledText>
        )
      ) : (
        <SlotReasons
          claims={confirmedProfessionals}
          onPress={(claim) => navigateToProfile(claim)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACE_VALUES.medium,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContainerMarginSmall: {
    marginBottom: SPACE_VALUES.small,
  },
  headerContainerMarginMedium: {
    marginBottom: SPACE_VALUES.medium,
  },
  headerTitle: {
    ...typographyStyles.heading.small,
  },
  capacityText: {
    ...typographyStyles.body.regular,
    color: '#8C95A7',
  },
  toggleStyle: {
    marginBottom: SPACE_VALUES.small,
  },
  professionalRowContainer: {
    marginBottom: SPACE_VALUES.medium,
  },
  professionalRowContainerLast: {
    marginBottom: 0,
  },
  noProfessionalsText: {
    ...typographyStyles.body.regular,
    color: '#8C95A7',
  },
});
