import { View } from 'react-native';
import { ShiftCard } from '@/components/shiftList/ShiftCard';
import { RootState, Shift, ShiftTimeInDayEnum } from '@/types';
import { shiftTimeInDayLabels } from '@/components/claimReviews/Separators';
import { SPACE_VALUES } from '@/styles/spacing';
import { ShiftTimeSeparator } from '@/components/ShiftTimeSeparator';
import { useSelector } from 'react-redux';
import { CalendarListEmptyState } from './CalendarListEmptyState';
import moment from 'moment';
import Col from '@/components/atoms/Col';

interface CalendarShiftListProps {
  shifts: Shift[];
  isRefreshing: boolean;
  navigateToShiftDetails: (shiftId: number) => void;
  navigateToPublishShift: (shiftTimeInDay: string) => void;
}

export const CalendarShiftList = ({
  shifts,
  navigateToShiftDetails,
  navigateToPublishShift,
}: CalendarShiftListProps) => {
  const { daySelected } = useSelector(
    (state: RootState) => state.shiftData.calendarData
  );

  const renderShiftCards = (shiftList: Shift[]) =>
    shiftList.map((shift) => {
      return (
        <ShiftCard
          key={shift.id}
          shift={shift}
          navigateToShiftDetailsForShiftId={(shiftId) =>
            navigateToShiftDetails(shiftId)
          }
        />
      );
    });

  return (
    <Col gap={SPACE_VALUES.large}>
      {Object.keys(shiftTimeInDayLabels).map((shiftTimeInDay, index) => {
        const timeInDayShifts = shifts.filter(
          (shift) => shift.shiftTimeInDay === shiftTimeInDay
        );
        return (
          <View key={index}>
            <View
              style={{
                marginBottom: SPACE_VALUES.medium,
              }}
            >
              <ShiftTimeSeparator
                shiftTimeInDay={shiftTimeInDay as ShiftTimeInDayEnum}
                date={daySelected}
                onClick={() =>
                  navigateToPublishShift(
                    shiftTimeInDayLabels[shiftTimeInDay as ShiftTimeInDayEnum]
                      .publishShiftConfigKey
                  )
                }
              />
            </View>
            <Col gap={SPACE_VALUES.large}>
              {timeInDayShifts.length > 0 ? (
                renderShiftCards(timeInDayShifts)
              ) : (
                <CalendarListEmptyState
                  isFuture={moment(daySelected).isSameOrAfter(moment(), 'day')}
                  style={{
                    marginBottom: SPACE_VALUES.medium,
                  }}
                />
              )}
            </Col>
          </View>
        );
      })}
    </Col>
  );
};
