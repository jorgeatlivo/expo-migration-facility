import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {ClaimRequest} from '@/services/shifts';
import {PRIMARY_BLUE, WHITE} from '@/styles/colors';
import {commonStyles} from '@/styles/commonStyles';
import {LayoutTextEnum} from '@/styles/fonts';
import StyledText from '@/components/StyledText';
import {ProfileImage} from './ProfileImage';

interface ClaimRequestProps {
  request: ClaimRequest;
}

export const ClaimRequestRow: React.FC<ClaimRequestProps> = ({request}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <ProfileImage
          imageSize={40}
          profileImage={request.professionalProfile.profilePictureUrl}
        />
        <StyledText
          type={LayoutTextEnum.subHeader}
          style={styles.textCardStyle}>
          {request.professionalProfile.firstName}{' '}
          {request.professionalProfile.lastName}{' '}
        </StyledText>
      </View>
      <StyledText type={LayoutTextEnum.link}>
        {request.status === 'PENDING_APPROVAL'
          ? t('shift_list_claim_review')
          : t('shift_list_visit_profile')}
      </StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  ...commonStyles,
  card: {
    backgroundColor: WHITE,
    padding: 10,
    marginBottom: 2,
    elevation: 2,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingHorizontal: 20,
  },
  textCardStyle: {
    marginLeft: 10,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkStyle: {
    color: PRIMARY_BLUE,
    fontWeight: 'bold',
  },
});
