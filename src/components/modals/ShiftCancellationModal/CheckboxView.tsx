import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Typography } from '@/components/atoms/Typography';
import LabeledCheckbox from '@/components/common/LabeledCheckbox';

interface CheckboxViewProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

function CheckboxView({
  label,
  checked,
  onChange,
  disabled = false,
}: CheckboxViewProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onChange}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Typography variant="body/regular" style={styles.label}>
        {label}
      </Typography>
      <LabeledCheckbox
        option=""
        checked={checked}
        onPress={onChange}
        rowStyle={styles.checkboxRow}
        textStyle={styles.hiddenText}
      />
    </TouchableOpacity>
  );
}

export default CheckboxView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginVertical: 4,
  },
  label: {
    flex: 1,
    marginRight: 16,
  },
  checkboxRow: {
    margin: 0,
    padding: 0,
  },
  hiddenText: {
    display: 'none',
  },
});
