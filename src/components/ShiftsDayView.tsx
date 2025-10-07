import moment from 'moment';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { formatDate } from '@/common/utils';
import { PURPLE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { BORDER, SPACE_VALUES } from '@/styles/spacing';
import { DayShift, Shift } from '@/types';
import { shiftTimeInDayLabels } from './claimReviews/Separators';
import { TagComponent } from './profile/TagComponent';
import { ShiftCard } from './shiftList/ShiftCard';
import StyledText from './StyledText';
import Col from './atoms/Col';
import Row from './atoms/Row';

interface ShiftsDayViewProps {
  dayShift: DayShift;
  navigateToShiftDetails: (facilityShiftId: number) => void;
}
export const ShiftsDayView: React.FC<ShiftsDayViewProps> = ({
  dayShift,
  navigateToShiftDetails,
}) => {
  const { t } = useTranslation();

  const shiftsBySchedule: { [k: string]: Shift[] } = useMemo(
    () =>
      Object.keys(shiftTimeInDayLabels).reduce(
        (acc, schedule) => ({
          ...acc,
          [schedule]: dayShift.shifts.filter(
            (shift) => shift.shiftTimeInDay === schedule
          ),
        }),
        {}
      ),
    [dayShift]
  );

  const renderShiftCards = (shifts: Shift[], schedule: string) =>
    shifts.length > 0 ? (
      <Col gap={SPACE_VALUES.large} key={schedule}>
        {shifts.map((shift) => {
          return (
            <ShiftCard
              key={shift.id}
              shift={shift}
              navigateToShiftDetailsForShiftId={(shiftId) =>
                navigateToShiftDetails(shiftId)
              }
            />
          );
        })}
      </Col>
    ) : null;

  return (
    <Col gap={SPACE_VALUES.large}>
      <Row justifyContent={'space-between'}>
        <StyledText style={styles.date}>
          {formatDate(moment(dayShift.date).toDate())}
        </StyledText>
        {dayShift.holiday && (
          <TagComponent
            text={t('common_holiday')}
            color={PURPLE}
            style={styles.holidayTag}
          />
        )}
      </Row>

      {Object.keys(shiftsBySchedule).map((schedule) =>
        renderShiftCards(shiftsBySchedule[schedule], schedule)
      )}
    </Col>
  );
};

const styles = StyleSheet.create({
  date: {
    ...typographyStyles.heading.small,
    paddingRight: SPACE_VALUES.small,
  },
  holidayTag: {
    borderColor: PURPLE,
    paddingHorizontal: 2,
    borderWidth: BORDER.medium,
    paddingVertical: SPACE_VALUES.none,
  },
});
