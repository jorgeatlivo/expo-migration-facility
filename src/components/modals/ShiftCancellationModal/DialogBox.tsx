import React, { ReactNode } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Typography } from '@/components/atoms/Typography';
import ActionButton from '@/components/buttons/ActionButton';
import { PRIMARY_BLUE } from '@/styles/colors';

interface DialogBoxProps {
  title: string;
  message: string | ReactNode;
  primaryButtonTitle: string;
  secondaryButtonTitle?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
}

const DialogBox: React.FC<DialogBoxProps> = ({
  title = '',
  message,
  primaryButtonTitle,
  secondaryButtonTitle,
  onPrimaryPress,
  onSecondaryPress,
}) => (
  <View style={styles.container}>
    <View style={styles.content}>
      <Typography variant="heading/medium">{title}</Typography>
      {typeof message === 'string' ? (
        <Typography variant="body/regular">{message}</Typography>
      ) : (
        message
      )}
    </View>
    <View style={styles.buttonContainer}>
      <ActionButton title={primaryButtonTitle} onPress={onPrimaryPress} />
      {!!secondaryButtonTitle && !!onSecondaryPress && (
        <Pressable style={styles.secondaryButton} onPress={onSecondaryPress}>
          <Typography color={PRIMARY_BLUE} variant="action/regular">
            {secondaryButtonTitle}
          </Typography>
        </Pressable>
      )}
    </View>
  </View>
);

export default DialogBox;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 40,
    minHeight: 200,
  },
  content: {
    gap: 12,
  },
  buttonContainer: {
    gap: 8,
    width: '100%',
  },
  secondaryButton: {
    alignSelf: 'center',
    paddingVertical: 12,
  },
});
