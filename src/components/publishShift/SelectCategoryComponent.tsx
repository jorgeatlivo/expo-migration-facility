import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryTag } from '@/components/shiftDetails/CategoryTag';

import { SPACE_VALUES } from '@/styles/spacing';

import LivoIcon from '@/assets/icons/LivoIcon';
import { Category } from '@/types';

interface SelectCategoryComponentProps {
  onPressCategory: (category: Category) => void;
  categories: Category[];
}
export const SelectCategoryComponent: React.FC<
  SelectCategoryComponentProps
> = ({ onPressCategory, categories }) => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{
        flexGrow: 1,
        padding: SPACE_VALUES.medium,
        paddingBottom: insets.bottom,
        backgroundColor: '#fff',
      }}
    >
      {categories.map((category, index) => (
        <TouchableOpacity
          onPress={() => onPressCategory(category)}
          key={index}
          style={{
            borderRadius: SPACE_VALUES.small,
            paddingHorizontal: SPACE_VALUES.medium,
            paddingVertical: SPACE_VALUES.large,
            borderWidth: 1,
            borderColor: '#C6D0DB',
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: 'white',
            marginBottom: SPACE_VALUES.small,
          }}
        >
          <CategoryTag category={category} showLabel={true} />
          <LivoIcon name="chevron-right" size={24} color="#2C3038" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
