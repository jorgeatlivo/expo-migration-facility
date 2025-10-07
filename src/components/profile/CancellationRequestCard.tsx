import { ClaimRequest } from "../../services/shifts";
import { StyleSheet, View } from "react-native";
import { SPACE_VALUES } from "../../styles/spacing";
import StyledText from "../StyledText";
import { typographyStyles } from "../../styles/livoFonts";
import React from "react";
import { WHITE } from "../../styles/colors";

type CancellationRequestCardProps = {
  claimRequest: ClaimRequest;
}

export default function CancellationRequestCard({
  claimRequest
}: CancellationRequestCardProps) {
  return claimRequest.cancellationRequest && (
    <View
      style={{ ...styles.cardStyle, marginBottom: SPACE_VALUES.medium }}
    >
      <StyledText
        style={{
          ...typographyStyles.body.regular,
        }}
      >
        {claimRequest.cancellationRequest.reason}
      </StyledText>
    </View>
  )
}

const styles = StyleSheet.create({
  cardStyle: {
    padding: SPACE_VALUES.large,
    borderRadius: SPACE_VALUES.small,
    backgroundColor: WHITE,
  }
});
