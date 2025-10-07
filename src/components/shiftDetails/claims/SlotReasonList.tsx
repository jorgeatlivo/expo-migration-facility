import { View } from "react-native"
import { ClaimRequest } from "../../../services/shifts"
import { SlotReasonComponent } from "./SlotReasonComponent"
import { SPACE_VALUES } from "../../../styles/spacing"

interface SlotReasonsProps {
    claims: ClaimRequest[]
    onPress: (claim: ClaimRequest) => void
}

export const SlotReasons: React.FC<SlotReasonsProps> = ({
    claims,
    onPress
}) => {

    return (
        <View
        >
            {
                claims.map((claim, index) =>(
                    <SlotReasonComponent
                        style={{ marginBottom: SPACE_VALUES.small }}
                        key={index}
                        reason={claim.slotReason}
                        professionalName={claim.professionalProfile.firstName + ' ' + claim.professionalProfile.lastName}
                        onPress={() => onPress(claim)}
                    />
                ))
            }
        </View>
    )
}