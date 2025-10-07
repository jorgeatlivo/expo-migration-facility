import React from 'react';
import { useTranslation } from 'react-i18next';
import StyledText from '@/components/StyledText';
import { typographyStyles } from '@/styles/livoFonts';

interface CalendarListEmptyStateProps {
  isFuture?: boolean;
  style?: any;
}

export const CalendarListEmptyState: React.FC<CalendarListEmptyStateProps> = ({
  isFuture,
  style,
}) => {
  const { t } = useTranslation();

  return (
    <StyledText style={[typographyStyles.body.regular, style]}>
      {t('calendar_shift_list_empty_state') +
        (isFuture ? ' ' + t('calendar_shift_list_empty_state_future_day') : '')}
    </StyledText>
  );
};
