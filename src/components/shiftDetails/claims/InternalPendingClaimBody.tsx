import React from 'react';
import { View } from "react-native";
import StyledText from "../../StyledText";
import { typographyStyles } from "../../../styles/livoFonts";
import { ClaimRequest } from "../../../services/shifts";
import { Divider } from "../../common/Divider";
import { SPACE_VALUES } from "../../../styles/spacing";
import { InternalExperienceComponent } from "../../profile/InternalExperienceComponent";

export interface InternalPendingClaimBodyProps {
    claimRequest: ClaimRequest;
}

export const InternalPendingClaimBody: React.FC<InternalPendingClaimBodyProps> = ({
    claimRequest,
}) => (
    <View style={{ marginTop: 12, justifyContent: 'flex-end' }}>
        <View
            style={
                {
                    maxHeight: 172
                }
            }
        >
        <InternalExperienceComponent
            employeeNumber={claimRequest.professionalProfile.internal?.employeeNumber}
            contractType={claimRequest.professionalProfile.internal?.contractType}
            unit={claimRequest.professionalProfile.internal?.unit}
            datafields={claimRequest.professionalProfile.internal?.dataFields}
        />
        </View>
      
        <Divider />
        <StyledText
            style={{
                ...typographyStyles.heading.small,
                marginTop: SPACE_VALUES.medium,
                textAlign: 'center'
            }}
        >
            {claimRequest.compensationOption?.label}: {claimRequest.compensationOption?.compensationValue}
        </StyledText>
    </View>
)
