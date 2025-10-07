import React from 'react';
import { CompensationSelectionOption } from "@/services/shifts"
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import LivoIcon from '@/assets/icons/LivoIcon';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { ACTION_BLUE, BORDER_GRAY } from '@/styles/colors';
import StyledText from '@/components/StyledText';

interface CompensationSelectorProps {
  options: CompensationSelectionOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => any;
}

export function CompensationSelector(props: CompensationSelectorProps) {
  const toggleValue = (changedValue: string) => {
    if (props.selectedValues.includes(changedValue)) {
      props.onChange(props.selectedValues.filter(v => v !== changedValue))
    } else {
      props.onChange([...props.selectedValues, changedValue]);
    }
  }

  return (
    <View style={styles.container}>
      {props.options.map((option, index) => {
        const isSelected = props.selectedValues.includes(option.value);
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionContainer,
              {
                marginBottom: index < props.options.length - 1 ? 12 : 0,
              },
            ]}
            onPress={() => toggleValue(option.value)}
          >
            <StyledText style={styles.label}>{option.displayText}</StyledText>
            {isSelected ? (
              <LivoIcon name="checkbox-checked" color={ACTION_BLUE} size={24} />
            ) : (
              <LivoIcon
                name="checkbox-unchecked"
                color={BORDER_GRAY}
                size={24}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: BORDER_GRAY,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: SPACE_VALUES.large
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...typographyStyles.body.regular,
    marginLeft: SPACE_VALUES.tiny,
  },
});