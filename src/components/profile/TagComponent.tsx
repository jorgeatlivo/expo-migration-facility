import { View } from 'react-native';

import StyledText from '@/components/StyledText';

import { typographyStyles } from '@/styles/livoFonts';

interface TagComponentProps {
  text: string;
  color?: string;
  style?: any;
  backgroundColor?: string;
}

export const TagComponent: React.FC<TagComponentProps> = ({
  text,
  color = '#2C3038',
  style = {},
  backgroundColor = '#EEEFF3',
}) => (
  <View
    style={{
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      backgroundColor: backgroundColor, // Content-Content-Bonus-Regular
      ...style,
    }}
  >
    <StyledText
      style={{
        // TODO Locales
        ...typographyStyles.info.caption,
        color, //Text-Inverse
      }}
    >
      {text}
    </StyledText>
  </View>
);
