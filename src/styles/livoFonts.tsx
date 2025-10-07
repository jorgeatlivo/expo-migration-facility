import { ColorValue } from 'react-native';

import { PRIMARY_BLUE } from './colors';

export enum FontSizeEnum {
  s01 = 11,
  s02 = 13,
  s03 = 14,
  l03 = 15,
  s04 = 16,
  s05 = 19,
  s06 = 23,
  s07 = 27,
  s08 = 32,
}

export enum LineHeightEnum {
  s01 = 16,
  s02 = 20,
  s03 = 24,
  s04 = 28,
  s05 = 32,
  s06 = 36,
  s07 = 40,
}

export enum LetterSpacingEnum {
  none = 0,
  small = 0.2,
  medium = 0.25,
}

export enum FontWeightEnum {
  strong = 'Roboto-Bold',
  medium = 'Roboto-Medium',
  regular = 'Roboto-Regular',
}

export type TextProperties = {
  fontSize: FontSizeEnum;
  lineHeight: LineHeightEnum;
  letterSpacing: LetterSpacingEnum;
  fontFamily: FontWeightEnum;
  color?: ColorValue;
};

export type TextSize = Partial<{
  xLarge: TextProperties;
  large: TextProperties;
  medium: TextProperties;
  small: TextProperties;
  regular: TextProperties;
  caption: TextProperties;
  overline: TextProperties;
}>;

export type TypographyStyles = {
  heading: TextSize;
  subtitle: TextSize;
  body: TextSize;
  action: TextSize;
  info: TextSize;
  link: TextSize;
  card: TextSize;
};

export const typographyStyles: TypographyStyles = {
  heading: {
    xLarge: {
      fontSize: FontSizeEnum.s08,
      lineHeight: LineHeightEnum.s07,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: FontWeightEnum.strong,
    },
    large: {
      fontSize: FontSizeEnum.s07,
      lineHeight: LineHeightEnum.s06,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: FontWeightEnum.strong,
    },
    medium: {
      fontSize: FontSizeEnum.s06,
      lineHeight: LineHeightEnum.s05,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: FontWeightEnum.strong,
    },
    small: {
      fontSize: FontSizeEnum.s05,
      lineHeight: LineHeightEnum.s03,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: FontWeightEnum.strong,
    },
  },
  subtitle: {
    regular: {
      fontSize: FontSizeEnum.s04,
      lineHeight: LineHeightEnum.s03,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: FontWeightEnum.medium,
    },
    small: {
      fontSize: FontSizeEnum.s02,
      lineHeight: LineHeightEnum.s02,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: FontWeightEnum.medium,
    },
    xLarge: {
      fontSize: FontSizeEnum.s06,
      fontFamily: FontWeightEnum.medium,
      lineHeight: LineHeightEnum.s04,
      letterSpacing: LetterSpacingEnum.none,
    },
  },
  body: {
    regular: {
      fontSize: FontSizeEnum.s04,
      lineHeight: LineHeightEnum.s03,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: FontWeightEnum.regular,
    },
    small: {
      fontSize: FontSizeEnum.s02,
      lineHeight: LineHeightEnum.s01,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: FontWeightEnum.regular,
    },
    large: {
      fontSize: FontSizeEnum.s05,
      lineHeight: LineHeightEnum.s04,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: FontWeightEnum.regular,
    },
  },
  action: {
    regular: {
      fontSize: FontSizeEnum.s04,
      lineHeight: LineHeightEnum.s01,
      letterSpacing: LetterSpacingEnum.medium,
      fontFamily: FontWeightEnum.medium,
    },
    small: {
      fontSize: FontSizeEnum.s02,
      lineHeight: LineHeightEnum.s01,
      letterSpacing: LetterSpacingEnum.small,
      fontFamily: FontWeightEnum.medium,
    },
  },
  info: {
    caption: {
      fontSize: FontSizeEnum.s02,
      lineHeight: LineHeightEnum.s02,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: FontWeightEnum.regular,
    },
    overline: {
      fontSize: FontSizeEnum.s01,
      lineHeight: LineHeightEnum.s01,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: FontWeightEnum.regular,
    },
  },
  link: {
    regular: {
      fontSize: FontSizeEnum.l03,
      lineHeight: LineHeightEnum.s03,
      letterSpacing: LetterSpacingEnum.medium,
      fontFamily: FontWeightEnum.medium,
      color: PRIMARY_BLUE,
    },
    small: {
      fontSize: FontSizeEnum.s02,
      lineHeight: LineHeightEnum.s02,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: FontWeightEnum.medium,
      color: PRIMARY_BLUE,
    },
  },
  card: {
    regular: {
      fontSize: FontSizeEnum.s03,
      lineHeight: LineHeightEnum.s01,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: FontWeightEnum.regular,
    },
  },
};
