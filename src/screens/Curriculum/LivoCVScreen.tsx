import React, { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { fetchLivoCVDetails } from '@/services/professionals';

import { LoadingScreen } from '@/components/common/LoadingScreen';
import { QualificationSection } from '@/components/widgets/Curriculum/QualificationSection';

import { useEffectOnce } from '@/hooks/useEffectOnce';
import { ScreenStyles } from '@/styles/common/screen';
import { SPACE_VALUES } from '@/styles/spacing';
import { LivoCVDetailsDTO } from '@/types/curriculum';

import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack';

type LivoCVScreenProps = StackScreenProps<
  ProtectedStackParamsList,
  ProtectedStackRoutes.LivoCV
>;

export const LivoCVScreen: React.FC<LivoCVScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [LivoCVData, setLivoCVData] = useState<LivoCVDetailsDTO | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: LivoCVData?.title ?? t('shift_list_curriculum_title'),
    });
  }, [LivoCVData?.title, navigation]);

  const loadLivoCVData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchLivoCVDetails(route.params.professionalId);
      setLivoCVData(data);
    } catch (error) {
      console.error(
        'Error loading curriculum for professional:',
        route.params.professionalId,
        'error:',
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffectOnce(() => {
    loadLivoCVData();
  });

  if (isLoading || !LivoCVData) {
    return <LoadingScreen />;
  }

  return (
    <View style={[ScreenStyles.screen]}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <QualificationSection
          qualification={LivoCVData.education}
          messageWhenEmpty={t('no-education-message')}
        />
        <QualificationSection
          qualification={LivoCVData.experience}
          style={styles.nonFirstQualification}
          messageWhenEmpty={t('no-experience-message')}
        />
        {LivoCVData.internship ? (
          <QualificationSection
            qualification={LivoCVData.internship}
            style={styles.nonFirstQualification}
          />
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingVertical: SPACE_VALUES.huge,
  },
  nonFirstQualification: { marginTop: SPACE_VALUES.large },
});
