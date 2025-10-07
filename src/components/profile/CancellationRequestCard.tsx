import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ClaimRequest } from '@/services/shifts';

import StyledText from '@/components/StyledText';

import { WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

type CancellationRequestCardProps = {
  claimRequest: ClaimRequest;
};

export default function CancellationRequestCard({
  claimRequest,
}: CancellationRequestCardProps) {
  return (
    claimRequest.cancellationRequest && (
      <View style={{ ...styles.cardStyle, marginBottom: SPACE_VALUES.medium }}>
        <StyledText
          style={{
            ...typographyStyles.body.regular,
          }}
        >
          {claimRequest.cancellationRequest.reason}
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
