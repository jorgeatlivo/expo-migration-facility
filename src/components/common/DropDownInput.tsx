import React from 'react';
import {
  Keyboard,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import Row from '@/components/atoms/Row';
import { Typography } from '@/components/atoms/Typography';

import {
  ACTION_BLACK,
  BADGE_GRAY,
  BLACK,
  BLUE_FADED,
  BORDER_GRAY,
  DARK_GRAY,
  DIVIDER_GRAY,
  NOTIFICATION_RED,
  WHITE,
} from '@/styles/colors';
import { SPACE_VALUES } from '@/styles/spacing';
import { interact } from '@/utils/frame';

import LivoIcon from '@/assets/icons/LivoIcon';

interface DropDownInputProps {
  selectedLabel: any;
  navigateToOptions: () => void;
  onPressSideEffect?: () => void;
  placeholder: string;
  isError?: boolean;
  placeholderAsLabel?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  style?: StyleProp<any>;
  iconName?: string;
}

export const DropDownInput: React.FC<DropDownInputProps> = ({
  selectedLabel,
  navigateToOptions,
  onPressSideEffect,
  placeholderAsLabel,
  placeholder,
  isError,
  numberOfLines = 1,
  disabled,
  style,
  iconName,
}) => {
  const renderBody = () => {
    const body = selectedLabel || placeholder;
    if (typeof body === 'string') {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}
        >
          {iconName ? (
            <View style={styles.icon}>
              <LivoIcon name={iconName} size={24} color={DIVIDER_GRAY} />
            </View>
          ) : null}
          <Typography
            numberOfLines={numberOfLines}
            ellipsizeMode="tail"
            style={[
              styles.label,
              {
                color: disabled
                  ? BADGE_GRAY
                  : !selectedLabel
                    ? BLUE_FADED
                    : BLACK,
              },
            ]}
          >
            {body}
          </Typography>
        </View>
      );
    }
    return <View style={styles.label}>{body}</View>;
  };

  return (
    <TouchableOpacity
      onPress={async () => {
        onPressSideEffect?.();
        Keyboard.dismiss();
        await interact();
        navigateToOptions();
      }}
      disabled={disabled}
      style={style}
    >
      <Row
        style={[
          styles.row,
          {
            backgroundColor: disabled ? DARK_GRAY : WHITE,
            borderColor: isError
              ? NOTIFICATION_RED
              : disabled
                ? DARK_GRAY
                : BORDER_GRAY,
          },
        ]}
      >
        {renderBody()}
        <LivoIcon
          name="chevron-down"
          size={24}
          color={disabled ? BADGE_GRAY : ACTION_BLACK}
        />
        {placeholderAsLabel && placeholder && selectedLabel && (
          <Typography
            variant={'info/overline'}
            style={[
              styles.floatingLabel,
              disabled && { backgroundColor: 'transparent' },
            ]}
          >
            {placeholder}
          </Typography>
        )}
      </Row>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACE_VALUES.medium,
    paddingVertical: SPACE_VALUES.medium,
  },
  label: {
    flex: 1,
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: SPACE_VALUES.small,
    padding: 0,
    paddingVertical: 0,
    paddingHorizontal: SPACE_VALUES.small,
    backgroundColor: WHITE,
  },
  icon: {
    marginRight: SPACE_VALUES.small,
  },
});
