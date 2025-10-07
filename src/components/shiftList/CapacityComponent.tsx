import React from 'react';
import { View } from 'react-native';

import LivoIcon from '@/assets/icons/LivoIcon';

interface CapacityComponentProps {
  acceptedClaims: number;
  pendingInvitationClaims: number;
  capacity: number;
}

export const CapacityComponent: React.FC<CapacityComponentProps> = ({
  acceptedClaims,
  pendingInvitationClaims,
  capacity,
}) => {
  const emptyClaims = capacity - acceptedClaims - pendingInvitationClaims;
  return (
    <View
      style={{
        flexDirection: 'row',
      }}
    >
      {Array.from({ length: acceptedClaims }, (_, i) => i + 1).map(
        (acceptedClaim, idx) => (
          <LivoIcon key={idx} name="user-check" color="#33B240" size={20} />
        )
      )}
      {Array.from({ length: pendingInvitationClaims }, (_, i) => i + 1).map(
        (pendingInvitationClaim, idx) => (
          <LivoIcon
            key={idx}
            name="pending-invitation"
            color="#EFB300"
            size={20}
          />
        )
      )}
      {Array.from({ length: emptyClaims }, (_, i) => i + 1).map(
        (emptyClaim, idx) => (
          <LivoIcon key={idx} name="user" color="#ACBBCB" size={20} />
        )
      )}
    </View>
  );
};
