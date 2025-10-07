import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import StyledText from './StyledText';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import LivoIcon from '@/assets/icons/LivoIcon';
import moment from 'moment';
import { ShiftTimeInDayEnum } from '@/types';
import { shiftTimeInDayLabels } from './claimReviews/Separators';
import { useTranslation } from 'react-i18next';
import { ACTION_BLUE } from '@/styles/colors';
import Row from '@/components/atoms/Row';

interface ShiftTimeSeparatorProps {
  date: string;
  onClick: () => void;
  shiftTimeInDay: ShiftTimeInDayEnum;
}
export const ShiftTimeSeparator: React.FC<ShiftTimeSeparatorProps> = ({
  date,
  shiftTimeInDay,
  onClick,
}) => {
  const { t } = useTranslation();
  const props = shiftTimeInDayLabels[shiftTimeInDay];
  return (
    <Row alignItems={'center'} justifyContent={'space-between'}>
      <Row alignItems={'center'} justifyContent={'space-between'}>
        <LivoIcon name={props.iconName} size={24} color={props.color} />
        {/*@ts-ignore*/}
        <StyledText style={styles.label}>{t(props.label)}</StyledText>
      </Row>
      {!moment(date).isBefore(moment(), 'day') ? (
        <TouchableOpacity onPress={() => onClick()} style={styles.plusButton}>
          <LivoIcon name="plus" size={24} color={ACTION_BLUE} />
        </TouchableOpacity>
      ) : null}
    </Row>
  );
};

const styles = StyleSheet.create({
  label: {
    ...typographyStyles.subtitle.regular,
    marginLeft: SPACE_VALUES.tiny,
  },
  plusButton: {
    padding: SPACE_VALUES.tiny,
  },
});
