import React from 'react';
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
  StyleSheet,
} from 'react-native';
import LivoIcon from '@/assets/icons/LivoIcon';
import { BADGE_GRAY } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { TextDTO } from '@/types/widgets';
import StyledText from './StyledText';
import { SDText } from './common/SDText';

interface InfoRowProps {
  title?: string;
  subtitle?: string;
  titleTypography?: TextDTO;
  subtitleTypography?: TextDTO;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  numberOfLines?: number;
  textWrap?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  titleTypography,
  title,
  subtitleTypography,
  subtitle,
  iconName,
  iconSize = 24,
  iconColor = BADGE_GRAY,
  numberOfLines = 1,
  textWrap = false,
  style,
  textStyle,
}) => (
  <View style={[styles.row, style]}>
    {iconName && (
      <View style={styles.icon}>
        <LivoIcon name={iconName} size={iconSize} color={iconColor} />
      </View>
    )}

    {titleTypography ? (
      <View style={styles.column}>
        <SDText {...titleTypography} />
        {subtitleTypography && <SDText {...subtitleTypography} />}
      </View>
    ) : title ? (
      <>
        <StyledText
          numberOfLines={textWrap ? undefined : numberOfLines}
          ellipsizeMode={textWrap ? undefined : 'tail'}
          style={[styles.title, textStyle]}
        >
          {title}
        </StyledText>

        {subtitle && (
          <StyledText
            numberOfLines={textWrap ? undefined : numberOfLines}
            ellipsizeMode={textWrap ? undefined : 'tail'}
            style={[styles.subtitle, textStyle]}
          >
            {subtitle}
          </StyledText>
        )}
      </>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  icon: {
    marginRight: SPACE_VALUES.tiny,
  },
  title: {
    ...typographyStyles.body.regular,
    marginLeft: SPACE_VALUES.tiny,
    marginRight: SPACE_VALUES.small,
    flexShrink: 0,
  },
  subtitle: {
    ...typographyStyles.body.regular,
    color: BADGE_GRAY,
  },
});
