import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { SelectCategoryComponent } from '@/components/publishShift/SelectCategoryComponent';

import {
  ProtectedStackParamsList,
  ProtectedStackRoutes,
} from '@/router/ProtectedStack';

type SelectCategoryScreenProps = StackScreenProps<
  ProtectedStackParamsList,
  ProtectedStackRoutes.SelectCategory
>;
export const SelectCategoryScreen: React.FC<SelectCategoryScreenProps> = ({
  navigation,
  route,
}) => {
  return (
    <SelectCategoryComponent
      categories={route.params.categories}
      onPressCategory={(category) => {
        route.params.onSelectCategory(category);
        navigation.goBack();
      }}
    />
  );
};
