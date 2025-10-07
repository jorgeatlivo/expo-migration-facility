import React from 'react';
import { View } from 'react-native';

import { SPACE_VALUES } from '@/styles/spacing';

import LivoIcon from '@/assets/icons/LivoIcon';

interface IconButtonProps {
  name: string;
  color: string;
  backgroundColor: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  color,
  backgroundColor,
}) => (
  <View
    style={{
      borderRadius: 100,
      backgroundColor: backgroundColor,
      padding: SPACE_VALUES.tiny,
    }}
  >
    <LivoIcon name={name} size={24} color={color} />
  </View>
);
