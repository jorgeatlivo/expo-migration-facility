import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import TouchableRow from '../common/TouchableRow';
import { ProtectedStackRoutes } from '@/router/ProtectedStack';

interface OpenFavoriteProfessionalsProps {
  navigation: NavigationProp<any>;
  style?: object;
}

export default function OpenFavoriteProfessionals({
  navigation,
  style,
}: OpenFavoriteProfessionalsProps) {
  const { t } = useTranslation();

  return (
    <TouchableRow
      leftIcon="heart"
      text={t('open_favorite_professionals_label')}
      style={style}
      onPress={() =>
        navigation.navigate(ProtectedStackRoutes.FavoriteProfessionals)
      }
    />
  );
}
