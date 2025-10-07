import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BLACK, GRAY } from '@/styles/colors';

interface DayBoxProps {
  day: string;
  weekDay: string;
  containerSize: number;
}

const DayBox: React.FC<DayBoxProps> = ({ day, weekDay, containerSize }) => {
  const dayFontSize = (containerSize / 100) * 50;
  const weekDayFontSize = (containerSize / 100) * 25;
  const borderRadius = (containerSize / 2) * 0.4; // Adjust as needed

  return (
    <View
      style={[
        styles.boxContainer,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: borderRadius,
        },
      ]}
    >
      <Text style={[styles.dayStyle, { fontSize: dayFontSize }]}>{day}</Text>
      <Text style={[styles.weekDayStyle, { fontSize: weekDayFontSize }]}>
        {weekDay}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    borderWidth: 1,
    borderColor: GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 2,
  },
  dayStyle: {
    marginBottom: 0,
    color: BLACK,
    zIndex: 2,
  },
  weekDayStyle: {
    color: BLACK,
    zIndex: 2,
  },
});

export default DayBox;
