import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { typographyStyles } from '@/styles/livoFonts';
import StyledText from '@/components/StyledText';
import CommonButton from '@/components/buttons/CommonButton';
import { ACTION_BLUE, WHITE } from '@/styles/colors';
import { SPACE_VALUES } from '@/styles/spacing';

type ConfirmationModalProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  buttonTitle: string;
  dismissTitle: string;
  buttonDisabled?: boolean;
  buttonColor?: string;
  onPress: () => void;
  onDismiss: () => void;
}>;

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  subtitle,
  children,
  buttonTitle,
  dismissTitle,
  buttonDisabled,
  buttonColor,
  onPress,
  onDismiss,
}) => {
  return (
    <View>
      {title && <StyledText style={styles.title}>{title}</StyledText>}
      {subtitle && <StyledText style={styles.subtitle}>{subtitle}</StyledText>}
      {children}
      <View style={styles.actionRow}>
        <CommonButton
          title={buttonTitle}
          onPress={onPress}
          color={WHITE}
          backgroundColor={buttonColor || ACTION_BLUE}
          borderColor={buttonColor || ACTION_BLUE}
          undoTitle={dismissTitle}
          undoAction={onDismiss}
          disabled={buttonDisabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typographyStyles.heading.medium,
    marginBottom: SPACE_VALUES.medium,
  },
  subtitle: {
    ...typographyStyles.body.regular,
    marginBottom: SPACE_VALUES.medium,
  },
  actionRow: {
    paddingVertical: SPACE_VALUES.medium,
  },
});
