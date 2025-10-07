import React from 'react';
import { View } from 'react-native';

import { ClaimRequest } from '@/services/shifts';

import { SquareProfilePicture } from '@/components/claimReviews/SquareProfileImage';
import StyledText from '@/components/StyledText';
import { CategoryTag } from '@/components/shiftDetails/CategoryTag';

import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

export interface InternalProfileHeaderProps {
  claimRequest: ClaimRequest;
}
export const InternalProfileHeaderComponent: React.FC<
  InternalProfileHeaderProps
> = ({ claimRequest }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <SquareProfilePicture
        size={48}
        profilePictureUrl={claimRequest.professionalProfile.profilePictureUrl}
        modality={claimRequest.modality}
      />
      <View style={{ marginLeft: SPACE_VALUES.small }}>
        <StyledText
          style={{
            ...typographyStyles.heading.small,
          }}
        >
          {claimRequest.professionalProfile.firstName}{' '}
          {claimRequest.professionalProfile.lastName}
        </StyledText>
        {claimRequest.professionalProfile.category && (
          <CategoryTag
            category={claimRequest.professionalProfile.category}
            showLabel={true}
          />
        )}
      </View>
    </View>
  </View>
);
