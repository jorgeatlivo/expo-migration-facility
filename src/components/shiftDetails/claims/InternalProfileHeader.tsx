import React from 'react';
import { View } from "react-native";
import { ClaimRequest } from "../../../services/shifts";
import { ProfileImage } from "../../claimReviews/ProfileImage";
import StyledText from "../../StyledText";
import { typographyStyles } from "../../../styles/livoFonts";
import { SquareProfilePicture } from "../../claimReviews/SquareProfileImage";
import { SPACE_VALUES } from "../../../styles/spacing";
import { CategoryTag } from "../CategoryTag";

export interface InternalProfileHeaderProps {
    claimRequest: ClaimRequest;
}
export const InternalProfileHeaderComponent: React.FC<InternalProfileHeaderProps> = ({
    claimRequest,
}) => (
    <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SquareProfilePicture
                size={48}
                profilePictureUrl={claimRequest.professionalProfile.profilePictureUrl}
                modality={claimRequest.modality}
            />
            <View style={{ marginLeft: SPACE_VALUES.small }}>
                <StyledText style={{
                    ...typographyStyles.heading.small,
                }}>
                    {claimRequest.professionalProfile.firstName} {claimRequest.professionalProfile.lastName}
                </StyledText>
                {claimRequest.professionalProfile.category && <CategoryTag
                    category={claimRequest.professionalProfile.category}
                    showLabel={true}
                />}
            </View>
        </View>
    </View>
)

