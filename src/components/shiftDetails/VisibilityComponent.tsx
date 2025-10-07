import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import LivoIcon from '@/assets/icons/LivoIcon';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { modalityTags } from '@/styles/utils';
import { ShiftModalityEnum } from '@/types';
import StyledText from '@/components/StyledText';
import Row from '@/components/atoms/Row';

interface VisibilityComponentProps {
  isExternalVisible: boolean;
  setIsExternalVisible: (isVisible: boolean) => void;
  isInternalVisible: boolean;
  setIsInternalVisible: (isVisible: boolean) => void;
  textInfo?: string;
  errorMessage?: string;
  style?: any;
}

export const VisibilityComponent: React.FC<VisibilityComponentProps> = ({
  isExternalVisible,
  setIsExternalVisible,
  isInternalVisible,
  setIsInternalVisible,
  textInfo,
  errorMessage,
  style,
}) => {
  const { t } = useTranslation();

  const visibilityItem = (
    isVisible: boolean,
    color: string,
    icon: string,
    displayText: string,
    itemStyle?: any
  ) => (
    <Row
      flex={1}
      alignItems={'center'}
      justifyContent={'space-between'}
      style={{
        padding: SPACE_VALUES.small,
        borderRadius: SPACE_VALUES.small,
        borderWidth: isVisible ? 2 : 1,
        borderStyle: 'solid',
        borderColor: isVisible ? color : '#C6D0DB',
        ...itemStyle,
      }}
    >
      <Row alignItems={'center'}>
        <LivoIcon name={icon} size={16} color={color} />
        <StyledText
          style={{
            ...typographyStyles.body.regular,
            color: '#2C3038',
            marginRight: SPACE_VALUES.small,
            marginLeft: SPACE_VALUES.tiny,
          }}
        >
          {displayText}
        </StyledText>
      </Row>
      <LivoIcon
        name={isVisible ? 'eye' : 'eye-closed'}
        size={24}
        color={color}
      />
    </Row>
  );

  return (
    <View
      style={{
        marginBottom: SPACE_VALUES.large,
        ...style,
      }}
    >
      <StyledText
        style={{
          ...typographyStyles.heading.small,
          marginBottom: SPACE_VALUES.medium,
        }}
      >
        {t('shift_list_visibility_label')}
      </StyledText>
      {textInfo ? (
        <StyledText
          style={{
            ...typographyStyles.info.caption,
            color: '#848DA9',
            marginBottom: SPACE_VALUES.small,
          }}
        >
          {textInfo}
        </StyledText>
      ) : null}
      <TouchableOpacity
        onPress={() => setIsExternalVisible(!isExternalVisible)}
        style={{
          flex: 1,
        }}
      >
        {visibilityItem(
          isExternalVisible,
          modalityTags[ShiftModalityEnum.EXTERNAL].color,
          modalityTags[ShiftModalityEnum.EXTERNAL].icon,
          t(modalityTags[ShiftModalityEnum.EXTERNAL].displayText),
          { marginBottom: SPACE_VALUES.medium }
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setIsInternalVisible(!isInternalVisible)}
        style={{
          flex: 1,
        }}
      >
        {visibilityItem(
          isInternalVisible,
          modalityTags[ShiftModalityEnum.INTERNAL].color,
          modalityTags[ShiftModalityEnum.INTERNAL].icon,
          t(modalityTags[ShiftModalityEnum.INTERNAL].displayText)
        )}
      </TouchableOpacity>
      {errorMessage ? (
        <StyledText
          style={{
            ...typographyStyles.info.caption,
            color: '#FA3D3B',
            marginTop: SPACE_VALUES.small,
          }}
        >
          {errorMessage}
        </StyledText>
      ) : null}
    </View>
  );
};
