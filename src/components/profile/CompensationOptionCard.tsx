import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ClaimRequest } from '@/services/shifts';
import { WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import StyledText from '@/components/StyledText';;

type CompensationOptionCardProps = {
  claimRequest: ClaimRequest;
};

export default function CompensationOptionCard({
  claimRequest,
}: CompensationOptionCardProps) {
  return (
    claimRequest.compensationOption && (
      <View style={{ ...styles.cardStyle, marginBottom: SPACE_VALUES.medium }}>
        <StyledText
          style={{
            ...typographyStyles.body.regular,
          }}
        >
          {claimRequest.compensationOption.label}:{' '}
          {claimRequest.compensationOption.compensationValue}
        </StyledText>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  cardStyle: {
    padding: SPACE_VALUES.large,
    borderRadius: SPACE_VALUES.small,
    backgroundColor: WHITE,
  },
});
