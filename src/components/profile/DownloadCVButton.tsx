import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import StyledText from '@/components/StyledText';

import { ACTION_BLUE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';

interface DownloadCVButtonProps {
  onPress: () => any;
  style?: any;
}

export function DownloadCVButton({ onPress, style }: DownloadCVButtonProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <StyledText
        style={{ ...typographyStyles.subtitle.regular, color: ACTION_BLUE }}
      >
        {t('shift_list_download_cv_text')}
      </StyledText>
    </TouchableOpacity>
  );
}
