import React from 'react';
import { StyleSheet } from 'react-native';

import { NotificationsBadge } from '@/components/common/NotificationsBadge';

import LivoIcon from '@/assets/icons/LivoIcon';

interface ShiftCardTagProps {
  totalPendingClaims: number;
  isFilled: boolean;
}
export const ShiftCardTag: React.FC<ShiftCardTagProps> = ({
  totalPendingClaims,
  isFilled,
}) => {
  if (isFilled) {
    return <LivoIcon name="circle-check-filled" size={20} color="#33B240" />;
  }

  if (totalPendingClaims > 0) {
    return <NotificationsBadge notifications={totalPendingClaims} />;
  }

  return <NotificationsBadge notifications={0} style={styles.invisible} />;
};

const styles = StyleSheet.create({
  invisible: {
    opacity: 0,
  },
});
