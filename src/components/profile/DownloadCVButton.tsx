import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {ACTION_BLUE} from '@/styles/colors';
import {typographyStyles} from '@/styles/livoFonts';
import StyledText from '../StyledText';

interface DownloadCVButtonProps {
  onPress: () => any;
  style?: any;
}

export function DownloadCVButton({onPress, style}: DownloadCVButtonProps) {
  const {t} = useTranslation();

  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <StyledText
        style={{...typographyStyles.subtitle.regular, color: ACTION_BLUE}}>
        {t('shift_list_download_cv_text')}
      </StyledText>
    </TouchableOpacity>
  );
}
