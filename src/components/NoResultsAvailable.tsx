import React from 'react';
import { StyleSheet, View } from 'react-native';

import { commonStyles } from '@/styles/commonStyles';
import { LayoutTextEnum } from '@/styles/fonts';

import StyledText from './StyledText';

interface NoResultsAvailableProps {
  cardTitle: string;
  cardSubTitle: string;
  style?: object;
}

const NoResultsAvailable: React.FC<NoResultsAvailableProps> = ({
  cardTitle,
  cardSubTitle,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <View>
          <StyledText type={LayoutTextEnum.header} style={styles.title}>
            {cardTitle}
          </StyledText>
          <View style={styles.headerDetails}>
            <StyledText
              type={LayoutTextEnum.subHeader}
              style={styles.headerDetailText}
            >
              {cardSubTitle}
            </StyledText>
          </View>
        </View>
        <View />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ...commonStyles,
  header: {
    marginBottom: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerDetails: {
    flexDirection: 'row',
  },
  headerDetailText: {
    opacity: 0.5,
  },
  title: {
    marginBottom: 5,
  },
});

export default NoResultsAvailable;
