import React, { useMemo } from 'react';
import {
  ColorValue,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from 'react-native';

import {
  TextProperties,
  TextSize,
  TypographyStyles,
  typographyStyles,
} from '@/styles/livoFonts';
import { Logger } from '@/services/logger.service';
import { BLACK } from '@/styles/colors';

type TypographyVariant = keyof TypographyStyles;
type TypographySize = keyof TextSize;
type CombinedVariant = `${TypographyVariant}/${TypographySize}`;

interface TypographyProps extends TextProps {
  variant?: CombinedVariant;
  children: React.ReactNode;
  color?: ColorValue;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  decoration?: 'none' | 'underline' | 'line-through' | 'underline line-through';
}

// Style cache to store previously calculated variant styles
const styleCache: Record<string, TextProperties> = {};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body/regular',
  children,
  style,
  color,
  align = 'left',
  decoration,
  ...props
}) => {
  // Use useMemo to compute styles only when dependencies change
  const textStyles = useMemo(() => {
    // Get cached variant style or compute it
    let _baseStyle: TextProperties | undefined = styleCache[variant];

    if (!_baseStyle) {
      // Parse the variant string to extract variant type and size
      const [variantType, sizeType] = variant.split('/') as [
        TypographyVariant,
        TypographySize
      ];

      // Get style from typography configuration
      const variantStyle = typographyStyles[variantType] || {};
      _baseStyle = variantStyle[sizeType] as TextProperties | undefined;

      // Cache the style for future use
      if (_baseStyle) {
        styleCache[variant] = _baseStyle;
      }
    }

    // Create the dynamic part of the style that can change between renders
    const _dynamicStyle: TextStyle = {
      textAlign: align,
    };

    if (color) {
      _dynamicStyle.color = color;
    }

    if (decoration) {
      _dynamicStyle.textDecorationLine = decoration;
    }

    return { baseStyle: _baseStyle, dynamicStyle: _dynamicStyle };
  }, [variant, color, align, decoration]);

  if (!textStyles.baseStyle) {
    Logger.warn(`Style not found for variant: ${variant}`);
    return (
      <Text style={style} {...props}>
        {children}
      </Text>
    );
  }

  // Render with optimized styles
  return (
    <Text
      style={[
        styles.text,
        textStyles.baseStyle,
        textStyles.dynamicStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: BLACK,
  },
});
