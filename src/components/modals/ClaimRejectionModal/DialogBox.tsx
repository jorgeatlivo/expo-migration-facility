import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Typography } from '@/components/atoms/Typography';
import CommonButton from '@/components/buttons/CommonButton';

import { NOTIFICATION_RED, PRIMARY_BLUE, WHITE } from '@/styles/colors';

interface DialogBoxProps {
  title: string;
  message: string | ReactNode;
  primaryButtonTitle: string;
  secondaryButtonTitle?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
  type: 'info' | 'warning' | 'error' | 'success' | 'alert';
}

// Map để link styles dựa trên type
const typeStylesMap = {
  error: {
    backgroundColor: NOTIFICATION_RED,
    borderColor: NOTIFICATION_RED,
    color: WHITE,
  },
  alert: {
    backgroundColor: NOTIFICATION_RED,
    borderColor: NOTIFICATION_RED,
    color: WHITE,
  },
  info: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
    color: WHITE,
  },
  warning: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
    color: WHITE,
  },
  success: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
    color: WHITE,
  },
};

const DialogBox: React.FC<DialogBoxProps> = ({
  title = '',
  message,
  primaryButtonTitle,
  secondaryButtonTitle,
  onPrimaryPress,
  onSecondaryPress,
  type,
}) => {
  const buttonStyles = typeStylesMap[type];

  return (
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
        <CommonButton
          title={primaryButtonTitle}
          onPress={onPrimaryPress}
          backgroundColor={buttonStyles.backgroundColor}
          borderColor={buttonStyles.borderColor}
          color={buttonStyles.color}
        />
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
};

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
