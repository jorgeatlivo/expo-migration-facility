import { ClaimRequest } from "../../services/shifts";
import { StyleSheet, View } from "react-native";
import { SPACE_VALUES } from "../../styles/spacing";
import React from "react";
import { WHITE } from "../../styles/colors";
import StyledText from "../StyledText";
import { typographyStyles } from "../../styles/livoFonts";

type CompensationOptionCardProps = {
  claimRequest: ClaimRequest;
}

export default function CompensationOptionCard({
  claimRequest
}: CompensationOptionCardProps) {
  return claimRequest.compensationOption && (
    <View
      style={{ ...styles.cardStyle, marginBottom: SPACE_VALUES.medium }}
    >
      <StyledText
        style={{
          ...typographyStyles.body.regular,
        }}
      >
        {claimRequest.compensationOption.label}: {claimRequest.compensationOption.compensationValue}
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