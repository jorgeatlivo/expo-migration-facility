import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import Row from '@/components/atoms/Row';
import StyledText from '@/components/StyledText';

import { BLUE_FADED, SLATE_GRAY } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

interface HeaderTabsProps {
  tabs: string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export const HeaderTabs: React.FC<HeaderTabsProps> = ({
  tabs,
  activeTab,
  onTabPress,
}) => {
  const { t } = useTranslation();

  return (
    <Row justifyContent={'space-between'} style={styles.row}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabPress(tab)}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
        >
          <StyledText
            style={[styles.tabLabel, activeTab === tab && styles.activeLabel]}
          >
            {t(tab)}
          </StyledText>
        </TouchableOpacity>
      ))}
    </Row>
  );
};

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: 1,
    borderBottomColor: BLUE_FADED,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACE_VALUES.medium,
    paddingHorizontal: SPACE_VALUES.medium,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#055186',
  },
  tabLabel: {
    ...typographyStyles.body.small,
    color: SLATE_GRAY,
  },
  activeLabel: {
    color: '#055186',
  },
});
