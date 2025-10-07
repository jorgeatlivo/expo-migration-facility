import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { IconDTO } from '@/types/widgets';
import { resolveIconSize } from '@/utils/utils';

import LivoIcon from '@/assets/icons/LivoIcon';

interface SDIconProps extends IconDTO {
  style?: StyleProp<ViewStyle>;
}

export function SDIcon(props: SDIconProps) {
  return (
    <View style={props.style}>
      <LivoIcon
        name={props.name}
        size={resolveIconSize(props.width!)}
        color={props.color!}
      />
    </View>
  );
}
