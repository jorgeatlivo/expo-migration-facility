import React, { useCallback, useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { ApiApplicationError } from '@/services/api';
import { fetchFacilityProfessionals } from '@/services/professionals';
import { ProfessionalProfile } from '@/services/shifts';

import { LoadingScreen } from '@/components/common/LoadingScreen';
import { FavoriteProfessionals } from '@/components/widgets/professionals/FavoriteProfessionals';

import { WHITE } from '@/styles/colors';

import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack.types';

type FavoriteProfessionalsScreenProps = StackScreenProps<
  ProtectedStackParamsList,
  ProtectedStackRoutes.FavoriteProfessionals
>;

export const FavoriteProfessionalsScreen: React.FC<
  FavoriteProfessionalsScreenProps
> = ({ route }) => {
  const { t } = useTranslation();

  const [facilityProfessionals, setFacilityProfessionals] = useState<
    ProfessionalProfile[]
  >([]);
  const [placeholder, setPlaceholder] = useState<{
    input: string;
    professionalsList: string;
  }>({ input: '', professionalsList: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  async function fetchProfessionals() {
    setLoading(true);
    fetchFacilityProfessionals()
      .then((response) => {
        setFacilityProfessionals(response.professionals);
        setPlaceholder(response.placeholder);
      })
      .catch((error) => {
        const errorMessage =
          error instanceof ApiApplicationError
            ? error.message
            : t('shift_list_error_server_message');
        Alert.alert(t('error_loading_favorite_professionals'), errorMessage);
        setFacilityProfessionals([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const fetchData = useCallback(() => {
    fetchProfessionals();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        {loading && !refreshing ? (
          <LoadingScreen />
        ) : (
          <FavoriteProfessionals
            professionals={facilityProfessionals}
            placeholder={placeholder}
            isRefreshing={refreshing}
            refreshData={refreshData}
            origin={route.params?.origin}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default FavoriteProfessionalsScreen;
