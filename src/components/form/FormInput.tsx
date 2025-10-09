import React from 'react';
import { StyleSheet, Text, TextInputProps, View } from 'react-native';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import PerformanceTextInput from '@/components/form/PerformanceTextInput';

import { RED } from '@/styles/colors';

interface FormInputProps<T extends FieldValues = FieldValues>
  extends Omit<TextInputProps, 'defaultValue'> {
  /** Field name in the form values */
  name: FieldPath<T>;
  /** react-hook-form control object */
  control: Control<T>;
  /** Validation rules */
  rules?: RegisterOptions<T, FieldPath<T>>;
  /** Input label text */
  label?: string;
  /** Custom error message (overrides default field error) */
  errorMessage?: string;
  /** Whether the input should take full width */
  fullWidthRow?: boolean;
  fullWidthColumn?: boolean;
}

function FormInput<T extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  label,
  errorMessage,
  fullWidthRow = false,
  fullWidthColumn = false,
  ...textInputProps
}: FormInputProps<T>): React.ReactElement {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, ref },
        formState: { defaultValues },
        fieldState: { error },
      }) => {
        // Determine if field is in error state
        const hasError = !!error;

        // Get appropriate error message
        const displayErrorMessage =
          errorMessage || (error?.message ? t(error?.message as never) : '');

        // Handle blur with form registration
        const handleBlur = () => {
          onBlur();
        };

        return (
          <View
            style={[
              styles.container,
              fullWidthRow && styles.fullWidthRowContainer,
              fullWidthColumn && styles.fullWidthColumnContainer,
            ]}
          >
            {/* Optional Label */}
            {label && <Text style={styles.label}>{label}</Text>}

            {/* Input Field using Performance TextInput */}
            <PerformanceTextInput
              ref={ref}
              {...textInputProps}
              onBlur={handleBlur}
              onChangeText={onChange}
              defaultValue={defaultValues ? (defaultValues[name] ?? '') : ''}
              containerStyle={hasError ? styles.errorInput : undefined}
            />

            {/* Error Message */}
            {hasError && (
              <Text style={styles.errorText}>{displayErrorMessage}</Text>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {},
  fullWidthRowContainer: {
    flex: 1,
  },
  fullWidthColumnContainer: {
    width: '100%',
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
  },
  errorText: {
    color: RED,
    fontSize: 12,
    marginTop: 4,
  },
  errorInput: {
    borderColor: RED,
  },
});

export default React.memo(FormInput) as typeof FormInput;
